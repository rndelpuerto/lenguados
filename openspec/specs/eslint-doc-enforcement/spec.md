## ADDED Requirements

### Requirement: Tag order enforcement

ESLint SHALL enforce the canonical TSDoc tag order via `jsdoc/sort-tags` with a custom `tagSequence` extending DOCUMENTATION_STANDARD.md Section 1.

The enforced sequence is: `@packageDocumentation`, `@file`, `@module`, `@description`, `@remarks`, `@template`, `@param`, `@returns`, `@throws`, `@defaultValue`, `@example`, `@see`, `@internal`, `@constant`, `@category`, `@since`, `@public`.

Note: `@packageDocumentation` and `@template` are pragmatic additions not in DOCUMENTATION_STANDARD.md Section 1. `@packageDocumentation` is required by TypeDoc for the entry-point file. `@template` replaces `@typeParam` per `eslint-plugin-jsdoc` preference (standard JSDoc convention).

Inter-tag-group whitespace is NOT enforced (`reportTagGroupSpacing: false`) to allow flexible blank line usage within JSDoc blocks.

#### Scenario: Out-of-order tags blocked

- **WHEN** a developer writes `@example` before `@returns` in a JSDoc block
- **THEN** ESLint SHALL report a warning identifying the out-of-order tag

#### Scenario: Correct order passes

- **WHEN** all tags in a JSDoc block follow the canonical sequence
- **THEN** ESLint SHALL not report any tag order warnings

### Requirement: Required tags enforcement

ESLint SHALL enforce that functions and methods have `@param` and `@returns` tags via `jsdoc/require-param` (warn) and `jsdoc/require-returns` (error). Additionally, `jsdoc/require-param-description` and `jsdoc/require-returns-description` SHALL be enforced at warn level.

These rules apply globally to all `.ts` files, not per symbol type.

#### Scenario: Missing @param blocked

- **WHEN** a function has parameters without corresponding `@param` tags
- **THEN** ESLint SHALL report a warning

#### Scenario: Missing @returns blocked

- **WHEN** a function returns a value without a `@returns` tag
- **THEN** ESLint SHALL report an error

### Requirement: Param name validation

ESLint SHALL enforce that `@param` tag names match function signature parameter names via `jsdoc/check-param-names`.

#### Scenario: Mismatched param name blocked

- **WHEN** a `@param` tag uses a name that doesn't match any parameter in the function signature
- **THEN** ESLint SHALL report an error

### Requirement: Tag name validation

ESLint SHALL enforce that only recognized TSDoc tags are used via `jsdoc/check-tag-names`. Prohibited tags (`@group`, `@alpha`, `@beta`) SHALL be flagged as errors.

Recognized tags (via `definedTags`): `remarks`, `defaultValue`, `example`, `see`, `internal`, `constant`, `category`, `since`, `public`, `file`, `module`, `description`, `packageDocumentation`, `typeParam`, `migration`.

#### Scenario: Unknown tag blocked

- **WHEN** a developer uses an unrecognized tag like `@group`
- **THEN** ESLint SHALL report an error

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

### Requirement: Class member ordering

ESLint SHALL enforce class member ordering via `@typescript-eslint/member-ordering` with a custom configuration matching the codebase's two structural patterns.

The configuration enforces one invariant: all class declarations (fields, constructor, static constants, static methods, private static helpers) SHALL appear before any instance methods, getters, or setters. Within each group, order is flexible (`order: 'as-written'`).

This relaxed configuration was chosen because the codebase has two competing top-of-class patterns:

- **Statics-first** (Vector2, Matrix2, Matrix3): private helpers → static constants → all statics → instance fields → constructor
- **Fields-first** (Complex, Rotation2, Interval, Transform2): instance fields → private helpers → static constants → constructor → statics

Neither pattern matches `@typescript-eslint/member-ordering` defaults, and neither fully conforms to DOCUMENTATION_STANDARD.md Section 4. Strict enforcement of Section 4 would require a structural refactoring of all 7 core class files (see Limitations).

#### Scenario: Instance method before declarations blocked

- **WHEN** a class has an instance method defined before the constructor or static methods
- **THEN** ESLint SHALL report a warning

#### Scenario: Current codebase passes

- **WHEN** `npx eslint packages/math2d/src/` is executed
- **THEN** no member-ordering warnings SHALL be reported

### Requirement: Per-symbol-type required tag enforcement

A custom ESLint rule (`local/enforce-required-tags`) SHALL enforce that public symbols include `@category`, `@since`, and `@example` tags as specified by DOCUMENTATION_STANDARD.md Section 2.

The rule SHALL be disabled for test files (`**/test/**/*.ts`) via a dedicated ESLint flat-config override block placed **after** the main TypeScript rules block. Test helper constants and utilities are internal to the test suite and do not require public API documentation tags. This is consistent with DOCUMENTATION_STANDARD.md, which scopes its requirements to `packages/math2d/src/` only.

Note: In ESLint flat config, override order matters — the last matching block wins. The test file override MUST appear after the TypeScript `**/*.ts` block to take effect.

The rule SHALL classify symbols by AST node type and apply the tag matrix:

| Symbol Type        | `@category` | `@since` | `@example` |
| ------------------ | ----------- | -------- | ---------- |
| Function           | REQ         | REQ      | REQ        |
| Class              | REQ         | REQ      | REQ        |
| Interface          | REQ         | REQ      | NO         |
| Type Alias         | REQ         | REQ      | NO         |
| Constant           | REQ         | REQ      | opt        |
| Factory            | REQ         | REQ      | opt        |
| Static Method      | REQ         | REQ      | opt        |
| Triality Safe      | REQ         | REQ      | opt        |
| Triality Unchecked | REQ         | REQ      | NO         |
| Instance Method    | REQ         | REQ      | opt        |
| Getter             | REQ         | REQ      | opt        |
| Static Field       | REQ         | REQ      | opt        |
| @internal          | NO          | NO       | NO         |

