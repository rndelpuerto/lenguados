## ADDED Requirements

### Requirement: math2d docs directory contains only current references

The `packages/math2d/docs/` directory SHALL contain only documentation that is actively referenced and current. Files SHALL be organized as:

```
docs/
  README.md                          — Index of all documentation
  architecture/
    core_principles.md               — Normative architecture doc (if still current)
    module_interoperability.md       — Module interaction patterns (if still current)
  standards/
    tsdoc_and_naming.md              — TSDoc and naming conventions (if not superseded by DOCUMENTATION_STANDARD.md)
    clean_code_and_solid_application.md — Clean code principles (if still current)
  testing/
    testing_strategy.md              — Property-based testing strategy
  audits/
    ultimate_audit_report.md         — Closure report (historical reference)
  research/
    archive/                         — All historical research files (phase docs, legacy notes)
```

#### Scenario: No orphaned files at docs root

- **WHEN** the `docs/` directory is listed
- **THEN** every file at the root level is either README.md or a subdirectory

#### Scenario: Archive contains all historical research

- **WHEN** a historical phase document or legacy note exists
- **THEN** it is located in `docs/research/archive/`, not at a higher level

#### Scenario: Active files are current

- **WHEN** a file outside `research/archive/` is inspected
- **THEN** its content reflects the current state of the codebase (not a past version)

### Requirement: math2d docs README.md serves as authoritative index

The `packages/math2d/docs/README.md` SHALL:

- Be written in English (matching all other technical docs)
- List every document in `docs/` with a one-line description and relative link
- Clearly separate "Current Documentation" from "Historical Archive"
- Include last-updated date

#### Scenario: Developer finds architecture docs

- **WHEN** a developer or AI agent reads `docs/README.md`
- **THEN** they find a link to the architecture documentation with a description

#### Scenario: Historical docs are clearly marked

- **WHEN** a developer reads the docs index
- **THEN** the archive section is clearly labeled as historical/reference-only
- **AND** it is obvious which documents are authoritative vs archived

### Requirement: Redundant documentation is consolidated

If a file in `docs/` substantially duplicates content from a higher-level file (e.g., `docs/architecture/core_principles.md` duplicating `ARCHITECTURE.md`), the duplicate SHALL be either:

1. Removed with a redirect note pointing to the authoritative source, OR
2. Consolidated into the authoritative source with unique content preserved

#### Scenario: No conflicting architecture descriptions

- **WHEN** `ARCHITECTURE.md` and `docs/architecture/core_principles.md` both exist
- **THEN** they do not contain contradictory information about layer dependencies or patterns
- **AND** one is clearly the authoritative source

### Requirement: Obsolete research files are archived

Files in `docs/research/` that document completed work (phase documents, audit findings from resolved issues, benchmark comparisons against now-removed implementations) SHALL be moved to `docs/research/archive/` if not already there.

#### Scenario: Completed phase documents

- **WHEN** a file describes "Phase 3 implementation plan" for work that is already complete
- **THEN** it is located in `docs/research/archive/`

#### Scenario: Decision rationale preserved

- **WHEN** a research file contains decision rationale (e.g., why fdlibm over native Math)
- **THEN** the file is preserved in the archive, not deleted
