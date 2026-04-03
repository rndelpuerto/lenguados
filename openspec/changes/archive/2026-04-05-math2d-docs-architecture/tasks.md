# Tasks: math2d-docs-architecture

## Group 1: Create Docusaurus directory structure and category metadata

- [x] Create `docs/docs/math2d/` directory
- [x] Create `docs/docs/math2d/_category_.json` with `{"label": "math2d", "position": 2, "description": "Architecture, design decisions, and reference for @lenguados/math2d", "link": {"type": "generated-index", "description": "In-depth documentation for the @lenguados/math2d package."}}`
- [x] Create `docs/docs/contributing/` directory
- [x] Create `docs/docs/contributing/_category_.json` with `{"label": "Contributing", "position": 3, "description": "Contribution guides, coding standards, and testing conventions", "link": {"type": "generated-index", "description": "Guides for contributing to the lenguados project."}}`

## Group 2: Rewrite Docusaurus intro.md

- [x] Rewrite `docs/docs/intro.md` from default Docusaurus template to lenguados-specific Getting Started page: project description, installation command, minimal code example using actual `@lenguados/math2d` imports, and navigation links to math2d section, contributing section, and API reference. Keep `sidebar_position: 1`.

## Group 2b: Create root ARCHITECTURE.md and update package ARCHITECTURE.md

- [x] Create NEW `/ARCHITECTURE.md` at monorepo root (30-60 lines): monorepo topology (packages/common, packages/math2d, packages/examples, docs/, scripts/), dependency graph between packages, shared infrastructure description, pointer to `packages/math2d/ARCHITECTURE.md` for detailed math2d layering.
- [x] Update `packages/math2d/ARCHITECTURE.md`: add link to Docusaurus architecture deep-dive page (`docs/docs/math2d/architecture.md`), verify Mermaid diagram includes all 6 layers, ensure it stays under 200 lines.

## Group 3: Migrate math2d narrative docs to Docusaurus (with translation)

- [x] Create `docs/docs/math2d/architecture.md` as expanded deep-dive: incorporate content from `packages/math2d/docs/architecture/core_principles.md` (translate Spanish to English), include design principles/axioms, DCE policy, kill-switch strategy. Cross-reference to `packages/math2d/ARCHITECTURE.md` for the code map. Frontmatter: `sidebar_position: 1`, `title: "Architecture"`, `description: "Design principles, architectural axioms, and expanded layer rationale"`.
- [x] Migrate `packages/math2d/docs/architecture/module_interoperability.md` to `docs/docs/math2d/interoperability.md`: Remove emoji from H1 header. Add frontmatter `sidebar_position: 2`, `title: "Type Interoperability"`, `description: "Type escalation, rotation drift, and conversion patterns"`.
- [x] Migrate `packages/math2d/docs/research/exhaustive_edge_cases.md` to `docs/docs/math2d/edge-cases.md`: Translate any Spanish content, verify section 5 (`assertTransform2Like` bug) — remove if fixed or convert to GitHub issue if still present. Frontmatter: `sidebar_position: 3`, `title: "Edge Cases"`, `description: "IEEE 754 failure modes, normalization paradoxes, and set theory anomalies"`.
- [x] Migrate `packages/math2d/docs/research/decisions_and_benchmarks.md` to `docs/docs/math2d/design-decisions.md`: Translate to English, keep industry benchmarks/comparisons here (deduplicating from clean_code_and_solid_application.md). Frontmatter: `sidebar_position: 4`, `title: "Design Decisions"`, `description: "Architectural decisions, alternatives considered, and industry benchmarks"`.
- [x] Migrate `packages/math2d/docs/audits/ultimate_audit_report.md` to `docs/docs/math2d/audit-closure-2026.md`: Translate from Spanish to English. Frontmatter: `sidebar_position: 5`, `title: "Audit Closure (2026)"`, `description: "Severity L0 gap verification and closure report"`.

## Group 4: Migrate contributing docs to Docusaurus

