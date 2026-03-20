## MODIFIED Requirements

### Requirement: Category vocabulary enforcement

A custom ESLint rule (`local/enforce-category-vocabulary`) SHALL validate that `@category` values are from the controlled vocabulary defined in DOCUMENTATION_STANDARD.md Section 3 (31 valid values).

The rule SHALL detect deprecated categories (11 values from the "Invalid Categories" table) and suggest their replacements.

The rule validates vocabulary, file-scoping of type-specific categories, and detects deprecated values.

#### Scenario: Invalid category blocked

- **WHEN** a developer uses `@category Serialization` (deprecated value)
- **THEN** ESLint SHALL report a warning identifying the invalid category and suggesting the replacement

#### Scenario: Valid category passes

- **WHEN** a developer uses `@category Arithmetic` (valid value)
- **THEN** ESLint SHALL not report any category warnings

#### Scenario: Cross-file consistency after standardization

- **WHEN** all 7 core type files are linted after category standardization
- **THEN** ESLint SHALL report zero `enforce-category-vocabulary` warnings
- **AND** the same conceptual operation (e.g., `floor`) SHALL use the same @category value across all files where it appears (per DOCUMENTATION_STANDARD.md Section 3 base category table)

### Requirement: File-scoped category validation

The `enforce-category-vocabulary` rule SHALL validate that type-specific categories are only used in their designated files as defined in DOCUMENTATION_STANDARD.md Section 3.

| Category                | Valid Files               |
| ----------------------- | ------------------------- |
| `Matrix Operations`     | matrix2.ts, matrix3.ts    |
| `Set Operations`        | interval.ts               |
| `Column/Row`            | matrix2.ts, matrix3.ts    |
| `Transform Integration` | vector2.ts, transform2.ts |
| `Direction`             | vector2.ts                |
| `Geometry`              | vector2.ts                |
| `Constraint`            | vector2.ts                |

#### Scenario: Type-specific category in wrong file

- **WHEN** `@category Direction` appears in `matrix3.ts`
- **THEN** ESLint SHALL report a warning that `Direction` is only valid in vector2.ts

#### Scenario: Type-specific category in correct file

- **WHEN** `@category Matrix Operations` appears in `matrix2.ts`
- **THEN** ESLint SHALL not report any file-scope warnings

#### Scenario: Fallback to base category in non-scoped files

- **WHEN** a method like `clamp` exists in `matrix2.ts` (where Constraint is not valid)
- **THEN** the method SHALL use a base category (Transform) instead of the type-specific Constraint
- **AND** ESLint SHALL not report any warnings

## ADDED Requirements

### Requirement: Category-to-section-header affinity

Section headers (ASCII banner comments) SHALL have semantic affinity with the @category tags of methods within that section. When a section header name diverges from the @category used by its methods, the header SHALL be renamed to match the category.

#### Scenario: Section header matches category

- **WHEN** a section header reads `/* Static Transforms */` and all methods within use `@category Transform`
- **THEN** the section is compliant

#### Scenario: Section header does not match category

- **WHEN** a section header reads `/* Static Numeric Transforms */` but methods use `@category Transform`
- **THEN** the header SHALL be renamed to `/* Static Transforms */` or a similarly aligned name

#### Scenario: Mixed categories in one section

- **WHEN** a section contains methods with 3+ different @category values
- **THEN** the section SHALL be split by inserting sub-headers at category boundaries, without physically moving code

### Requirement: Instance getter Accessor tags

All public instance getter properties (`get` accessors) on core type classes SHALL have `@category Accessor` as defined in DOCUMENTATION_STANDARD.md Section 3 and Section 4.

#### Scenario: Instance getter with Accessor tag

- **WHEN** a core type class has a public getter like `get transposed()`
- **THEN** its JSDoc SHALL include `@category Accessor`

#### Scenario: Instance getter without category tag

- **WHEN** a public getter on a core type class is missing `@category`
- **THEN** `@category Accessor` SHALL be added to its JSDoc block

### Requirement: Clean baseline after standardization

After all category corrections are applied, the full codebase SHALL pass ESLint with zero warnings from all 4 custom rules (`enforce-category-vocabulary`, `enforce-required-tags`, `enforce-see-format`, `enforce-tag-fragments`) and all existing Jest tests SHALL pass with no failures.

#### Scenario: Zero warnings

- **WHEN** `npm run lint` is executed after all changes
- **THEN** exit code SHALL be 0 with zero warnings from custom rules

#### Scenario: All tests pass

- **WHEN** `npm run test:unit` is executed after all changes
- **THEN** all 3225+ tests SHALL pass with zero failures
