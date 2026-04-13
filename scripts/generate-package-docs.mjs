/**
 * @file scripts/generate-package-docs.mjs
 * @description Pre-build script that generates Docusaurus overview pages from package READMEs.
 *
 * Scans packages/*, reads each README.md, transforms it for Docusaurus compatibility
 * (strips badges, adds frontmatter), and writes to docs/docs/packages/<name>/overview.md.
 *
 * Run: node scripts/generate-package-docs.mjs
 * Wired into: docs/package.json "prebuild" step
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PACKAGES_DIR = join(ROOT, 'packages');
const OUTPUT_DIR = join(ROOT, 'docs', 'docs', 'packages');

/**
 * Discover all packages that have a package.json.
 */
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

/**
 * Transform a package README into a Docusaurus-friendly overview page.
 */
function transformReadme(content, pkg) {
 let result = content;

 // Strip badge lines ([![...](...)]\(...\) pattern on its own line)
 result = result.replace(/^\[!\[.*?\]\(.*?\)\]\(.*?\)\s*$/gm, '');

 // Strip standalone badge images (![...](https://img.shields.io/...))
 result = result.replace(/^!\[.*?\]\(https:\/\/img\.shields\.io\/.*?\)\s*$/gm, '');

 // Remove the H1 title (we use frontmatter title instead)
 result = result.replace(/^# .+\n*/m, '');

 // Strip relative links to files that don't exist in docs (ARCHITECTURE.md, CHANGELOG.md, LICENSE)
 // Convert [text](ARCHITECTURE.md) → **text** (preserve the text, remove the link)
 result = result.replace(
  /\[([^\]]+)\]\((?:\.\.\/)*(?:ARCHITECTURE\.md|CHANGELOG\.md|LICENSE|_media\/[^)]+)\)/g,
  '**$1**',
 );

 // Strip absolute GitHub links to repo files and convert to bold text
 // Catches both root files (CONTRIBUTING.md) and nested paths (docs/docs/contributing/...)
 result = result.replace(
  /\[([^\]]+)\]\(https:\/\/github\.com\/rndelpuerto\/lenguados\/blob\/main\/[^)]+\)/g,
  '**$1**',
 );

 // Clean up multiple blank lines left after stripping
 result = result.replace(/\n{3,}/g, '\n\n');

 // Add Docusaurus frontmatter (title renders as H1 automatically — no extra # heading)
 const frontmatter = [
  '---',
  `title: ${JSON.stringify(pkg.name)}`,
  `description: ${JSON.stringify(pkg.description)}`,
  'sidebar_position: 1',
  '---',
  '',
 ].join('\n');

 return frontmatter + result.trim() + '\n';
}

// Main
const packages = discoverPackages();
let generated = 0;

for (const pkg of packages) {
 if (!pkg.hasReadme) {
  console.log(`  skip ${pkg.dirName} (no README.md)`);
  continue;
 }

 try {
  const readmePath = join(PACKAGES_DIR, pkg.dirName, 'README.md');
  const content = readFileSync(readmePath, 'utf-8');
  const transformed = transformReadme(content, pkg);

  const outDir = join(OUTPUT_DIR, pkg.dirName);
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, 'overview.md');
  writeFileSync(outPath, transformed);
  console.log(`  generated ${pkg.dirName}/overview.md`);
  generated++;
 } catch (err) {
  console.error(`  ERROR processing ${pkg.dirName}: ${err.message}`);
  process.exitCode = 1;
 }
}

console.log(`[generate-package-docs] ${generated} overview(s) generated from ${packages.length} package(s)`);

// --- Cross-reference link map (shared by Phase 2 and Phase 3) ---

/**
 * Map from root guide filenames to their Docusaurus-relative paths.
 * Used to convert cross-references between root markdown files into
 * navigable links in the docs site.
 */
const ROOT_GUIDE_LINKS = {
 'DESIGN_PHILOSOPHY.md': 'guides/design-philosophy',
 'TSDOC_STANDARD.md': 'guides/tsdoc-standard',
 'TESTING_STRATEGY.md': 'guides/testing-strategy',
 'ICONOGRAPHY_STANDARD.md': 'guides/iconography-standard',
 'MODULE_EXPORTS.md': 'guides/module-exports',
 'CONTRIBUTING.md': 'contributing',
 'ARCHITECTURE.md': 'architecture',
};

