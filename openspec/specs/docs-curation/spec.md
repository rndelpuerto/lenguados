## ADDED Requirements

### Requirement: math2d docs directory contains only current references

The `packages/math2d/docs/` directory SHALL NOT exist. All active documentation SHALL be migrated to the Docusaurus site at `docs/docs/`. The complete migration mapping is:

| Previous location                                    | Destination                                   | Action                                                 |
| ---------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| `docs/architecture/core_principles.md`               | `docs/docs/math2d/architecture.md`            | Merge with ARCHITECTURE.md, translate to English       |
| `docs/architecture/module_interoperability.md`       | `docs/docs/math2d/interoperability.md`        | Migrate, add frontmatter                               |
| `docs/standards/clean_code_and_solid_application.md` | `docs/docs/contributing/design-philosophy.md` | Migrate, deduplicate industry comparisons              |
| `docs/testing/testing_strategy.md`                   | `docs/docs/contributing/testing-strategy.md`  | Migrate, translate to English, fix duplicate section 3 |
| `docs/audits/ultimate_audit_report.md`               | `docs/docs/math2d/audit-closure-2026.md`      | Migrate, translate to English                          |
| `docs/audits/code_review_findings_2026.md`           | **DELETE** (not migrated)                     | Contains stale PRNG info, 100% overlap with other docs |
| `docs/research/decisions_and_benchmarks.md`          | `docs/docs/math2d/design-decisions.md`        | Migrate, translate to English                          |
| `docs/research/exhaustive_edge_cases.md`             | `docs/docs/math2d/edge-cases.md`              | Migrate, verify/remove stale bug section               |
| `docs/research/archive/*` (18 files)                 | **DELETE** (git history only)                 | Completed research artifacts                           |
| `docs/README.md`                                     | **DELETE**                                    | Docusaurus sidebar replaces this index                 |

#### Scenario: No docs directory in package

- **WHEN** `packages/math2d/docs/` is checked
- **THEN** the directory does not exist (neither the directory nor any subdirectory)

#### Scenario: Active docs accessible on Docusaurus site

- **WHEN** a contributor searches for architecture documentation
- **THEN** they find it at `docs/docs/math2d/architecture.md` via the Docusaurus sidebar

#### Scenario: Stale document not preserved

- **WHEN** the repository is searched for `code_review_findings_2026.md` content
- **THEN** no active file contains that content (it exists only in git history)

### Requirement: Redundant documentation is consolidated

Architecture documentation SHALL follow the two-level pattern:

- `packages/math2d/ARCHITECTURE.md` — concise code map (layers, diagram, patterns, conventions)
- `docs/docs/math2d/architecture.md` — expanded deep-dive (design principles, axioms, rationale)

The following SHALL NOT exist after migration:

- `packages/math2d/docs/architecture/core_principles.md` (content merged into Docusaurus architecture page)
- `packages/math2d/docs/architecture/module_interoperability.md` (migrated to its own Docusaurus page)
- `packages/math2d/docs/` directory (eliminated entirely)

Brief summaries in `CLAUDE.md` and `.claude/rules/math2d-patterns.md` are acceptable as they serve a different purpose (AI agent context).

#### Scenario: Two-level architecture, no docs/ directory

- **WHEN** the repository is searched for architecture documentation
- **THEN** `packages/math2d/ARCHITECTURE.md` contains the code map
- **AND** `docs/docs/math2d/architecture.md` contains the expanded deep-dive
- **AND** `packages/math2d/docs/` directory does not exist

#### Scenario: AI context files reference but don't compete

- **WHEN** `CLAUDE.md` or `.claude/rules/math2d-patterns.md` mentions architecture
- **THEN** it contains a brief summary or pointer, NOT a competing full description
