## ADDED Requirements

### Requirement: R-PKG-LEAN-ROOT

The `packages/math2d/` directory SHALL contain exactly 3 markdown files at the root level:

1. `README.md` — npm storefront and quick-start guide
2. `CHANGELOG.md` — version history (Lerna-managed)
3. `ARCHITECTURE.md` — code map (matklad convention) — short bird's-eye view of the package's internal layering

No other `.md` files SHALL exist at `packages/math2d/` root. Files previously at root (`CONTRIBUTING.md`, `DOCUMENTATION_STANDARD.md`) SHALL be migrated to the Docusaurus site or root `CONTRIBUTING.md` before deletion.

**Rationale:** ARCHITECTURE.md is a recognized root-level convention file (matklad, 2021), analogous to README and CONTRIBUTING. Its value is inseparable from its location — a contributor who clones the repo immediately finds the code map. rust-analyzer places detailed architecture at `docs/dev/architecture.md`; ts-graphviz (a TS monorepo) keeps `ARCHITECTURE.md` at root. For lenguados, the detailed package-specific layering (6 layers, Mermaid diagram, zero-check conventions) stays at `packages/math2d/ARCHITECTURE.md` as the authoritative deep-dive for the package's internals. The root-level `ARCHITECTURE.md` provides the monorepo topology and points here for depth.

#### Scenario: Package root contains only convention files

- **WHEN** `packages/math2d/*.md` is listed via glob
- **THEN** only `README.md`, `CHANGELOG.md`, and `ARCHITECTURE.md` are present
- **AND** no other `.md` files exist at that level

#### Scenario: ARCHITECTURE.md is a code map

- **WHEN** `packages/math2d/ARCHITECTURE.md` is inspected
- **THEN** it contains the 6-layer architecture description, Mermaid dependency diagram, key patterns, and zero-check conventions
- **AND** it is under 200 lines (concise code map, not exhaustive documentation)

### Requirement: R-MONOREPO-ROOT-ARCHITECTURE

The monorepo root SHALL contain an `ARCHITECTURE.md` file (NEW) describing the overall repository topology:

1. Monorepo structure (which packages exist and their purpose)
2. Dependency graph between packages (`common ← math2d ← examples`)
3. Shared infrastructure (scripts/, docs/, openspec/)
4. Pointer to `packages/math2d/ARCHITECTURE.md` for the detailed math2d layer description

The root ARCHITECTURE.md SHALL be 30-60 lines — a lightweight "map" per the matklad convention. It SHALL NOT duplicate the detailed math2d layering (that lives in the package-level file).

**Rationale:** The matklad convention calls for ARCHITECTURE.md "next to README and CONTRIBUTING" — at the repository root. No monorepo surveyed (ts-graphviz, deno/std, Docusaurus) uses per-package ARCHITECTURE.md as the ONLY location. A root-level file provides the entry point; the package-level file provides the deep dive.

#### Scenario: Root ARCHITECTURE.md exists

- **WHEN** the monorepo root is listed
- **THEN** `ARCHITECTURE.md` exists alongside `README.md`, `CONTRIBUTING.md`, and `CHANGELOG.md`

#### Scenario: Root ARCHITECTURE.md is lightweight

- **WHEN** the root `ARCHITECTURE.md` is inspected
- **THEN** it is under 60 lines
- **AND** it links to `packages/math2d/ARCHITECTURE.md` for the detailed math2d architecture

#### Scenario: No duplication between levels

- **WHEN** the root `ARCHITECTURE.md` and `packages/math2d/ARCHITECTURE.md` are compared
- **THEN** the root file describes monorepo topology (packages, dependencies, infrastructure)
- **AND** the package file describes internal layers (deterministic, auxiliary, core, types, validation, utils)
- **AND** the 6-layer architecture detail appears only in the package-level file

### Requirement: R-PKG-NO-DOCS-DIR