- [x] Migrate `packages/math2d/DOCUMENTATION_STANDARD.md` to `docs/docs/contributing/tsdoc-standard.md`: Add frontmatter `sidebar_position: 1`, `title: "TSDoc Standard"`, `description: "Canonical tag order, templates, and documentation conventions for @lenguados/math2d"`. Preserve ALL normative content verbatim (tag order table, required/optional matrix, 14 templates, vocabulary, footnotes). **Fix stale content:** Remove 5 deleted constants from the Sub-Categories table: `ITERATIVE_TOLERANCE`, `E`, `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE`, `MAX_SAFE_INTEGER_F64` (confirmed removed from codebase per CHANGELOG).
- [x] Migrate `packages/math2d/docs/testing/testing_strategy.md` to `docs/docs/contributing/testing-strategy.md`: Translate from Spanish to English, fix duplicate section 3 numbering, annotate tolerance example (`toBeCloseTo(x, 10)` = 10 digits precision = EPSILON 1e-10). Frontmatter: `sidebar_position: 2`, `title: "Testing Strategy"`, `description: "Property-based testing with fast-check, algebraic invariants, and tolerance conventions"`.
- [x] Migrate `packages/math2d/docs/standards/clean_code_and_solid_application.md` to `docs/docs/contributing/design-philosophy.md`: Keep SOLID deviations and POA principles, move industry comparisons to design-decisions.md (deduplication). Frontmatter: `sidebar_position: 3`, `title: "Design Philosophy"`, `description: "Performance-Oriented Architecture, SOLID deviations, and mechanical sympathy"`.

## Group 5: Update root CONTRIBUTING.md

- [x] Add "math2d API Conventions" section (after Testing section) covering: static+instance pattern with out parameter, triality with suffix naming convention (`divideSafe` not `safeDivide`), CS variants for hot loops, apply vs transform naming, `*Like` interface conventions. Keep to ~25 lines of concise bullets.
- [x] Add "Detailed Guides" section with relative links to Docusaurus contributing pages: TSDoc Standard (`docs/docs/contributing/tsdoc-standard.md`), Testing Strategy (`docs/docs/contributing/testing-strategy.md`), Design Philosophy (`docs/docs/contributing/design-philosophy.md`).
- [x] Remove the link to `packages/math2d/CONTRIBUTING.md` from the "Package-Specific Guides" section (file will no longer exist). Update section to reference the new math2d API Conventions section and Docusaurus links.

## Group 6: Update math2d README.md documentation links (absolute GitHub URLs)

- [x] Rewrite the Documentation section in `packages/math2d/README.md` using absolute GitHub URLs where needed (npm compatibility): Architecture → `ARCHITECTURE.md` (relative OK, same directory), Contributing → `https://github.com/rndelpuerto/lenguados/blob/main/CONTRIBUTING.md`, TSDoc Standard → `https://github.com/rndelpuerto/lenguados/blob/main/docs/docs/contributing/tsdoc-standard.md`, Changelog → `CHANGELOG.md` (relative OK, same directory). Add deployed docs site URL: `https://rndelpuerto.github.io/lenguados/docs/`.
- [x] Remove all links to `CONTRIBUTING.md`, `DOCUMENTATION_STANDARD.md` at package root and any links to `packages/math2d/docs/`. (ARCHITECTURE.md link kept — it stays)

## Group 7: Update root README.md documentation links

- [x] Update the Documentation section in root `README.md`: Architecture link → `docs/docs/math2d/architecture.md` (replacing `packages/math2d/ARCHITECTURE.md`). Verify all other links resolve.

## Group 8: Update CLAUDE.md and AI context files

- [x] Update any references in `CLAUDE.md` that point to `packages/math2d/ARCHITECTURE.md` → `docs/docs/math2d/architecture.md`. Update any references to `packages/math2d/CONTRIBUTING.md` (remove or redirect to root CONTRIBUTING.md).
- [x] Fix `CLAUDE.md` line 67: change `safeDivide` to `divideSafe` (matches actual export name and suffix naming convention).
- [x] Verify `.claude/rules/math2d-patterns.md` does not reference any moved/deleted files.
- [x] Verify `.claude/rules/testing-conventions.md` does not reference any moved/deleted files.

## Group 8b: Docusaurus boilerplate cleanup

- [x] Delete `docs/blog/2019-05-28-first-blog-post.md`, `docs/blog/2019-05-29-long-blog-post.md`, `docs/blog/2021-08-26-welcome/` (or disable blog plugin in `docusaurus.config.ts` — blog is already commented out)
- [x] Delete `docs/backup/` directory entirely (7 Docusaurus tutorial template files)
- [x] Delete `docs/src/pages/markdown-page.md` (Docusaurus template page)
- [x] Update `docs/README.md`: replace `yarn` commands with `npm` equivalents

