/**
 * @file scripts/doc-standards.root.mjs
 * @description Root-level documentation standards registry.
 *
 * Declares which root markdown files are reflected into the Docusaurus site,
 * and where their output pages land. Consumed by generate-package-docs.mjs.
 *
 * Each entry is a standard that applies to the whole monorepo. Package-level
 * extensions of these standards are declared separately in
 * `packages/<pkg>/doc-standards.json`.
 *
 * Schema:
 *   {
 *     id:              string  — stable slug identifier
 *     filename:        string  — source file at monorepo root (UPPER_SNAKE_CASE.md)
 *     outputPath:      string  — destination under docs/docs/ (e.g. "guides/design-philosophy.md")
 *     title:           string  — Docusaurus frontmatter title
 *     description:     string  — Docusaurus frontmatter description
 *     sidebarPosition: number  — numeric order within sidebar category
 *     required:        boolean — if true, missing source fails the build
 *   }
 */

export default [
 {
  id: 'architecture',
  filename: 'ARCHITECTURE.md',
  outputPath: 'architecture.md',
  title: 'Engine Architecture',
  description: 'Monorepo topology, package dependency graph, and shared infrastructure',
  sidebarPosition: 2,
  required: true,
 },
 {
  id: 'contributing',
  filename: 'CONTRIBUTING.md',
  outputPath: 'contributing/index.md',
  title: 'Contributing',
  description: 'How to set up, develop, and contribute to the lenguados physics engine',
  sidebarPosition: 5,
  required: true,
 },
 {
  id: 'design-philosophy',
  filename: 'DESIGN_PHILOSOPHY.md',
  outputPath: 'guides/design-philosophy.md',
  title: 'Design Philosophy',
  description: 'Performance-Oriented Architecture, SOLID deviations, and mechanical sympathy',
  sidebarPosition: 1,
  required: true,
 },
 {
  id: 'tsdoc-standard',
  filename: 'TSDOC_STANDARD.md',
  outputPath: 'guides/tsdoc-standard.md',
  title: 'TSDoc Standard',
  description: 'Canonical tag order, templates, and documentation conventions',
  sidebarPosition: 2,
  required: true,
 },
 {
  id: 'testing-strategy',
  filename: 'TESTING_STRATEGY.md',
  outputPath: 'guides/testing-strategy.md',
  title: 'Testing Strategy',
  description: 'Property-based testing, algebraic invariants, and tolerance conventions',
  sidebarPosition: 3,
  required: true,
 },
 {
  id: 'iconography-standard',
  filename: 'ICONOGRAPHY_STANDARD.md',
  outputPath: 'guides/iconography-standard.md',
  title: 'Iconography Standard',
  description:
   'Icon library, placement rules, sizing, color, accessibility, and density guidelines for the documentation site',
  sidebarPosition: 4,
  required: true,
 },
 {
  id: 'module-exports',
  filename: 'MODULE_EXPORTS.md',
  outputPath: 'guides/module-exports.md',
  title: 'Module Exports and Internals',
  description:
   'Subpath exports, internal modules, and the classification framework for package APIs',
  sidebarPosition: 5,
  required: true,
 },
];
