## Why

The `@lenguados/math2d` package carries 33 markdown files (5 at root + 28 in `docs/`) — the accumulated output of research phases, audits, and standards documents. This is 16x more documentation files than industry-standard packages. Popular libraries (gl-matrix, three.js, pixi.js, zod, Effect-TS, tRPC, TanStack Query) keep 1-2 markdown files per package: README.md and optionally CHANGELOG.md. No surveyed library maintains a `docs/` directory inside individual packages — all depth documentation lives on a dedicated docs site.

Meanwhile, a Docusaurus site already exists at the monorepo root (`docs/`) with auto-generated TypeDoc API reference, but its `intro.md` is still the default Docusaurus template and no hand-written narrative docs have been migrated. The `package.json` `files` field already excludes all `.md` files from npm publish, so the extra documentation has zero npm visibility — it only creates contributor confusion through content duplication (architecture described in 6 places, triality explained in 5 places) and language fragmentation (4 documents in Spanish).

## What Changes

- **Remove `packages/math2d/docs/` directory entirely** — migrate 7 active documents to Docusaurus site (1 stale doc excluded), delete 18 archive files and 1 stale audit (preserved in git history)
- **Keep `ARCHITECTURE.md`** at package root (matklad convention) — update to link to Docusaurus deep-dive; merge `core_principles.md` unique content into Docusaurus architecture page
- **Create NEW root `ARCHITECTURE.md`** at monorepo root (30-60 lines) — monorepo topology, package relationships, pointer to `packages/math2d/ARCHITECTURE.md`, translated to English
- **Remove `CONTRIBUTING.md`** from package root — absorb package-specific API conventions into root `CONTRIBUTING.md`
- **Remove `DOCUMENTATION_STANDARD.md`** from package root — move to Docusaurus as contributor guide
- **Create `docs/docs/math2d/` section** in Docusaurus (position 2) with architecture, interoperability, edge-cases, design-decisions, and audit-closure pages
- **Create `docs/docs/contributing/` section** in Docusaurus (position 3) with TSDoc standard, testing strategy, and design philosophy
- **Rewrite `docs/docs/intro.md`** from Docusaurus template boilerplate to actual Getting Started content
- **Translate all Spanish-language documents** to English during migration
- **Deduplicate industry comparisons** between design-decisions and design-philosophy pages
- **Update both READMEs** (root and math2d) documentation links to point to Docusaurus
- **Update `CLAUDE.md`** and `.claude/rules/` references to point to new locations
- **Package root reduced to 3 .md files**: README.md + CHANGELOG.md + ARCHITECTURE.md (matklad convention — code map stays with the code)

## Capabilities

### New Capabilities

- `docs-site-math2d-section`: Hand-written narrative documentation for math2d on the Docusaurus site — architecture (merged + translated), interoperability, edge cases, design decisions, audit closure. Organized as sidebar category "math2d" at position 2 with `_category_.json` and `generated-index`.
- `docs-site-contributing-section`: Contributor guides on the Docusaurus site — TSDoc standard (migrated verbatim), testing strategy (translated + fixed), design philosophy (deduplicated). Organized as sidebar category "Contributing" at position 3.
- `package-docs-convention`: Convention enforcement — math2d package root contains only README.md and CHANGELOG.md. No `docs/` directory inside packages. English-only documentation. Relative linking convention for cross-document references.

### Modified Capabilities

- `docs-curation`: Existing spec governs docs organization — modifying to reflect removal of `packages/math2d/docs/`, migration to Docusaurus, exclusion of stale `code_review_findings_2026.md`, and removal of research archive.
- `math2d-readme-restructure`: Existing spec governs README content — modifying documentation links to point to Docusaurus, updating root README links, rewriting Docusaurus intro.md.
- `contributing-guide-expansion`: Existing spec governs contributing guide — modifying to absorb package-level API conventions into root guide with Docusaurus depth links, adding CLAUDE.md update requirements.

## Impact

- **Affected paths**: `packages/math2d/*.md` (3 files removed), `packages/math2d/docs/` (entire directory removed — 28 files), `docs/docs/` (10 new files + 2 `_category_.json` + 1 rewritten intro), `README.md` (root, link updates), `CONTRIBUTING.md` (root, expanded), `CLAUDE.md` (reference updates), `.claude/rules/` (verification)
- **No runtime code changes** — pure documentation restructure
- **No impact on tree-shaking or bundle size** — `.md` files already excluded from npm publish via `files` whitelist
- **Architecture layers affected**: None (documentation only)
- **Languages affected**: 4 Spanish-language documents translated to English
- **Rollback**: All removed files are recoverable from git history. Docusaurus additions are additive and independently revertable.