## Group 8c: Document the documentation conventions

- [x] Create `.claude/rules/documentation-conventions.md` with path scope `**/*.md`. Content: (1) Package-level files — only README, CHANGELOG, ARCHITECTURE at `packages/math2d/` root, no docs/ directory. (2) Monorepo root files — README, CHANGELOG, CONTRIBUTING, ARCHITECTURE, LICENSE. (3) Language — all English, Spanish quotes as blockquotes with translation. (4) Docs site structure — `docs/docs/math2d/` for package deep-dives, `docs/docs/contributing/` for contributor guides. (5) ARCHITECTURE.md two-level convention — root (topology, 30-60 lines) + package (code map, under 200 lines). (6) Linking rules — package README uses absolute GitHub URLs, root README uses relative paths, Docusaurus uses relative paths without .md. (7) Frontmatter — all Docusaurus pages need sidebar_position, title, description. (8) No emojis in headers. (9) Temporary docs use branches + draft PRs, no wip/ directories. (10) TSDoc follows docs/docs/contributing/tsdoc-standard.md.
- [x] Add "Documentation" section to root `CONTRIBUTING.md` (after Testing, before Reporting Issues): where to put docs (package root vs docs site vs root), convention files list, language requirement, how to add a docs site page, link to TSDoc standard. ~15-20 lines of concise bullets.
- [x] Add "Documentation Structure" section to `CLAUDE.md` (~5-10 lines): where docs live (package root convention files, docs site for depth), two-level ARCHITECTURE.md pattern, pointer to `.claude/rules/documentation-conventions.md`.

## Group 9: Delete files from package

- [x] Delete `packages/math2d/CONTRIBUTING.md` (content absorbed into root CONTRIBUTING.md + Docusaurus)
- [x] Delete `packages/math2d/DOCUMENTATION_STANDARD.md` (migrated to Docusaurus)
- [x] Delete `packages/math2d/docs/` directory entirely (README.md, architecture/, audits/, research/ including archive/, standards/, testing/)
- [x] **DO NOT delete** `packages/math2d/ARCHITECTURE.md` — it stays as the package-level code map

## Group 10: Verification

- [x] Verify `packages/math2d/` root contains exactly `README.md`, `CHANGELOG.md`, and `ARCHITECTURE.md` as markdown files (3 files, no more)
- [x] Verify root `/ARCHITECTURE.md` exists, is under 60 lines, and links to `packages/math2d/ARCHITECTURE.md`
- [x] Verify all links in `packages/math2d/README.md` Documentation section resolve to existing files
- [x] Verify all links in root `README.md` resolve to existing files
- [x] Verify all links in root `CONTRIBUTING.md` resolve to existing files
- [x] Verify Docusaurus sidebar renders with new math2d (position 2) and Contributing (position 3) categories — check that `_category_.json` files are valid JSON
- [x] Verify `CLAUDE.md` and `.claude/rules/` reference no deleted files
- [x] Verify no migrated document contains Spanish body text (except preserved blockquotes)
- [x] Verify `docs/docs/intro.md` contains lenguados-specific content, not Docusaurus template text
- [x] Verify no migrated document has emojis in H1/H2/H3 headers
- [x] Verify `docs/blog/` contains no Docusaurus boilerplate, `docs/backup/` does not exist, `docs/src/pages/markdown-page.md` does not exist
- [x] Verify DOCUMENTATION_STANDARD.md migration does not reference removed constants (ITERATIVE_TOLERANCE, E, GOLDEN_RATIO, GOLDEN_RATIO_CONJUGATE, MAX_SAFE_INTEGER_F64)
- [x] Verify package README documentation links use absolute GitHub URLs (not relative paths)
- [x] Verify `.claude/rules/documentation-conventions.md` exists with path scope `**/*.md` and covers all 10 convention points
- [x] Verify root `CONTRIBUTING.md` has a "Documentation" section with convention summary
- [x] Verify `CLAUDE.md` has a "Documentation Structure" section referencing the rule file
- [x] Run `npm run build` to confirm no build issues
- [x] Run `npm run test:unit` to confirm no test regressions
