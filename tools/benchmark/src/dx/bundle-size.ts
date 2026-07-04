/**
 * @file dx/bundle-size.ts
 * @description Bundle size measurement per import path using esbuild
 *
 * Measures raw and gzip bytes for each configured import statement.
 * Receives a DxConfig -- no hardcoded package paths.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import type { DxConfig } from '../harness/dx-types.ts';

/** Measurement of a single import path's bundle size (raw and gzip) */
export interface BundleSizeResult {
 importPath: string;
 importStatement: string;
 rawBytes: number;
 gzipBytes: number;
 /** Declared gzip budget for this entry, when the dx-config gates it */
 budgetGzipBytes?: number;
}

const TEMP_DIR = fileURLToPath(new URL('../../.tmp/', import.meta.url));

// The gate's instrument must be the lab's PINNED esbuild (explicit
// devDependency, locked by the lab lockfile) — `npx esbuild` from an
// arbitrary cwd could resolve a different copy or network-fetch the latest
// release on a fresh runner, silently changing measured bytes.
const ESBUILD_BIN = fileURLToPath(new URL('../../node_modules/.bin/esbuild', import.meta.url));

/**
 * Measure bundle size for a specific import statement
 *
 * Creates a temporary entry file with the import, runs esbuild to
 * bundle it (tree-shaking enabled), and measures the output size.
 *
 * @param importStatement - ES module import statement to bundle
 * @param label - Human-readable label for the import path
 * @param cwd - Working directory for esbuild resolution
 * @returns Bundle size measurement, or null if bundling failed
 */
export function measureBundleSize(
 importStatement: string,
 label: string,
 cwd: string,
): BundleSizeResult | null {
 mkdirSync(TEMP_DIR, { recursive: true });
 const entryFile = join(TEMP_DIR, `entry-${process.pid}-${Date.now()}.mjs`);
 const outFile = join(TEMP_DIR, `out-${process.pid}-${Date.now()}.mjs`);

 try {
  writeFileSync(entryFile, importStatement);

  // Bundle with esbuild (tree-shaking enabled by default for ESM)
  execSync(
   `"${ESBUILD_BIN}" "${entryFile}" --bundle --format=esm --outfile="${outFile}" ` +
    `--resolve-extensions=.js,.mjs --platform=browser --minify 2>&1`,
   { cwd, encoding: 'utf-8' },
  );

  const rawBytes = statSync(outFile).size;

  // In-process zlib gzip: deterministic across platforms (system gzip
  // binaries differ by bytes) and hard-failing — a compression error must
  // never silently substitute raw size into a gated number.
  const gzipBytes = gzipSync(readFileSync(outFile)).byteLength;

  return { importPath: label, importStatement, rawBytes, gzipBytes };
 } catch (err: unknown) {
  console.warn(
   `  Could not measure bundle for "${label}": ${err instanceof Error ? err.message : String(err)}`,
  );
  return null;
 } finally {
  try {
   unlinkSync(entryFile);
  } catch {
   /* ignore */
  }
  try {
   unlinkSync(outFile);
  } catch {
   /* ignore */
  }
 }
}

/**
 * Run full bundle size analysis using the provided DxConfig
 *
 * @param config - DX configuration with import statements to measure
 * @returns Array of bundle size measurements per import path
 */
export function runBundleSizeAnalysis(config: DxConfig): BundleSizeResult[] {
 const results: BundleSizeResult[] = [];

 for (const { label, statement, budgetGzipBytes } of config.imports) {
  const result = measureBundleSize(statement, label, config.root);
  if (result) {
   results.push(budgetGzipBytes !== undefined ? { ...result, budgetGzipBytes } : result);
  }
 }

 return results;
}