// --- Phase 2: Generate engine-level guide pages from root markdown files ---

const GUIDES_OUTPUT = join(ROOT, 'docs', 'docs', 'guides');
const ROOT_GUIDES = [
 {
  source: 'DESIGN_PHILOSOPHY.md',
  output: 'design-philosophy.md',
  title: 'Design Philosophy',
  description: 'Performance-Oriented Architecture, SOLID deviations, and mechanical sympathy',
  position: 1,
 },
 {
  source: 'TSDOC_STANDARD.md',
  output: 'tsdoc-standard.md',
  title: 'TSDoc Standard',
  description: 'Canonical tag order, templates, and documentation conventions',
  position: 2,
 },
 {
  source: 'TESTING_STRATEGY.md',
  output: 'testing-strategy.md',
  title: 'Testing Strategy',
  description: 'Property-based testing, algebraic invariants, and tolerance conventions',
  position: 3,
 },
 {
  source: 'MODULE_EXPORTS.md',
  output: 'module-exports.md',
  title: 'Module Exports & Internals',
  description: 'Subpath exports, internal modules, and the classification framework for package APIs',
  position: 5,
 },
];

mkdirSync(GUIDES_OUTPUT, { recursive: true });
let guides = 0;

for (const guide of ROOT_GUIDES) {
 const sourcePath = join(ROOT, guide.source);
 if (!existsSync(sourcePath)) {
  console.log(`  skip guide ${guide.source} (not found)`);
  continue;
 }

 try {
  let content = readFileSync(sourcePath, 'utf-8');

  // Remove H1 title (frontmatter title is used)
  content = content.replace(/^# .+\n*/m, '');

  // Convert cross-references to root files into docs-site relative links
  // e.g., [TSDoc Standard](TSDOC_STANDARD.md) → [TSDoc Standard](./tsdoc-standard)
  content = content.replace(/\[([^\]]+)\]\(([A-Z][A-Z0-9_]*(?:\.[a-z]+)?)\)/g, (match, text, file) => {
   const docsPath = ROOT_GUIDE_LINKS[file];
   if (docsPath) {
    const rel = docsPath.startsWith('guides/') ? './' + docsPath.replace('guides/', '') : '../' + docsPath;
    return `[${text}](${rel})`;
   }
   return `**${text}**`;
  });

  const frontmatter = [
   '---',
   `title: ${JSON.stringify(guide.title)}`,
   `description: ${JSON.stringify(guide.description)}`,
   `sidebar_position: ${guide.position}`,
   '---',
   '',
  ].join('\n');

  writeFileSync(join(GUIDES_OUTPUT, guide.output), frontmatter + content.trim() + '\n');
  console.log(`  generated guides/${guide.output}`);
  guides++;
 } catch (err) {
  console.error(`  ERROR processing guide ${guide.source}: ${err.message}`);
  process.exitCode = 1;
 }
}

console.log(`[generate-package-docs] ${guides} guide(s) generated from root markdown files`);

// --- Phase 3: Generate root-level doc pages from root markdown files ---

const DOCS_OUTPUT = join(ROOT, 'docs', 'docs');

const ROOT_PAGES = [
 {
  source: 'ARCHITECTURE.md',
  output: 'architecture.md',
  title: 'Engine Architecture',
  description: 'Monorepo topology, package dependency graph, and shared infrastructure',
  position: 2,
 },
 {
  source: 'CONTRIBUTING.md',
  output: 'contributing/index.md',
  title: 'Contributing',
  description: 'How to set up, develop, and contribute to the lenguados physics engine',
  position: 5,
 },
];

let pages = 0;