The `packages/math2d/docs/` directory SHALL NOT exist. All documentation previously in this directory SHALL be migrated to the Docusaurus site (`docs/docs/`) or preserved only in git history.

**Rationale:** In monorepos with a dedicated docs site, per-package `docs/` directories create a competing information silo. Popular monorepo libraries (tRPC, TanStack Query, Radix UI, pixi.js, Effect-TS) do NOT have `docs/` inside their packages — all documentation lives in a centralized docs site. The `packages/math2d/docs/` directory currently contains 28 files across 6 subdirectories; this content should be consolidated into the existing Docusaurus site at `docs/docs/`.

#### Scenario: No docs directory in package

- **WHEN** `packages/math2d/docs/` path is checked
- **THEN** the directory does not exist

#### Scenario: Active docs migrated to Docusaurus

- **WHEN** the 8 active documentation files from `packages/math2d/docs/` are searched for
- **THEN** each one has a corresponding page in `docs/docs/math2d/` or `docs/docs/contributing/`

### Requirement: R-PKG-ARCHIVE-DELETED

The `packages/math2d/docs/research/archive/` directory and all files within it SHALL be removed from the working tree. These are completed research phase artifacts (2025-2026) that are preserved in git history and do not need explicit migration.

The `packages/math2d/docs/audits/code_review_findings_2026.md` SHALL also be deleted rather than migrated, because it contains factual errors (describes `SeededRandomSource` as "Park-Miller LCG" when it was replaced with xoshiro128++ per CHANGELOG) and 100% of its accurate content is duplicated in other documents.

#### Scenario: Archive files removed

- **WHEN** `packages/math2d/docs/research/archive/` is checked
- **THEN** the directory does not exist

#### Scenario: Stale audit document not migrated

- **WHEN** the Docusaurus site is searched for content from `code_review_findings_2026.md`
- **THEN** no page containing that stale content exists
- **AND** the file is only recoverable from git history

#### Scenario: Files recoverable from git

- **WHEN** a contributor needs a historical research file (e.g., `phase1_vector2.md`)
- **THEN** they can retrieve it via `git log` and `git show` from the commit history

### Requirement: R-PKG-LANGUAGE-ENGLISH

All documentation in the repository SHALL be written in English. During migration, any document currently written in Spanish (e.g., `core_principles.md`, `testing_strategy.md`, `ultimate_audit_report.md`) SHALL be translated to English. Spanish-language "vision" statements or quotes MAY be preserved as blockquotes with English translation immediately following.

**Rationale:** The project's README, CONTRIBUTING, CLAUDE.md, and the majority of documentation are in English. Spanish-only documents fragment the audience and are inaccessible to the broader open-source community. Technical documentation for npm packages SHALL use the same language as the codebase and primary documentation.

#### Scenario: Migrated documents are in English

- **WHEN** any page in `docs/docs/math2d/` or `docs/docs/contributing/` is inspected
- **THEN** the primary text is in English
- **AND** no section headers, table content, or body text is in Spanish

#### Scenario: Spanish quotes preserved as reference

- **WHEN** a document contains a Spanish "vision" or "mission" statement
- **THEN** it appears as a blockquote with English translation below it

### Requirement: R-PKG-LINKING-CONVENTION

All cross-document links in markdown files SHALL follow these conventions:

1. **Package README → Docusaurus docs**: Use **absolute GitHub URLs** (e.g., `https://github.com/rndelpuerto/lenguados/blob/main/docs/docs/math2d/architecture.md`). Relative paths are BROKEN on npmjs.org because npm's renderer does not rewrite them to point to GitHub. Since npm always includes README.md in the published tarball regardless of the `files` field, package READMEs MUST use absolute URLs for any link to repo files or docs site pages. Additionally, include the deployed docs site URL in the Documentation section.
2. **Root README → package docs**: Use relative paths (e.g., `packages/math2d/README.md`). The root README is not published to npm, so relative paths work correctly on GitHub.
3. **Within Docusaurus**: Use Docusaurus-style relative paths without `.md` extension when linking between docs pages.
4. **To external sites**: Use absolute HTTPS URLs.

