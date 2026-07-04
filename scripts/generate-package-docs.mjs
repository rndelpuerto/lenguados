/**
 * @file scripts/generate-package-docs.mjs
 * @description Pre-build step that mirrors canonical markdown sources into the Docusaurus site.
 *
 * Sources of truth:
 *   - Monorepo root: registered in scripts/doc-standards.root.mjs (standards applying to the whole engine).
 *   - Per-package: each packages/<pkg>/doc-standards.json declares which standards that package extends,
 *     plus any package-exclusive content.
 *   - Package READMEs are mirrored separately into docs/docs/packages/<pkg>/overview.md.
 *
 * Execution pipeline (idempotent, runs top to bottom on every invocation):
 *   - Phase 0 — Clean previously generated reflections (root standards + package overviews + package standards).
 *                Hand-written pages (intro.md, performance/*) are preserved by enumerating expected outputs.
 *                The `docs/docs/api/` tree is intentionally left alone: it is managed atomically by
 *                `docusaurus-plugin-typedoc` via its `cleanOutputDir: true` option; clearing it here
 *                creates a dev-server race where `sidebars.ts` loads before TypeDoc regenerates the tree.
 *                Also emits a non-destructive warning if a managed directory (package output dirs
 *                and root-managed dirs such as guides/, contributing/, performance/) contains
 *                slug-named `.md` files that are neither declared in a registry nor known
 *                hand-written pages (possible stale reflections from a removed standard).
 *   - Phase 1 — Reflect package READMEs into docs/docs/packages/<pkg>/overview.md.
 *   - Phase 2 — Reflect root standards from the root registry into docs/docs/<outputPath>.
 *   - Phase 3 — Reflect per-package standards from each package's registry into
 *                docs/docs/packages/<pkg>/<outputPath>.
 *
 * Transformations applied deterministically to every reflected source:
 *   1. Strip the leading "# H1" (title comes from frontmatter).
 *   2. Inject Docusaurus YAML frontmatter (title, description, sidebar_position).
 *   3. Rewrite cross-references (UPPER_SNAKE_CASE.md filenames and packages/<pkg>/ paths) into
 *       docs-site relative links based on the output locations in each registry.
 *   4. Convert portable markdown admonitions (> **Note:**, > **Warning:**, etc.) into Docusaurus ::: blocks.
 *   5. Rewrite absolute GitHub blob URLs whose target has a reflected docs page into docs-relative
 *       links (fragments preserved); all other absolute URLs are kept as-is — external links are
 *       navigable from any docs page and must never degrade to plain text.
 *   6. Collapse runs of three or more blank lines to a single blank line.
 *
 * Math formulas authored inside $...$ or $$...$$ are passed through unchanged; Docusaurus renders
 * them via remark-math + rehype-katex (registered in docs/docusaurus.config.ts).
 *
 * Failure modes:
 *   - A root standard flagged `required: true` that is missing on disk fails the run (process.exitCode = 1).
 *   - A package standard declared in doc-standards.json that is missing on disk emits a warning and skips.
 *   - A parse error inside a doc-standards.json fails the run with the offending file path.
 *
 * Invocation:
 *   - Manual: `node scripts/generate-package-docs.mjs`
 *   - Automatic: inlined into `docs/package.json` "start" and "build" scripts, so `npm run docs`
 *     always regenerates the site before Docusaurus renders.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join, resolve, dirname, posix } from 'path';
import { fileURLToPath } from 'url';

import prettier from 'prettier';

import rootStandards from './doc-standards.root.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PACKAGES_DIR = join(ROOT, 'packages');
const DOCS_OUTPUT = join(ROOT, 'docs', 'docs');
const PACKAGES_OUTPUT = join(DOCS_OUTPUT, 'packages');

// Generated reflections are gitignored (docs/.gitignore) yet still traversed by the
// root-level `npm run format:check` (`prettier --check .`): Prettier reads only the
// root .gitignore and .prettierignore, not nested .gitignore files. Formatting the
// output here keeps regeneration idempotent under that gate.

/**
 * Writes generated markdown formatted with the repository Prettier config.
 * Config is resolved per output file (with editorconfig, matching the CLI)
 * so the result is byte-identical to what `prettier --check` expects.
 *
 * @param {string} outPath - Destination file path
 * @param {string} content - Raw generated markdown
 * @returns {Promise<void>}
 */
