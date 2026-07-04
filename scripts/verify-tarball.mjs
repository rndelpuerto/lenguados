#!/usr/bin/env node
/**
 * @file scripts/verify-tarball.mjs
 * @description
 * Verifies that every publishable workspace package would pack a complete
 * npm tarball. Runs `npm pack --dry-run --json --ignore-scripts` per package
 * and asserts the reported file list contains: the three entry files, the
 * root-export bundles they reference, every concrete `lib/` path the
 * package's `exports` map references, and at least one packed file per
 * `lib/` glob pattern declared in `exports`.
 *
 * `--ignore-scripts` is deliberate: the gate must validate the build output
 * already on disk, not a state produced by lifecycle hooks, so a broken
 * workflow build cannot be masked by the per-package `prepack` build.
 *
 * @example
 *   node scripts/verify-tarball.mjs
 * @returns {Promise<void>}
 */

import { exec as execCb } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const exec = promisify(execCb);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = path.join(repoRoot, 'packages');

/**
 * Baseline paths every publishable package tarball must contain: the three
 * entry files plus the root bundles referenced from their file contents
 * (these references live inside main.js/main.mjs/dev-main.mjs, not in the
 * `exports` map, so they cannot be derived from the manifest).
 */
const BASELINE_FILES = [
 'main.js',
 'main.mjs',
 'dev-main.mjs',
 'lib/cjs/index.production.js',
 'lib/cjs/index.development.js',
 'lib/esm/module.js',
 'lib/esm/index.development.js',
 // Load-bearing marker: {"type":"module","sideEffects":false}. Without it,
 // plain-Node imports re-parse every tree module and consumer bundlers lose
 // whole-module elimination (the nearest package.json shadows the root flag).
 'lib/esm/package.json',
 'lib/@types/index.d.ts',
 // Storefront and legal files: npm auto-packs README/LICENSE from the package
 // root, NOTICE only via the files array; the prepack hook copies LICENSE and
 // NOTICE from the repository root (Apache-2.0 requires both in the artifact).
 'README.md',
 'LICENSE',
 'NOTICE',
];

/**
 * Lists publishable workspace package directories (skips `private: true`).
 *
 * @returns {{ name: string, dir: string, manifest: object }[]} Publishable package descriptors
 */
const publishablePackages = () => {
 return readdirSync(packagesDir)
  .map((entry) => path.join(packagesDir, entry))
  .filter((dir) => existsSync(path.join(dir, 'package.json')))
  .map((dir) => ({
   dir,
   manifest: JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')),
  }))
  .filter(({ manifest }) => manifest.private !== true)
  .map(({ dir, manifest }) => ({ name: manifest.name, dir, manifest }));
};

/**
 * Collects every string leaf of an `exports`-style nested object.
 *
 * @param {object | string} node - Exports map node (string leaf or condition object)
 * @param {string[]} out - Accumulator for string leaves
 * @returns {string[]} All string leaves found under the node
 */
const collectExportLeaves = (node, out = []) => {
 if (typeof node === 'string') {
  out.push(node);
 } else if (node && typeof node === 'object') {
  for (const value of Object.values(node)) collectExportLeaves(value, out);
 }
 return out;
};

/**
 * Derives the per-package verification sets from its manifest `exports`:
 * concrete `lib/` paths (exact membership) and `lib/` glob patterns
 * (at-least-one-match), each normalized without the leading `./`.
 *
 * @param {object} manifest - Parsed package.json
 * @returns {{ concrete: string[], globs: RegExp[] }} Required paths and glob matchers
 */
const requirementsFromExports = (manifest) => {
 const leaves = collectExportLeaves(manifest.exports ?? {})
  .filter((leaf) => leaf.startsWith('./lib/'))
  .map((leaf) => leaf.slice(2));
 const concrete = [...new Set(leaves.filter((leaf) => !leaf.includes('*')))];
 const globs = [...new Set(leaves.filter((leaf) => leaf.includes('*')))].map(
  (pattern) =>
   new RegExp(
    `^${pattern.replaceAll(/[.+?^${}()|[\]\\]/g, String.raw`\$&`).replaceAll('*', '.+')}$`,
   ),
 );

 return { concrete, globs };
};

/**
 * Verifies one package's dry-run tarball content against the baseline and
 * its own `exports`-derived requirements.
 *
 * @param {{ dir: string, manifest: object }} pkg - Package descriptor
 * @returns {Promise<{ missing: string[], checked: number }>} Missing entries and total checks
 */
const verifyPackage = async ({ dir, manifest }) => {
 // Legal files are copied from the repository root at pack time (prepack) —
 // but this gate runs with --ignore-scripts, and on a fresh checkout the
 // gitignored copies do not exist yet. Synchronizing them here is safe: the
 // sync is deterministic file copying and cannot mask a broken BUILD, which
 // is what --ignore-scripts protects against.
 await exec(`node ${JSON.stringify(path.join(repoRoot, 'scripts', 'sync-legal-files.mjs'))}`, {
  cwd: dir,
 });

 const { stdout } = await exec('npm pack --dry-run --json --ignore-scripts', { cwd: dir });
 const [report] = JSON.parse(stdout);
 const packed = new Set(report.files.map((file) => file.path));
 const { concrete, globs } = requirementsFromExports(manifest);
 const required = [...new Set([...BASELINE_FILES, ...concrete])];

 const missing = required.filter((file) => !packed.has(file));
 for (const glob of globs) {
  if (![...packed].some((file) => glob.test(file))) {
   missing.push(`${glob.source} (no packed file matches this exports glob)`);
  }
 }

 return { missing, checked: required.length + globs.length };
};

/**
 * Verifies every publishable package and exits 1 when any tarball is incomplete.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
 const packages = publishablePackages();
 let failed = false;

 for (const pkg of packages) {
  try {
   const { missing, checked } = await verifyPackage(pkg);

   if (missing.length > 0) {
    failed = true;
    console.error(`✗ ${pkg.name}: tarball is missing required files:`);
    for (const file of missing) console.error(`    - ${file}`);
    console.error('  Run "npm run dist" at the monorepo root before publishing.');
   } else {
    console.log(`✓ ${pkg.name}: tarball satisfies all ${checked} required artifact checks`);
   }
  } catch (err) {
   failed = true;
   console.error(`✗ ${pkg.name}: npm pack --dry-run failed:`, err.message ?? err);
  }
 }

 if (failed) process.exit(1);
};

main();