**Rationale:** npm's markdown renderer does not resolve relative paths back to GitHub (see npm/feedback#666, npm/cli#6206). A link like `../../docs/docs/math2d/architecture.md` renders as `https://www.npmjs.com/package/@lenguados/math2d/../../docs/docs/math2d/architecture.md` which 404s. Absolute GitHub URLs work on both GitHub and npm.

All links SHALL be verified to resolve to existing files at the time of creation. No link SHALL point to a file that has been deleted or moved.

#### Scenario: Package README links work on npm

- **WHEN** the `packages/math2d/README.md` is viewed on npmjs.org
- **THEN** every documentation link uses an absolute URL that resolves correctly
- **AND** no link uses a relative path to files outside the package

#### Scenario: Package README links work on GitHub

- **WHEN** the `packages/math2d/README.md` is viewed on github.com
- **THEN** every documentation link resolves correctly (absolute URLs work on both platforms)

#### Scenario: Root README links all resolve

- **WHEN** every markdown link in the root `README.md` is followed on GitHub
- **THEN** each link resolves to an existing file in the repository
- **AND** no link points to a deleted file (e.g., `packages/math2d/ARCHITECTURE.md`)

#### Scenario: Docusaurus internal links use doc paths

- **WHEN** a page in `docs/docs/math2d/` links to another docs page
- **THEN** the link uses Docusaurus-compatible relative paths

### Requirement: R-PKG-DOCUSAURUS-BOILERPLATE-CLEANUP

The following Docusaurus template boilerplate files SHALL be deleted as part of the docs site restructuring:

1. `docs/blog/2019-05-28-first-blog-post.md` — Lorem ipsum placeholder with Docusaurus team authors
2. `docs/blog/2019-05-29-long-blog-post.md` — Lorem ipsum placeholder
3. `docs/blog/2021-08-26-welcome/index.md` — Docusaurus blogging tutorial
4. `docs/backup/docs/` — Entire directory (7 Docusaurus tutorial boilerplate files)
5. `docs/src/pages/markdown-page.md` — Docusaurus template page ("You don't need React...")

Additionally, `docs/README.md` SHALL be updated to replace `yarn` commands with `npm` commands to match the project's package manager convention.

**Rationale:** These files are unmodified Docusaurus `create-docusaurus` scaffolding. They reference Docusaurus team members as authors, contain Lorem ipsum text, and teach Docusaurus usage rather than lenguados. Their presence on a public-facing docs site is unprofessional.

#### Scenario: No Docusaurus boilerplate blog posts

- **WHEN** the `docs/blog/` directory is listed
- **THEN** no files with Docusaurus template content exist (or the blog feature is disabled in config)

#### Scenario: No backup tutorial directory

- **WHEN** `docs/backup/` is checked
- **THEN** the directory does not exist

#### Scenario: Docs README uses npm

- **WHEN** `docs/README.md` is inspected
- **THEN** all commands use `npm` (not `yarn`)

### Requirement: R-DOCS-CONVENTIONS-RULE-FILE

A new `.claude/rules/documentation-conventions.md` file SHALL be created with path scope `**/*.md` to guide AI agents when creating or editing documentation files.

The rule file SHALL document the following conventions:

