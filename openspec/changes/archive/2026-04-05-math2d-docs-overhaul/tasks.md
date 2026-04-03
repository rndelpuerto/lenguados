## 1. Research & Content Gathering

- [x] 1.1 Inventory all current exports from `packages/math2d/src/index.ts` — build a verified list of every exported type, class, function, and constant with their exact names
- [x] 1.2 Read the current root `README.md`, `CHANGELOG.md`, and `CONTRIBUTING.md` to understand baseline content
- [x] 1.3 Read the current `packages/math2d/README.md`, `CONTRIBUTING.md`, and `ARCHITECTURE.md`
- [x] 1.4 Scan `packages/math2d/docs/` to catalog every file and classify as current vs. archive-candidate
- [x] 1.5 Read git log and archived OpenSpec changes to reconstruct changelog entries for unreleased work

## 2. Root README.md Rewrite

- [x] 2.1 Draft root `README.md` following the DX funnel pattern (title, badges, highlights, install, quick-start, packages table, docs link, contributing link, license) — max 150 lines
- [x] 2.2 Add shields.io badge row: npm version, CI status, coverage, bundle size, license, TypeScript
- [x] 2.3 Write feature highlights (5 bullets: determinism, zero-allocation, tree-shakeable validation, triality, TypeScript-first)
- [x] 2.4 Write quick-start code example demonstrating Vector2 + Transform2 with out parameter pattern
- [x] 2.5 Add monorepo packages table with links
- [x] 2.6 Retain bilingual (EN/ES) description section
- [x] 2.7 Adversarial review: verify every import, method call, and API name in code examples compiles against current source

## 3. math2d README.md Restructure

- [x] 3.1 Draft `packages/math2d/README.md` following npm package conventions (title, badges, highlights, install, quick-start, API overview, key concepts, performance tips, docs link, license) — max 250 lines
- [x] 3.2 Write API Overview table grouped by architectural layer (auxiliary, core, deterministic, types, validation, utils)
- [x] 3.3 Write Key Concepts section (triality, out parameter, CS variants, apply vs transform) — 2-3 sentences each
- [x] 3.4 Write condensed Performance Tips section (out parameter, CS variants, Unchecked variants) — max 30 lines with code examples
- [x] 3.5 Write quick-start showing import, Vector2 creation, static method with out, instance chaining, Transform2 usage
- [x] 3.6 Adversarial review: verify every entry in API table exists as an export in `index.ts`, verify every code example compiles

## 4. CHANGELOG Normalization

- [x] 4.1 Read existing `CHANGELOG.md` and extract all current entries
- [x] 4.2 Cross-reference git log (`git log --oneline`) and OpenSpec archived changes to identify undocumented significant changes
- [x] 4.3 Rewrite `CHANGELOG.md` in Keep a Changelog format with proper categories (Added, Changed, Fixed, etc.)
- [x] 4.4 Ensure each entry has bold area prefix format (`- **area**: description`)
- [x] 4.5 Ensure `## [Unreleased]` section captures all work since last release

## 5. Contributing Guides

- [x] 5.1 Rewrite root `CONTRIBUTING.md` as comprehensive onboarding guide (prerequisites, setup, workflow, commits, style, testing, package links, issues, license) — max 200 lines
- [x] 5.2 Document Git hooks (pre-commit, pre-push, commitlint) with explanations
- [x] 5.3 Add conventional commit examples for each type (feat, fix, docs, refactor, test, chore)
- [x] 5.4 Review `packages/math2d/CONTRIBUTING.md` — verify all file paths, commands, architecture references, and API conventions are current
- [x] 5.5 Update any stale references in math2d CONTRIBUTING.md

## 6. math2d ARCHITECTURE.md Update

- [x] 6.1 Review `packages/math2d/ARCHITECTURE.md` against current source structure
- [x] 6.2 Update or add Mermaid diagram for layer dependencies
- [x] 6.3 Verify all referenced patterns (allocation control, triality, semantic naming) match current implementation

## 7. docs/ Directory Curation

- [x] 7.1 Audit each file in `packages/math2d/docs/` — classify as active (current reference) or archive (historical)
- [x] 7.2 Move obsolete research/phase files to `docs/research/archive/` if not already there
- [x] 7.3 Check for content duplication between `ARCHITECTURE.md` and `docs/architecture/core_principles.md` — consolidate or add redirect
- [x] 7.4 Check if `docs/standards/tsdoc_and_naming.md` is superseded by `DOCUMENTATION_STANDARD.md` — consolidate or archive
- [x] 7.5 Rewrite `packages/math2d/docs/README.md` in English as authoritative index with sections for current docs and historical archive
- [x] 7.6 Verify all relative links between docs files resolve correctly

## 8. Cross-Document Consistency & Final Verification

- [x] 8.1 Verify consistent terminology across all markdown files (triality, out parameter, CS variants, column-major, tree-shakeable, cross-platform determinism)
- [x] 8.2 Verify all internal links between markdown files resolve (README → CONTRIBUTING, README → ARCHITECTURE, etc.)
- [x] 8.3 Verify all code blocks have language identifiers (`typescript, `bash, etc.)
- [x] 8.4 Verify each markdown file has exactly one H1 header
- [x] 8.5 Run `npm run build` and `npm run test:unit` to confirm no regressions
- [x] 8.6 Final read-through of all modified files for accuracy and completeness
