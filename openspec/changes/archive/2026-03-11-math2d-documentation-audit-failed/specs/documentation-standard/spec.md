## ADDED Requirements

### Requirement: Audit verification — no deprecated categories remain

After the audit pass, no source file in `packages/math2d/src/` SHALL contain `@category` values outside the controlled vocabulary defined in DOCUMENTATION_STANDARD.md §3.

#### Scenario: Search for deprecated categories

- **WHEN** a text search for deprecated category values ("Geometry & Measures", "Direction & Angles", "Numeric Transform", "Vector Transforms", "Constraints", "Predicate", "Serialization", "Composition", "Batch Operations", "Validation", "Component") is performed across all `src/**/*.ts` files
- **THEN** zero matches SHALL be found

### Requirement: Audit verification — no prohibited tags remain

After the audit pass, no source file SHALL contain `@group`, `@alpha`, or `@beta` tags.

#### Scenario: Search for prohibited tags

- **WHEN** a text search for `@group`, `@alpha`, `@beta` is performed across all `src/**/*.ts` files
- **THEN** zero matches SHALL be found

### Requirement: Audit verification — triality invariants hold

After the audit pass, all triality sets SHALL conform to the cross-linking convention.

#### Scenario: No @example on unchecked variants

- **WHEN** a search for `@example` within JSDoc blocks of `*Unchecked` methods is performed
- **THEN** zero matches SHALL be found

#### Scenario: No @throws on safe variants

- **WHEN** a search for `@throws` within JSDoc blocks of `*Safe` methods is performed
- **THEN** zero matches SHALL be found

### Requirement: Audit verification — build and tests pass

After all documentation changes are applied, the project SHALL build and all tests SHALL pass.

#### Scenario: Build succeeds

- **WHEN** `npm run build` is executed
- **THEN** the command SHALL exit with code 0

#### Scenario: Tests pass

- **WHEN** `npm run test:unit` is executed
- **THEN** all tests SHALL pass with exit code 0