1. **Package-level files**: Only `README.md`, `CHANGELOG.md`, and `ARCHITECTURE.md` at `packages/math2d/` root. No `docs/` directory inside packages.
2. **Monorepo root files**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LICENSE`.
3. **Language**: All documentation in English. Spanish quotes preserved as blockquotes with English translation.
4. **Docs site structure**: `docs/docs/math2d/` for package-specific deep-dives, `docs/docs/contributing/` for contributor guides, `docs/docs/api/` for auto-generated TypeDoc.
5. **ARCHITECTURE.md convention**: Two levels — root (monorepo topology, 30-60 lines) and package (code map, under 200 lines). Both link to Docusaurus for expanded content.
6. **Linking rules**: Package README uses absolute GitHub URLs for cross-repo links (npm compatibility). Root README uses relative paths. Docusaurus internal links use relative paths without `.md` extension. Same-directory links (e.g., ARCHITECTURE.md, CHANGELOG.md) use relative paths.
7. **Frontmatter**: All Docusaurus pages require `sidebar_position`, `title`, and `description` in YAML frontmatter.
8. **Headers**: No emojis in H1/H2/H3. Use plain text for accessibility and grep-friendliness.
9. **Temporary documentation**: Use branches + draft PRs. No `drafts/` or `wip/` directories in the repo.
10. **TSDoc**: Follow DOCUMENTATION_STANDARD (now at `docs/docs/contributing/tsdoc-standard.md`).

#### Scenario: AI agent creates documentation following conventions

- **WHEN** an AI agent is asked to create or edit a markdown file in the repository
- **THEN** the documentation-conventions rule is loaded automatically
- **AND** the agent follows the file placement, linking, language, and formatting conventions

#### Scenario: Rule file covers all structural decisions

- **WHEN** a developer or AI agent needs to know where to place a new documentation file
- **THEN** the rule file provides clear guidance for each documentation type (user-facing, contributor, architecture, temporary)

### Requirement: R-DOCS-CONVENTIONS-IN-CONTRIBUTING

The root `CONTRIBUTING.md` SHALL include a "Documentation" section (after "Testing", before "Reporting Issues") that documents the documentation conventions for human contributors:

1. Where to put documentation (package root vs docs site vs root)
2. Which files are convention files (README, CHANGELOG, ARCHITECTURE, CONTRIBUTING, LICENSE)
3. Language requirement (English)
4. How to add a new docs site page (create .md in `docs/docs/`, add frontmatter)
5. Link to the TSDoc standard on the docs site

This section SHALL be concise (15-20 lines of bullet points with links).

#### Scenario: Contributor knows where to put new documentation

- **WHEN** a contributor creates new documentation
- **THEN** the CONTRIBUTING.md Documentation section tells them exactly where it should go

#### Scenario: Documentation section links to deeper guides

- **WHEN** a contributor needs TSDoc conventions or testing strategy details
- **THEN** the Documentation section links to the Docusaurus contributing pages

### Requirement: R-DOCS-CONVENTIONS-IN-CLAUDE-MD

The root `CLAUDE.md` SHALL be updated to include a "Documentation Structure" section that describes:

1. Where documentation lives (package root convention files, docs site for depth)
2. The two-level ARCHITECTURE.md pattern
3. Pointer to `.claude/rules/documentation-conventions.md` for full rules

This section SHALL be 5-10 lines (CLAUDE.md must stay under ~200 lines per best practices).

#### Scenario: CLAUDE.md references documentation conventions

- **WHEN** an AI agent reads `CLAUDE.md` at session start
- **THEN** it finds a brief summary of documentation structure
- **AND** it knows that `.claude/rules/documentation-conventions.md` has full conventions

### Requirement: R-PKG-NO-EMOJI-HEADERS

All migrated documentation pages SHALL NOT use emoji in section headers (H1, H2, H3). During migration, leading emojis SHALL be removed from headers.

**Rationale:** The source documents use emojis inconsistently — `module_interoperability.md`, `exhaustive_edge_cases.md`, `clean_code_and_solid_application.md`, and audit files have emoji headers while the majority of project documentation does not. Technical documentation for npm packages SHALL use plain text headers for consistency, accessibility, and grep-friendliness.

#### Scenario: No emoji in migrated headers

- **WHEN** any H1, H2, or H3 in `docs/docs/math2d/` or `docs/docs/contributing/` is inspected
- **THEN** it does not start with an emoji character