for (const page of ROOT_PAGES) {
 const sourcePath = join(ROOT, page.source);
 if (!existsSync(sourcePath)) {
  console.log(`  skip page ${page.source} (not found)`);
  continue;
 }

 try {
  let content = readFileSync(sourcePath, 'utf-8');

  // Remove H1 title (frontmatter title is used)
  content = content.replace(/^# .+\n*/m, '');

  // Convert cross-references to other root files into docs-site links or bold text
  // e.g., [Design Philosophy](DESIGN_PHILOSOPHY.md) → [Design Philosophy](../guides/design-philosophy)
  // e.g., [Apache License 2.0](LICENSE) → **Apache License 2.0**
  content = content.replace(/\[([^\]]+)\]\(([A-Z][A-Z0-9_]*(?:\.[a-z]+)?)\)/g, (match, text, file) => {
   const docsPath = ROOT_GUIDE_LINKS[file];
   if (docsPath) {
    const fromDir = dirname(page.output);
    const rel = fromDir === '.' ? docsPath : '../' + docsPath;
    return `[${text}](${rel})`;
   }
   return `**${text}**`; // Bold text for root files without docs equivalent (LICENSE, etc.)
  });

  // Convert relative links to package files into bold text (not navigable in docs site)
  content = content.replace(
   /\[([^\]]+)\]\((?:packages\/[^)]+|docs\/docs\/[^)]+)\)/g,
   '**$1**',
  );

  // Strip absolute GitHub links to repo files and convert to bold text
  content = content.replace(
   /\[([^\]]+)\]\(https:\/\/github\.com\/rndelpuerto\/lenguados\/blob\/main\/[^)]+\)/g,
   '**$1**',
  );

  const frontmatter = [
   '---',
   `title: ${JSON.stringify(page.title)}`,
   `description: ${JSON.stringify(page.description)}`,
   `sidebar_position: ${page.position}`,
   '---',
   '',
  ].join('\n');

  const outPath = join(DOCS_OUTPUT, page.output);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, frontmatter + content.trim() + '\n');
  console.log(`  generated ${page.output}`);
  pages++;
 } catch (err) {
  console.error(`  ERROR processing page ${page.source}: ${err.message}`);
  process.exitCode = 1;
 }
}

console.log(`[generate-package-docs] ${pages} root page(s) generated`);

// --- Phase 4: Generate package-level companion docs from package root markdown files ---
// Scans each package for markdown files that match engine-wide standards (e.g., MODULE_EXPORTS.md).
// The filename at the package root must match a root-level standard to be discovered.

/**
 * Package-level companion docs. Each entry maps a root standard filename to its
 * Docusaurus output name, title template, and description template.
 * The title/description templates use {name} as a placeholder for the package name.
 */
const PACKAGE_COMPANIONS = [
 {
  source: 'MODULE_EXPORTS.md',
  output: 'module-exports.md',
  title: 'Module Exports & Internals',
  description: 'Classification decisions and subpath export rationale for {name}',
  position: 9,
 },
];

let companions = 0;

for (const pkg of packages) {
 for (const companion of PACKAGE_COMPANIONS) {
  const sourcePath = join(PACKAGES_DIR, pkg.dirName, companion.source);
  if (!existsSync(sourcePath)) continue;

  try {
   let content = readFileSync(sourcePath, 'utf-8');

   // Remove H1 title (frontmatter title is used)
   content = content.replace(/^# .+\n*/m, '');

   // Convert cross-references to root files into docs-site relative links
   content = content.replace(/\[([^\]]+)\]\(([A-Z][A-Z0-9_]*(?:\.[a-z]+)?)\)/g, (match, text, file) => {
    const docsPath = ROOT_GUIDE_LINKS[file];
    if (docsPath) {
     return `[${text}](../../${docsPath})`;
    }
    return `**${text}**`;
   });

   // Convert relative links to other package root files (../../MODULE_EXPORTS.md)
   content = content.replace(
    /\[([^\]]+)\]\(\.\.\/\.\.\/([A-Z][A-Z0-9_]*(?:\.[a-z]+)?)\)/g,
    (match, text, file) => {
     const docsPath = ROOT_GUIDE_LINKS[file];
     if (docsPath) {
      return `[${text}](../../${docsPath})`;
     }
     return `**${text}**`;
    },
   );

   const title = companion.title.replace('{name}', pkg.name);
   const description = companion.description.replace('{name}', pkg.name);

   const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `sidebar_position: ${companion.position}`,
    '---',
    '',
   ].join('\n');

   const outDir = join(OUTPUT_DIR, pkg.dirName);
   mkdirSync(outDir, { recursive: true });

   const outPath = join(outDir, companion.output);
   writeFileSync(outPath, frontmatter + content.trim() + '\n');
   console.log(`  generated ${pkg.dirName}/${companion.output}`);
   companions++;
  } catch (err) {
   console.error(`  ERROR processing ${pkg.dirName}/${companion.source}: ${err.message}`);
   process.exitCode = 1;
  }
 }
}

console.log(`[generate-package-docs] ${companions} companion doc(s) generated`);
