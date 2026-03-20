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

#### Scenario: Geometry category for vector2 scalar computations

- **WHEN** `dot`, `cross`, `magnitude` methods exist in vector2.ts
- **THEN** they SHALL use `@category Geometry` (type-specific category, per amended DOCUMENTATION_STANDARD.md Section 3)
- **AND** ESLint SHALL not report any category warnings since Geometry is valid in vector2.ts per FILE_SCOPE_MAP

#### Scenario: Computed category for matrix scalar computations

- **WHEN** `determinant`, `trace`, `frobeniusNorm` methods exist in matrix2.ts or matrix3.ts
- **THEN** they SHALL use `@category Computed` (base category), NOT `@category Matrix Operations`
- **AND** both static and instance variants SHALL use the same `@category Computed` value

## ADDED Requirements

### Requirement: Triality @see cross-linking completeness

All triality method families (strict/safe/unchecked) in core type files SHALL have complete `@see` cross-links as defined in DOCUMENTATION_STANDARD.md Section 5 L648-720.

#### Scenario: Strict variant cross-links

- **WHEN** a strict triality method (e.g., `divide`) exists in a core type file
- **THEN** its JSDoc SHALL include `@see {@link divideSafe} - <description>` and `@see {@link divideUnchecked} - <description>`

#### Scenario: Safe variant cross-links

- **WHEN** a safe triality method (e.g., `divideSafe`) exists in a core type file
- **THEN** its JSDoc SHALL include `@see {@link divide} - <description>` linking to the strict variant ONLY
- **AND** it SHALL NOT include a link to the unchecked variant

#### Scenario: Unchecked variant cross-links

- **WHEN** an unchecked triality method (e.g., `divideUnchecked`) exists in a core type file
- **THEN** its JSDoc SHALL include `@see {@link divide} - <description>` and `@see {@link divideSafe} - <description>`

#### Scenario: Zero missing cross-links after final pass

- **WHEN** all 7 core type files are audited for triality cross-links
- **THEN** every triality family SHALL have complete bidirectional `@see` tags per the rules above

### Requirement: Factory and triality @example completeness

All Factory methods and Triality Strict/Safe methods in core type files SHALL have `@example` blocks as required by DOCUMENTATION_STANDARD.md Section 2 Table 1.

#### Scenario: Factory method with @example

- **WHEN** a static factory method (e.g., `fromValues`, `clone`, `copy`, `fromAngle`) exists in a core type file
- **THEN** its JSDoc SHALL include an `@example` block showing creation with and without `out` parameter (per Template 10)

#### Scenario: Triality Strict with @example

- **WHEN** a strict triality method exists in a core type file
- **THEN** its JSDoc SHALL include an `@example` block that includes the case that triggers the throw (per Template 4)

#### Scenario: Triality Safe with @example

- **WHEN** a safe triality method exists in a core type file
- **THEN** its JSDoc SHALL include an `@example` block that includes the fallback case (per Template 5)

#### Scenario: Triality Unchecked without @example

- **WHEN** an unchecked triality method exists in a core type file
- **THEN** its JSDoc SHALL NOT include an `@example` block (per Template 6)

### Requirement: JSDoc factual accuracy

All JSDoc content in core type files SHALL be factually accurate. Descriptions, parameter documentation, property references, and code examples SHALL match the actual runtime behavior and API surface.

#### Scenario: @example code compiles and runs

- **WHEN** an `@example` block references a property or method
- **THEN** the referenced property/method SHALL exist, be accessible (not readonly when assigned), and produce the documented result

#### Scenario: @remarks property references match actual names

- **WHEN** `@remarks` text references instance properties (e.g., `this.cos`, `this.sin`)
- **THEN** the referenced names SHALL match actual property names in the class

#### Scenario: Method summary matches actual behavior

- **WHEN** a method summary describes what the method does (e.g., "applies translation")
- **THEN** the description SHALL accurately reflect the full behavior (e.g., "applies scale, rotation, and translation")

#### Scenario: @throws matches actual throw behavior

- **WHEN** a method throws an exception at runtime
- **THEN** its JSDoc SHALL include a `@throws {ErrorType}` tag documenting the exception
- **AND** methods that do NOT throw SHALL NOT have `@throws` tags