const writeFormatted = async (outPath, content) => {
 const config = await prettier.resolveConfig(outPath, { editorconfig: true });
 writeFileSync(outPath, await prettier.format(content, { ...config, filepath: outPath }));
};

// --- Shared helpers ---

/**
 * Remove the leading `# Heading` and any blank lines that follow it.
 * Docusaurus renders the frontmatter title as H1; a second H1 in the body would duplicate it.
 */
function stripH1(content) {
 return content.replace(/^#\s.+\n*/m, '');
}

/**
 * Build a Docusaurus YAML frontmatter block.
 */
function buildFrontmatter({ title, description, sidebarPosition }) {
 return [
  '---',
  `title: ${JSON.stringify(title)}`,
  `description: ${JSON.stringify(description)}`,
  `sidebar_position: ${sidebarPosition}`,
  '---',
  '',
 ].join('\n');
}

/**
 * Convert portable markdown blockquotes with known admonition keywords into Docusaurus ::: blocks.
 *
 * Recognised prefixes (case-insensitive): Note, Warning, Tip, Info, Caution, Danger.
 * Blockquotes with other bolded leads (for example "Status:", "Historical precedent:") pass through
 * as regular blockquotes so they continue to render as plain prose.
 */
function transformAdmonitions(content) {
 const KEYWORDS = /^> \*\*(note|warning|tip|info|caution|danger):\*\*\s*(.*)$/i;
 const lines = content.split('\n');
 const out = [];

 let i = 0;
 while (i < lines.length) {
  const first = lines[i].match(KEYWORDS);
  if (!first) {
   out.push(lines[i]);
   i++;
   continue;
  }

  const type = first[1].toLowerCase();
  const body = [first[2]];
  let j = i + 1;
  // Collect continuation lines that also start with "> "
  while (j < lines.length && /^> /.test(lines[j])) {
   body.push(lines[j].replace(/^> ?/, ''));
   j++;
  }

  out.push(`:::${type}`);
  out.push('');
  out.push(body.join('\n').trim());
  out.push('');
  out.push(':::');
  i = j;
 }

 return out.join('\n');
}

/**
 * Rewrite absolute GitHub blob URLs into docs-site relative links when the target file has a
 * reflected docs page (a registered standard, or a package README reflected as overview.md).
 * Unknown targets keep their absolute URL untouched: absolute GitHub links are navigable from
 * any docs page, so a working link must never degrade to plain text. Fragment suffixes
 * (`FOO.md#section`) are preserved on rewritten links.
 *
 * @param {string} content    Markdown content being transformed.
 * @param {string} currentDir Docs-site directory of the output file, relative to docs/docs.
 * @param {Map<string, Map<string, string>>} packageRegistries Per-package filename → docs path maps.
 */
function rewriteAbsoluteRepoLinks(content, currentDir, packageRegistries) {
 return content.replace(
  /\[([^\]]+)\]\(https:\/\/github\.com\/rndelpuerto\/lenguados\/blob\/main\/([^)#]+)(#[^)]*)?\)/g,
  (match, text, repoPath, fragment) => {
   const target = resolveRepoPathToDocsTarget(repoPath, packageRegistries);
   if (!target) return match;
   return `[${text}](${resolveDocsRelative(currentDir, target)}${fragment ?? ''})`;
  },
 );
}

/**
 * Map a repository-relative file path to its reflected docs page (path under docs/docs, no
 * extension), or undefined when the file has no reflection (for example CHANGELOG.md, LICENSE).
 */
function resolveRepoPathToDocsTarget(repoPath, packageRegistries) {
 const packageFile = repoPath.match(/^packages\/([a-z][a-z0-9-]*)\/(.+)$/);
 if (packageFile) {
  const [, pkgDir, file] = packageFile;
  if (file === 'README.md' && packageRegistries.has(pkgDir)) {
   return `packages/${pkgDir}/overview`;
  }
  return packageRegistries.get(pkgDir)?.get(file);
 }
 return rootByFilename.get(repoPath);
}

/**
 * Cross-reference rewriter.
 *
 * Each scope emits an output file at a known position inside docs/docs. The source files reference
 * other standards by filename (`FOO.md`) or relative path (`../../FOO.md`). This function replaces
 * those links with docs-site relative paths.
 *
 * Disambiguation:
 *   - A bare `[X](FOO.md)` from a ROOT source resolves against the root registry.
 *   - A bare `[X](FOO.md)` from a PACKAGE source resolves first against the package's own
 *     registry, then against the root registry.
 *   - `[X](../../FOO.md)` escapes the package boundary and resolves against the root
 *     registry. (A `[X](../../pkg/FOO.md)` cross-package form is NOT supported — link the
 *     reflected docs-site page directly if a cross-package reference is ever needed.)
 *
 * @param content      The markdown content being transformed.
 * @param sourceKind   "root" | "package"
 * @param pkgStandards Per-package registry entries (empty array for root scope).
 * @param outputPath   The output file's path under docs/docs (used to compute relative links).
 * @param pkg          Optional package metadata when sourceKind is "package".
 */
// Strip .md extension and collapse `/index` landing pages to their parent slug
// (Docusaurus serves `foo/index.md` as URL `/foo`, not `/foo/index`).
function stripDocsSuffix(p) {
 return p.replace(/\.md$/, '').replace(/\/index$/, '');
}

// Root registry lookup: UPPER_SNAKE_CASE.md filename → docs-site path (no extension).
const rootByFilename = new Map();
for (const std of rootStandards) {
 rootByFilename.set(std.filename, stripDocsSuffix(std.outputPath));
}

/**
 * Compute a docs-site relative link from `currentDir` (a directory under docs/docs) to
 * `targetAbs` (a path under docs/docs without extension).
 */
function resolveDocsRelative(currentDir, targetAbs) {
 const rel = posix.relative(currentDir, targetAbs);
 return rel.startsWith('.') ? rel : './' + rel;
}

function rewriteCrossRefs(
 content,
 { sourceKind, pkgStandards, outputPath, pkg, packageRegistries },
) {
 const packageByFilename = new Map();
 for (const std of pkgStandards) {
  packageByFilename.set(std.filename, stripDocsSuffix(std.outputPath));
 }

 const packagesByDirAndFilename = packageRegistries ?? new Map();

 // Base docs-site directory of the current output, relative to DOCS_OUTPUT.
 const currentDir = posix.dirname(outputPath.split('/').join(posix.sep));

 // Each pattern captures an optional `#fragment` suffix (`FOO.md#section`) and re-appends it
 // to the rewritten docs-relative path; the bold fallback drops the fragment with the link.

 // Pattern 1: [text](packages/<pkg>/FILE.md) — cross-package reference (typically from root).
 content = content.replace(
  /\[([^\]]+)\]\(packages\/([a-z][a-z0-9-]*)\/([A-Z][A-Z0-9_]*\.md)(#[^)]*)?\)/g,
  (match, text, pkgDir, file, fragment) => {
   const inner = packagesByDirAndFilename.get(pkgDir);
   if (inner) {
    const target = inner.get(file);
    if (target) return `[${text}](${resolveDocsRelative(currentDir, target)}${fragment ?? ''})`;
   }
   return `**${text}**`;
  },
 );

 // Pattern 2: [text](../../FILE.md) or [text](../../pkg/FILE.md) — escapes to root scope.
 content = content.replace(
  /\[([^\]]+)\]\((?:\.\.\/)+([A-Z][A-Z0-9_]*\.md)(#[^)]*)?\)/g,
  (match, text, file, fragment) => {
   const target = rootByFilename.get(file);
   if (target) return `[${text}](${resolveDocsRelative(currentDir, target)}${fragment ?? ''})`;
   return `**${text}**`;
  },
 );

 // Pattern 3: [text](FILE.md) — bare filename.
 content = content.replace(
  /\[([^\]]+)\]\(([A-Z][A-Z0-9_]*\.md)(#[^)]*)?\)/g,
  (match, text, file, fragment) => {
   // Package scope: prefer the package registry first.
   if (sourceKind === 'package' && pkg) {
    const packageTarget = packageByFilename.get(file);
    if (packageTarget) {
     const absTarget = `packages/${pkg.dirName}/${packageTarget}`;
     return `[${text}](${resolveDocsRelative(currentDir, absTarget)}${fragment ?? ''})`;
    }
   }
   // Root scope or package fallback: consult the root registry.
   const rootTarget = rootByFilename.get(file);
   if (rootTarget) {
    return `[${text}](${resolveDocsRelative(currentDir, rootTarget)}${fragment ?? ''})`;
   }
   // Unknown filename — convert to bold so the docs site does not emit a broken-link warning.
   return `**${text}**`;
  },
 );

 // Pattern 4: [text](LICENSE) or other non-.md root files.
 content = content.replace(/\[([^\]]+)\]\(LICENSE\)/g, '**$1**');

 return content;
}

/**
 * Apply the full transform pipeline to a markdown source and return the Docusaurus-ready output.
 */
function transform(
 content,
 { standard, sourceKind, pkgStandards, outputPath, pkg, packageRegistries },
) {
 let result = content;
 result = stripH1(result);
 result = rewriteCrossRefs(result, {
  sourceKind,
  pkgStandards: pkgStandards ?? [],
  outputPath,
  pkg,
  packageRegistries,
 });
 result = transformAdmonitions(result);
 result = rewriteAbsoluteRepoLinks(
  result,
  posix.dirname(outputPath.split('/').join(posix.sep)),
  packageRegistries ?? new Map(),
 );
 // Collapse excessive blank lines (common after content stripping).
 result = result.replace(/\n{3,}/g, '\n\n');
 return (
  buildFrontmatter({
   title: standard.title,
   description: standard.description,
   sidebarPosition: standard.sidebarPosition,
  }) +
  result.trim() +
  '\n'
 );
}

/**
 * Transform a package README into a Docusaurus-friendly overview page.
 */
function transformReadme(content, pkg, packageRegistries) {
 let result = content;
 // Strip badge lines.
 result = result.replace(/^\[!\[.*?\]\(.*?\)\]\(.*?\)\s*$/gm, '');
 result = result.replace(/^!\[.*?\]\(https:\/\/img\.shields\.io\/.*?\)\s*$/gm, '');
 // Remove the H1 title (frontmatter title is used).
 result = result.replace(/^# .+\n*/m, '');
 // Convert relative links to package root companions into bold text — overview targets npm/docs.
 result = result.replace(
  /\[([^\]]+)\]\((?:\.\.\/)*(?:ARCHITECTURE\.md|CHANGELOG\.md|LICENSE|_media\/[^)]+)\)/g,
  '**$1**',
 );
 // Rewrite absolute GitHub blob links to their reflected docs pages when one exists;
 // keep unknown targets (CHANGELOG.md, LICENSE, ...) as working absolute links.
 result = rewriteAbsoluteRepoLinks(result, `packages/${pkg.dirName}`, packageRegistries);
 // Clean up multiple blank lines.
 result = result.replace(/\n{3,}/g, '\n\n');

 const frontmatter = buildFrontmatter({
  title: pkg.name,
  description: pkg.description,
  sidebarPosition: 1,
 });
 return frontmatter + result.trim() + '\n';
}

// --- Discovery ---

function discoverPackages() {
 return readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => existsSync(join(PACKAGES_DIR, d.name, 'package.json')))
  .map((d) => {
   const pkgJson = JSON.parse(readFileSync(join(PACKAGES_DIR, d.name, 'package.json'), 'utf-8'));
   return {
    dirName: d.name,
    name: pkgJson.name || d.name,
    description: pkgJson.description || '',
    hasReadme: existsSync(join(PACKAGES_DIR, d.name, 'README.md')),
   };
  });
}

function loadPackageStandards(pkg) {
 const path = join(PACKAGES_DIR, pkg.dirName, 'doc-standards.json');
 if (!existsSync(path)) return [];
 try {
  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  if (!Array.isArray(parsed)) {
   throw new Error(`${path} must contain a JSON array`);
  }
  return parsed;
 } catch (err) {
  throw new Error(`Failed to parse ${path}: ${err.message}`);
 }
}

// --- Main ---

const packages = discoverPackages();

// Build a lookup of per-package registries so cross-package `[text](packages/<pkg>/FILE.md)`
// references in root sources can be resolved without re-reading doc-standards.json every call.
const packageRegistries = new Map();
for (const pkg of packages) {
 const stds = loadPackageStandards(pkg);
 const inner = new Map();
 for (const std of stds) {
  inner.set(std.filename, `packages/${pkg.dirName}/${stripDocsSuffix(std.outputPath)}`);
 }
 packageRegistries.set(pkg.dirName, inner);
}

// --- Phase 0: Clean previously generated outputs ---
//
// Clean-slate regeneration: every run removes the exact set of files this script will
// produce. Hand-written pages (intro.md, performance/*, docs/src/, docs/static/) are
// preserved by enumerating the expected outputs rather than wiping entire directories.
// The TypeDoc-generated `docs/docs/api/` tree is deliberately left alone — see the note
// above the Phase 0 deletions below for the race-condition rationale.

function removeIfExists(absPath) {
 if (!existsSync(absPath)) return false;
 unlinkSync(absPath);
 return true;
}

let cleaned = 0;

// Note: docs/docs/api/ is managed exclusively by docusaurus-plugin-typedoc
// (its `cleanOutputDir: true` handles the clean step on every build). Deleting
// it here in a pre-build step creates a transient window where sidebars.ts
// loads before TypeDoc regenerates, producing spurious "cannot find module"
// errors in dev mode. Leave it alone and let the plugin manage its own output.

// 0.b — Root standard reflections (Phase 2 outputs).
for (const std of rootStandards) {
 if (removeIfExists(join(DOCS_OUTPUT, std.outputPath))) cleaned++;
}

// 0.c — Per-package Phase 1 overview + Phase 3 standard reflections.
for (const pkg of packages) {
 const pkgSiteDir = join(PACKAGES_OUTPUT, pkg.dirName);
 if (existsSync(join(pkgSiteDir, 'overview.md'))) {
  unlinkSync(join(pkgSiteDir, 'overview.md'));
  cleaned++;
 }
 const pkgStds = packageRegistries.get(pkg.dirName);
 if (!pkgStds) continue;
 for (const pkgStd of loadPackageStandards(pkg)) {
  const outPath = join(pkgSiteDir, pkgStd.outputPath);
  if (removeIfExists(outPath)) cleaned++;
 }
}

console.log(`[generate-package-docs] cleaned ${cleaned} previously generated file(s)`);

// 0.d — Orphan detection (non-destructive warning).
// After cleanup, any UPPER_SNAKE_CASE-derived .md file (kebab-case slug) remaining inside a
// managed output directory — package output dirs and root-managed dirs (docs/docs root,
// guides/, contributing/, performance/) — is likely stale from a removed registry entry.
// Known hand-written pages (intro.md, performance/*) are whitelisted. Orphans are not
// deleted automatically (to avoid destroying hand-written content), but are flagged.
const MANAGED_SLUG = /^[a-z][a-z0-9-]*\.md$/;
function warnOrphanFiles(dir, knownOutputs) {
 if (!existsSync(dir)) return;
 const kept = new Set(knownOutputs);
 for (const entry of readdirSync(dir, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (!MANAGED_SLUG.test(entry.name)) continue;
  if (kept.has(entry.name)) continue;
  // (_category_.json, _meta.js and README.md never match MANAGED_SLUG above.)
  console.warn(
   `  warn: ${posix.join(posix.relative(DOCS_OUTPUT, dir), entry.name)} has no registered source — remove manually if stale.`,
  );
 }
}

for (const pkg of packages) {
 const pkgSiteDir = join(PACKAGES_OUTPUT, pkg.dirName);
 const known = ['overview.md'];
 const pkgStds = loadPackageStandards(pkg);
 for (const std of pkgStds) known.push(std.outputPath);
 warnOrphanFiles(pkgSiteDir, known);
}

// Root-managed output directories: expected outputs come from the root registry, plus the
// known hand-written pages that live alongside the reflections.
const rootKnownByDir = new Map([
 ['.', ['intro.md']],
 ['performance', ['overview.md', 'methodology.md', 'interpreting-results.md']],
]);
for (const std of rootStandards) {
 const dir = posix.dirname(std.outputPath);
 if (!rootKnownByDir.has(dir)) rootKnownByDir.set(dir, []);
 rootKnownByDir.get(dir).push(posix.basename(std.outputPath));
}
for (const [dir, known] of rootKnownByDir) {
 warnOrphanFiles(join(DOCS_OUTPUT, dir), known);
}

// Phase 1: package READMEs -> docs/docs/packages/<pkg>/overview.md
let overviewCount = 0;
for (const pkg of packages) {
 if (!pkg.hasReadme) {
  console.log(`  skip ${pkg.dirName} (no README.md)`);
  continue;
 }
 try {
  const readmePath = join(PACKAGES_DIR, pkg.dirName, 'README.md');
  const content = readFileSync(readmePath, 'utf-8');
  const transformed = transformReadme(content, pkg, packageRegistries);
  const outDir = join(PACKAGES_OUTPUT, pkg.dirName);
  mkdirSync(outDir, { recursive: true });
  await writeFormatted(join(outDir, 'overview.md'), transformed);
  console.log(`  generated packages/${pkg.dirName}/overview.md`);
  overviewCount++;
 } catch (err) {
  console.error(`  ERROR processing ${pkg.dirName} README: ${err.message}`);
  process.exitCode = 1;
 }
}
console.log(`[generate-package-docs] ${overviewCount} overview(s) generated`);

// Phase 2: root standards -> docs/docs/<outputPath>
let rootCount = 0;
for (const std of rootStandards) {
 const sourcePath = join(ROOT, std.filename);
 if (!existsSync(sourcePath)) {
  if (std.required) {
   console.error(`  ERROR missing required root standard: ${std.filename}`);
   process.exitCode = 1;
  } else {
   console.log(`  skip root standard ${std.filename} (not found, optional)`);
  }
  continue;
 }
 try {
  const content = readFileSync(sourcePath, 'utf-8');
  const transformed = transform(content, {
   standard: std,
   sourceKind: 'root',
   outputPath: std.outputPath,
   packageRegistries,
  });
  const outPath = join(DOCS_OUTPUT, std.outputPath);
  mkdirSync(dirname(outPath), { recursive: true });
  await writeFormatted(outPath, transformed);
  console.log(`  generated ${std.outputPath}`);
  rootCount++;
 } catch (err) {
  console.error(`  ERROR processing root standard ${std.filename}: ${err.message}`);
  process.exitCode = 1;
 }
}
console.log(`[generate-package-docs] ${rootCount} root standard(s) generated`);

// Phase 3: per-package standards -> docs/docs/packages/<pkg>/<outputPath>
let packageCount = 0;
for (const pkg of packages) {
 const pkgStandards = loadPackageStandards(pkg);
 if (pkgStandards.length === 0) continue;

 for (const std of pkgStandards) {
  const sourcePath = join(PACKAGES_DIR, pkg.dirName, std.filename);
  if (!existsSync(sourcePath)) {
   console.warn(`  warn: ${pkg.name} declares ${std.filename} but file not found; skipping`);
   continue;
  }
  try {
   const content = readFileSync(sourcePath, 'utf-8');
   const outputPath = `packages/${pkg.dirName}/${std.outputPath}`;
   const transformed = transform(content, {
    standard: std,
    sourceKind: 'package',
    pkgStandards,
    outputPath,
    pkg,
    packageRegistries,
   });
   const outPath = join(DOCS_OUTPUT, outputPath);
   mkdirSync(dirname(outPath), { recursive: true });
   await writeFormatted(outPath, transformed);
   console.log(`  generated ${outputPath}`);
   packageCount++;
  } catch (err) {
   console.error(`  ERROR processing ${pkg.dirName}/${std.filename}: ${err.message}`);
   process.exitCode = 1;
  }
 }
}
console.log(`[generate-package-docs] ${packageCount} package standard(s) generated`);
