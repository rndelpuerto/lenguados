## ADDED Requirements

### Requirement: R-DOCS-CONTRIBUTING-SECTION-STRUCTURE

The Docusaurus site SHALL contain a `docs/docs/contributing/` directory organized as a sidebar category with label "Contributing" and position 3 (after math2d at position 2, before the auto-generated API at position 4).

The directory SHALL contain a `_category_.json` file:

```json
{
 "label": "Contributing",
 "position": 3,
 "description": "Contribution guides, coding standards, and testing conventions",
 "link": {
  "type": "generated-index",
  "description": "Guides for contributing to the lenguados project."
 }
}
```

**Rationale:** Separating contributing guides from package-specific documentation follows the Diataxis "how-to" quadrant. Position 3 places it after introductory and package-specific content, grouping all contributor-facing material together.

#### Scenario: Category appears in sidebar

- **WHEN** the Docusaurus sidebar is rendered
- **THEN** "Contributing" appears as a collapsible category after "math2d" and before "API Reference"

### Requirement: R-DOCS-CONTRIBUTING-TSDOC

The Docusaurus site SHALL contain a `docs/docs/contributing/tsdoc-standard.md` page migrated from `packages/math2d/DOCUMENTATION_STANDARD.md`.

The document SHALL have frontmatter: `sidebar_position: 1`, `title: "TSDoc Standard"`, `description: "Canonical tag order, templates, and documentation conventions for @lenguados/math2d"`.

The document SHALL preserve the full TSDoc convention reference: canonical tag order table, required/optional tags matrix by symbol type, all 14 templates, controlled @category vocabulary, class member ordering rules, and footnotes.

The content is already in English and requires no translation.

After migration, `packages/math2d/DOCUMENTATION_STANDARD.md` SHALL be deleted.

#### Scenario: TSDoc conventions accessible on docs site

- **WHEN** a contributor needs to document a new public symbol
- **THEN** they find the canonical tag order and template in `docs/docs/contributing/tsdoc-standard.md`

#### Scenario: Full standard preserved

- **WHEN** the migrated TSDoc standard is compared to the original DOCUMENTATION_STANDARD.md
- **THEN** all normative content (tag order table, required/optional matrix, 14 templates, @category vocabulary) is preserved verbatim
- **AND** no normative section has been omitted or summarized

#### Scenario: Stale constant references removed

- **WHEN** the Constants File Sub-Categories table (Section 3) is inspected
- **THEN** it does NOT reference constants that were removed from the codebase: `ITERATIVE_TOLERANCE`, `E`, `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE`, `MAX_SAFE_INTEGER_F64`
- **AND** all listed constants exist as exports in `packages/math2d/src/`

### Requirement: R-DOCS-CONTRIBUTING-TESTING

The Docusaurus site SHALL contain a `docs/docs/contributing/testing-strategy.md` page migrated from `packages/math2d/docs/testing/testing_strategy.md`.

The document SHALL have frontmatter: `sidebar_position: 2`, `title: "Testing Strategy"`, `description: "Property-based testing with fast-check, algebraic invariants, and tolerance conventions"`.

Content SHALL be translated from Spanish to English. The fast-check algebraic invariants table (unique content not documented elsewhere) SHALL be preserved completely.

**Known issues to fix during migration:**

- The document has a duplicate section 3 (numbered "3" twice — the second covers tolerances). This SHALL be renumbered correctly.
- The tolerance example `toBeCloseTo(expected.x, 10)` SHALL be verified and annotated to clarify that Jest's second argument is "number of digits of precision" (10 digits = EPSILON 1e-10).

After migration, `packages/math2d/docs/testing/testing_strategy.md` SHALL be deleted.

#### Scenario: Testing approach documented in English

- **WHEN** a contributor needs to write property-based tests for a new math type
- **THEN** they find patterns and conventions in English in `docs/docs/contributing/testing-strategy.md`

#### Scenario: Algebraic invariants table preserved

- **WHEN** a contributor searches for required fast-check properties per class
- **THEN** they find the complete invariants table (Rotation2 closure, Vector2 commutativity, Matrix2 invertibility, etc.)

#### Scenario: No duplicate section numbering

- **WHEN** the section headers are inspected
- **THEN** each section has a unique number (no duplicate "3")

### Requirement: R-DOCS-CONTRIBUTING-PHILOSOPHY

The Docusaurus site SHALL contain a `docs/docs/contributing/design-philosophy.md` page migrated from `packages/math2d/docs/standards/clean_code_and_solid_application.md`.

The document SHALL have frontmatter: `sidebar_position: 3`, `title: "Design Philosophy"`, `description: "Performance-Oriented Architecture, SOLID deviations, and mechanical sympathy"`.

The document SHALL explain Performance-Oriented Architecture (POA) principles and the intentional SOLID deviations for CPU cache-line and branch-prediction optimization. Content that overlaps with `decisions_and_benchmarks.md` (industry comparison tables) SHALL be deduplicated — benchmarks/comparisons go to `design-decisions.md`, SOLID deviations stay here.

After migration, `packages/math2d/docs/standards/clean_code_and_solid_application.md` SHALL be deleted.

#### Scenario: Design philosophy accessible

- **WHEN** a contributor questions why a class has many methods instead of smaller classes
- **THEN** they find the POA rationale in `docs/docs/contributing/design-philosophy.md`

#### Scenario: Content not duplicated with design-decisions

- **WHEN** industry comparison tables (gl-matrix, Three.js, math.js) are searched for
- **THEN** they appear in `design-decisions.md` only, not in `design-philosophy.md`

### Requirement: R-DOCS-CONTRIBUTING-FRONTMATTER

Every page in `docs/docs/contributing/` SHALL have Docusaurus frontmatter with all three fields:

```yaml
---
sidebar_position: N
title: 'Descriptive Title'
description: 'One-line description for SEO and index pages'
---
```

Every page in `docs/docs/math2d/` SHALL follow the same frontmatter convention.

#### Scenario: Pages appear in sidebar in correct order

- **WHEN** the Docusaurus site sidebar is rendered
- **THEN** contributing pages appear in this order: TSDoc Standard (1), Testing Strategy (2), Design Philosophy (3)

#### Scenario: All pages have description for SEO

- **WHEN** any docs page frontmatter is inspected
- **THEN** the `description` field is present and contains a meaningful one-line summary