Note: `@example` is set to **opt** (not REQ) for Factory, Static Method, and Triality Safe because the majority of these symbols in the codebase currently lack `@example` tags. Enforcing REQ would produce ~100+ false positives. This is a deliberate deviation from DOCUMENTATION_STANDARD.md Section 2 to allow gradual adoption.

**REQ** = warn if missing, **NO** = warn if present, **opt** = no enforcement.

#### Scenario: Public function missing @category

- **WHEN** an exported function lacks a `@category` tag
- **THEN** ESLint SHALL report a warning

#### Scenario: @internal with @category blocked

- **WHEN** a function marked `@internal` has a `@category` tag
- **THEN** ESLint SHALL report a warning that `@category` is prohibited on `@internal` symbols

#### Scenario: Triality Unchecked with @example blocked

- **WHEN** a static method with name ending in `Unchecked` has an `@example` tag
- **THEN** ESLint SHALL report a warning that `@example` is prohibited on Unchecked variants

#### Scenario: Compliant public function passes

- **WHEN** an exported function has `@category`, `@since`, and `@example` tags
- **THEN** ESLint SHALL not report any required-tag warnings

#### Scenario: Test file constants exempt

- **WHEN** a test helper file (e.g., `test/arbitraries.ts`) exports constants without `@category` or `@since` tags
- **THEN** ESLint SHALL not report any `enforce-required-tags` warnings
- **AND** the same constants in a `src/` file SHALL still trigger warnings

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

### Requirement: @see format enforcement

A custom ESLint rule (`local/enforce-see-format`) SHALL validate that `@see` tags follow the `{@link Target}` pattern, optionally followed by ` - description`.

#### Scenario: Plain text @see blocked

- **WHEN** a `@see` tag contains plain text without `{@link}`
- **THEN** ESLint SHALL report a warning

#### Scenario: Valid @see passes

- **WHEN** a `@see` tag contains `{@link Vector2.add} - Adds two vectors`
- **THEN** ESLint SHALL not report any `@see` format warnings

### Requirement: Tag fragment conventions

A custom ESLint rule (`local/enforce-tag-fragments`) SHALL enforce that `@param` and `@returns` descriptions are sentence fragments (no trailing period) and that `@param` uses dash separator format.

#### Scenario: Trailing period on @param blocked

- **WHEN** a `@param` description ends with a period (e.g., `@param x - The x coordinate.`)
- **THEN** ESLint SHALL report a warning

#### Scenario: Missing dash in @param blocked

- **WHEN** a `@param` tag uses format `@param x The x coordinate` (no dash)
- **THEN** ESLint SHALL report a warning

#### Scenario: Correct fragment passes

- **WHEN** `@param x - The x coordinate` (no trailing period, dash present)
- **THEN** ESLint SHALL not report any fragment warnings

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

### Requirement: Clean lint baseline

After all rules are configured, `npx eslint packages/math2d/src/` SHALL exit with code 0 on the current codebase.

#### Scenario: Full lint pass

- **WHEN** `npx eslint packages/math2d/src/` is executed
- **THEN** the command SHALL exit with code 0
- **AND** no errors or warnings SHALL be reported for `packages/math2d/src/**/*.ts` files

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

### Requirement: ESLint ignore consolidation

All file exclusion patterns SHALL be declared in the `ignores` array of `eslint.config.js` (ESLint flat config). The legacy `.eslintignore` file SHALL NOT exist, as ESLint 9+ does not support it.

The global ignores block SHALL exclude at minimum:

- `packages/**/lib/**` — generated bundles (Rollup output)
- `packages/**/main.*` and `packages/**/dev-main.*` — package entry points
- `docs/.docusaurus/**`, `docs/build/**`, `docs/docs/api/**` — Docusaurus artifacts
- `tools/package/**` — tooling output
- `openspec/**` — specification and documentation artifacts (not source code)

#### Scenario: Archived OpenSpec changes not linted

- **WHEN** `openspec/changes/archive/` contains `.mjs` or `.ts` files (e.g., benchmarks, examples)
- **THEN** ESLint SHALL not lint those files
- **AND** no errors or warnings SHALL be reported from `openspec/` paths

#### Scenario: No .eslintignore warning

- **WHEN** `npm run lint` is executed
- **THEN** no `ESLintIgnoreWarning` about `.eslintignore` SHALL be emitted

---

## Limitations

The following aspects of DOCUMENTATION_STANDARD.md are NOT enforced by ESLint rules and require manual review or future custom rules:

### Section 2 — Per-symbol-type tag requirements

- `@throws` is not required for triality-strict or prohibited for triality-safe (requires deeper analysis of which functions throw)
- `@constant` is not required on exported constants (requires distinguishing const from readonly)
- `@see` cross-linking for triality variants is not enforced (complex cross-file pattern, manual review)

### Section 4 — Fine-grained member ordering

- The specific section order within static methods (Factories → Arithmetic → Computed → Transform → Interpolation → Comparison) is not enforced
- The two competing class patterns are accepted rather than requiring one canonical order

### Section 5 — Transversal writing conventions

- Imperative voice in summaries is not enforced (requires NLP)
- LaTeX prohibition is not enforced (extremely rare)
