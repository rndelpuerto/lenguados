## ADDED Requirements

### Requirement: Tag order enforcement

ESLint SHALL enforce the canonical TSDoc tag order defined in DOCUMENTATION_STANDARD.md Section 1 via `jsdoc/sort-tags` with a custom `tagSequence`.

#### Scenario: Out-of-order tags blocked

- **WHEN** a developer writes `@example` before `@returns` in a JSDoc block
- **THEN** ESLint SHALL report a warning identifying the out-of-order tag

#### Scenario: Correct order passes

- **WHEN** all tags in a JSDoc block follow the canonical sequence
- **THEN** ESLint SHALL not report any tag order warnings

### Requirement: Required tags enforcement

ESLint SHALL enforce that exported functions have `@param` and `@returns` tags via `jsdoc/require-param` and `jsdoc/require-returns`.

#### Scenario: Missing @param blocked

- **WHEN** an exported function has parameters without corresponding `@param` tags
- **THEN** ESLint SHALL report a warning

#### Scenario: Missing @returns blocked

- **WHEN** an exported function returns a value without a `@returns` tag
- **THEN** ESLint SHALL report an error

### Requirement: Param name validation

ESLint SHALL enforce that `@param` tag names match function signature parameter names via `jsdoc/check-param-names`.

#### Scenario: Mismatched param name blocked

- **WHEN** a `@param` tag uses a name that doesn't match any parameter in the function signature
- **THEN** ESLint SHALL report an error

### Requirement: Tag name validation

ESLint SHALL enforce that only recognized TSDoc tags are used via `jsdoc/check-tag-names`. Prohibited tags (`@group`, `@alpha`, `@beta`) SHALL be flagged as errors.

#### Scenario: Unknown tag blocked

- **WHEN** a developer uses an unrecognized tag like `@group`
- **THEN** ESLint SHALL report an error

### Requirement: Category vocabulary enforcement

A custom ESLint rule SHALL validate that `@category` values are from the controlled vocabulary defined in DOCUMENTATION_STANDARD.md Section 3.

#### Scenario: Invalid category blocked

- **WHEN** a developer uses `@category Serialization` (deprecated value)
- **THEN** ESLint SHALL report a warning identifying the invalid category and suggesting the replacement

#### Scenario: Valid category passes

- **WHEN** a developer uses `@category Arithmetic` (valid value)
- **THEN** ESLint SHALL not report any category warnings

### Requirement: Class member ordering

ESLint SHALL enforce class member ordering via `@typescript-eslint/member-ordering` with default configuration.

#### Scenario: Method before constructor blocked

- **WHEN** a class has a method defined before the constructor
- **THEN** ESLint SHALL report a warning

### Requirement: Clean lint baseline

After all rules are configured, `npm run lint` SHALL exit with code 0 on the current codebase.

#### Scenario: Full lint pass

- **WHEN** `npm run lint` is executed from the repository root
- **THEN** the command SHALL exit with code 0
- **AND** no errors or warnings SHALL be reported for `packages/math2d/src/**/*.ts` files
