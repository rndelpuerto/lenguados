## ADDED Requirements

### Requirement: File header format

Every `.ts` source file in `packages/math2d/src/` SHALL have a file-level JSDoc block as its first statement containing `@file`, `@module`, and `@description` tags.

- `@file` SHALL contain the path relative to `src/` (e.g., `core/vector2.ts`, `auxiliary/scalar/arithmetic.ts`)
- `@module` SHALL contain the full NPM module path (e.g., `@lenguados/math2d/core`, `@lenguados/math2d/auxiliary/scalar`)
- `@description` SHALL be a single sentence describing the file's purpose without trailing period and without project name suffix (e.g., NOT "... for the Lenguado 2-D physics-engine family")
- `@remarks` SHALL be present on core type files (`core/*.ts`) and MAY be present on other files

#### Scenario: Core type file header

- **WHEN** a file in `src/core/` is inspected
- **THEN** it SHALL have `@file`, `@module`, `@description`, and `@remarks` tags
- **AND** `@remarks` SHALL contain design context with markdown-formatted sections

#### Scenario: Auxiliary file header

- **WHEN** a file in `src/auxiliary/` is inspected
- **THEN** it SHALL have `@file`, `@module`, and `@description` tags
- **AND** `@remarks` MAY be present if the module has non-obvious design context

#### Scenario: Description without project name

- **WHEN** any `@description` tag is inspected
- **THEN** it SHALL NOT contain phrases like "for the Lenguado physics-engine family" or similar project-scoping suffixes

### Requirement: Canonical tag order

All TSDoc blocks SHALL follow a fixed tag order. Tags present in a block SHALL appear in the following sequence:

1. Summary line (no tag, first line)
2. `@file` (file headers only)
3. `@module` (file headers only)
4. `@description` (file headers only)
5. `@remarks`
6. `@param` (in signature order)
7. `@returns`
8. `@throws`
9. `@defaultValue`
10. `@example`
11. `@see`
12. `@internal`
13. `@constant`
14. `@category`
15. `@since`
16. `@public`

Not all tags are required in every block — only those that are present SHALL follow this order.

#### Scenario: Function with full documentation

- **WHEN** a public function has `@param`, `@returns`, `@throws`, `@example`, `@see`, `@category`, and `@since` tags
- **THEN** they SHALL appear in that exact order within the JSDoc block

#### Scenario: Tag order violation

- **WHEN** a JSDoc block has `@example` appearing before `@returns`
- **THEN** the block SHALL be considered non-conformant and MUST be corrected

### Requirement: Mandatory tags on public exports

Every public exported symbol (function, class, constant, interface, type alias) SHALL have `@category` and `@since` tags.

#### Scenario: Exported function

- **WHEN** a function is exported from any `src/` file
- **THEN** its JSDoc block SHALL contain both `@category` and `@since` tags

#### Scenario: Exported constant

- **WHEN** a constant is exported from any `src/` file
- **THEN** its JSDoc block SHALL contain `@constant {type}`, `@category`, and `@since` tags

#### Scenario: Exported interface

- **WHEN** an interface is exported from any `src/` file
- **THEN** its JSDoc block SHALL contain `@category` and `@since` tags

#### Scenario: Internal symbol exclusion

- **WHEN** a symbol has the `@internal` tag
- **THEN** it SHALL NOT have `@category` or `@since` tags

### Requirement: Controlled category vocabulary

The `@category` tag SHALL use values from the controlled vocabulary. No other values SHALL be used.

**Base categories** (available in all files):
`Constant`, `Factory`, `Arithmetic`, `Computed`, `Transform`, `Interpolation`, `Comparison`, `Mutator`, `Accessor`, `Conversion`

**Type-specific categories** (only in designated files):

- `Matrix Operations` — Matrix2, Matrix3
- `Set Operations` — Interval
- `Column/Row` — Matrix2, Matrix3
- `Transform Integration` — Vector2, Transform2
- `Direction` — Vector2
- `Geometry` — Vector2
- `Constraint` — Vector2

**Auxiliary file categories** (one per file):
`Safety`, `Wrapping`, `Guards`, `Normalization`

**Constants file sub-categories:**
`Tolerance`, `Angular`, `Mathematical`, `Numeric Limits`, `Collection`

**Structural categories:**
`Core`, `Types`, `Helpers`, `Configuration`, `Assertion`

#### Scenario: Base category usage

- **WHEN** a static factory method `fromValues` exists in any core type
- **THEN** its `@category` SHALL be `Factory`

#### Scenario: Type-specific category usage

- **WHEN** `Matrix3.transpose()` is documented
- **THEN** its `@category` SHALL be `Matrix Operations`

#### Scenario: Invalid category rejection

- **WHEN** a symbol uses `@category Geometry & Measures`
- **THEN** it SHALL be considered non-conformant (correct value: `Computed` or `Geometry` depending on the operation)

#### Scenario: Auxiliary file category

- **WHEN** a function in `auxiliary/numeric/safety.ts` is documented
- **THEN** its `@category` SHALL be `Safety`

### Requirement: Class member section ordering

Class files SHALL organize members in sections using visual dividers, in the following order:

**Outside class:**

1. Type Exports
2. Helper Functions

**Inside class:**

1. Instance Properties (instance fields)
2. Static Constants (Immutable) (static readonly fields)
3. Constructor
4. Private Helpers (private static methods)
5. Static Factories (`@category Factory`)
6. Static Arithmetic (`@category Arithmetic`)
7. Static Computed (`@category Computed`)
8. Static Transforms (`@category Transform`)
9. Static Interpolation (`@category Interpolation`)
10. Static Comparison (`@category Comparison`)
11. [Static Type-Specific] (type-specific `@category`)
12. Instance Getters (`@category Accessor`)
13. Instance Mutators (`@category Mutator`)
14. Instance Arithmetic (`@category Arithmetic`)
15. Instance Computed (`@category Computed`)
16. Instance Transforms (`@category Transform`)
17. Instance Interpolation (`@category Interpolation`)
18. Instance Comparison (`@category Comparison`)
19. [Instance Type-Specific] (type-specific `@category`)
20. Instance Conversion (`@category Conversion`)

Sections that have no members in a given class MAY be omitted (no empty section dividers).

#### Scenario: Fields before constructor

- **WHEN** a class has instance properties and a constructor
- **THEN** instance properties SHALL appear before the constructor in the source file

#### Scenario: Static constants after instance properties

- **WHEN** a class has both instance properties and static readonly constants
- **THEN** static constants SHALL appear after instance properties and before the constructor

#### Scenario: Static methods before instance methods

- **WHEN** a class has both static and instance methods
- **THEN** all static method sections SHALL appear before all instance method sections

#### Scenario: Accessors before instance methods

- **WHEN** a class has both getter properties and instance methods
- **THEN** the Instance Getters section SHALL appear before Instance Mutators

#### Scenario: Omitted empty sections

- **WHEN** a class has no interpolation methods (e.g., a type that doesn't support lerp)
- **THEN** the Static Interpolation and Instance Interpolation sections SHALL be omitted entirely

#### Scenario: Type-specific section placement

- **WHEN** Matrix3 has a "Static Matrix Operations" section
- **THEN** it SHALL appear after Static Comparison and before Instance Getters

### Requirement: Section divider format

Section dividers SHALL use consistent visual comment blocks.

- File-level dividers SHALL be 80 characters total width
- Class-level dividers SHALL be 78 characters total width (accounting for 1-space indentation)
- Divider format: three lines with `=` padding, section name left-aligned

#### Scenario: File-level divider

- **WHEN** a section divider appears outside a class body
- **THEN** it SHALL follow this exact format (80 chars):
  ```
  /* ========================================================================== */
  /* Section Name                                                               */
  /* ========================================================================== */
  ```

#### Scenario: Class-level divider

- **WHEN** a section divider appears inside a class body
- **THEN** it SHALL follow this exact format (78 chars, 1-space indent):
  ```
   /* ======================================================================== */
   /* Section Name                                                             */
   /* ======================================================================== */
  ```

### Requirement: Standalone function documentation template

Every exported standalone function (not a class method) SHALL have a JSDoc block containing:

- Summary line in imperative voice (e.g., "Clamps", "Returns", "Tests")
- `@param` for each parameter as a sentence fragment without trailing period
- `@returns` as a sentence fragment
- `@example` with at least 2 cases (normal + edge) with inline result comments
- `@category` and `@since`

Optional: `@remarks` (only for edge cases, precision notes, or algorithm descriptions), `@throws` (only if the function can throw).

#### Scenario: Simple function

- **WHEN** the function `clamp(value, min, max)` is documented
- **THEN** summary SHALL be imperative (e.g., "Clamps a value between min and max bounds")
- **AND** each `@param` SHALL be a sentence fragment (e.g., `@param value - Value to clamp`)
- **AND** `@example` SHALL show at least normal and edge cases

#### Scenario: Function with edge cases

- **WHEN** a function like `nearEquals` has non-trivial edge case behavior (NaN, Infinity)
- **THEN** `@remarks` SHALL document those edge cases

### Requirement: Triality strict variant documentation

The strict variant of a triality set SHALL document:

- Summary without suffix (not "strict" in name — it's the default)
- `@throws {ErrorType}` with the condition that causes failure
- `@example` including a case that triggers the throw
- `@see {@link fnSafe} - Returns fallback if condition`
- `@see {@link fnUnchecked} - No validation`

#### Scenario: Strict variant cross-links

- **WHEN** `normalize()` is the strict variant
- **THEN** its JSDoc SHALL contain `@see {@link normalizeSafe}` and `@see {@link normalizeUnchecked}`
- **AND** each `@see` SHALL have a `- description` suffix

#### Scenario: Strict variant example includes throw

- **WHEN** `normalize()` can throw RangeError for zero-length vectors
- **THEN** `@example` SHALL include a case showing the throw condition

### Requirement: Triality safe variant documentation

The safe variant of a triality set SHALL document:

- Summary that includes the fallback behavior (e.g., "Returns (0,0) if v has zero length")
- `@returns` documenting both normal and fallback paths
- `@see {@link fn} - Throws for degenerate input` (link to strict only)
- `@remarks` only if the fallback choice needs justification

The safe variant SHALL NOT have `@throws` tags.
The safe variant SHALL NOT have `@see` link to the unchecked variant.

#### Scenario: Safe variant summary

- **WHEN** `normalizeSafe()` is documented
- **THEN** the summary SHALL mention the fallback (e.g., "Safe normalization. Returns (0,0) if v has zero length")

#### Scenario: Safe variant no throws

- **WHEN** `divideSafe()` is documented
- **THEN** there SHALL be no `@throws` tag in its JSDoc block

### Requirement: Triality unchecked variant documentation

The unchecked variant of a triality set SHALL document:

- Summary mentioning "no validation" or "for hot paths"
- `@param` descriptions including preconditions with "(must ...)" phrasing
- `@remarks` with bold precondition statement
- `@see {@link fn} - Throws on invalid input`
- `@see {@link fnSafe} - Returns fallback on invalid input`

The unchecked variant SHALL NOT have `@example` tags (usage is always the same pattern — the caller guarantees preconditions).

#### Scenario: Unchecked variant precondition

- **WHEN** `normalizeUnchecked(v)` is documented
- **THEN** `@param v` SHALL include "(must have non-zero length)" or equivalent

#### Scenario: Unchecked variant no example

- **WHEN** any `*Unchecked` method is documented
- **THEN** there SHALL be no `@example` tag in its JSDoc block

### Requirement: Class documentation template

Every exported class SHALL have a JSDoc block containing:

- Summary: one sentence describing the type and its purpose
- `@remarks` with three standard sections: **Design** (instance vs static behavior), **Numerics** (determinism or precision characteristics), **Safety** (availability of safe variants)
- `@example` showing both static (pure, with `out`) and instance (mutable, chainable) usage patterns
- `@category Core` and `@since`

#### Scenario: Class with full documentation

- **WHEN** `Vector2` class is documented
- **THEN** `@remarks` SHALL contain sections for Design, Numerics, and Safety
- **AND** `@example` SHALL show static allocation-controlled and instance chainable patterns

### Requirement: Interface documentation template

Every exported `*Like` interface SHALL have a minimal JSDoc block containing:

- Summary: one sentence (e.g., "Readonly interface for Type components")
- `@category Types` and `@since`

Interfaces SHALL NOT have `@remarks` or `@example` tags unless exceptional circumstances require them.

#### Scenario: Like interface minimal docs

- **WHEN** `ReadonlyVector2Like` is documented
- **THEN** it SHALL have only summary, `@category Types`, and `@since`
- **AND** it SHALL NOT have `@remarks` or `@example`

### Requirement: Exported constant documentation template

Every exported constant SHALL have:

- Summary describing what the constant represents
- `@constant {type}` with explicit type
- `@category` and `@since`

Constants with non-obvious values SHALL have `@remarks` explaining the rationale.
Conversion constants (e.g., `DEG_TO_RAD`) SHALL have `@example`.

#### Scenario: Constant with justification

- **WHEN** `MIN_SAFE_DIVISOR` is documented
- **THEN** `@remarks` SHALL explain why the value `1e-10` was chosen and reference external standards

#### Scenario: Trivial constant

- **WHEN** `PI` is documented
- **THEN** it SHALL have summary, `@constant {number}`, `@category`, `@since`
- **AND** `@remarks` and `@example` MAY be omitted

#### Scenario: Conversion constant with example

- **WHEN** `DEG_TO_RAD` is documented
- **THEN** `@example` SHALL show usage (e.g., `const radians = degrees * DEG_TO_RAD`)

### Requirement: Static class constant documentation template

Static readonly constants inside classes SHALL have:

- One-line summary with the value representation in backticks (e.g., "The zero/origin vector `(0, 0)`")
- `@category Constant` and `@since`

Static class constants SHALL NOT have `@remarks` unless the value has special geometric significance.

#### Scenario: Static constant one-liner

- **WHEN** `Vector2.ZERO` is documented
- **THEN** its JSDoc SHALL be a single-line summary: `The zero/origin vector \`(0, 0)\``
- **AND** it SHALL have `@category Constant` and `@since`

### Requirement: Factory method documentation template

Static factory methods SHALL have:

- Summary starting with "Creates" (e.g., "Creates a vector from polar coordinates")
- `@param out - Optional output [type]` as the standard phrasing for the `out` parameter
- `@example` showing usage with and without the `out` parameter
- `@category Factory` and `@since`

#### Scenario: Factory with out parameter

- **WHEN** `Vector2.fromAngle(angle, radius, out?)` is documented
- **THEN** `@param out` SHALL read "Optional output vector"
- **AND** `@example` SHALL show both `Vector2.fromAngle(Math.PI / 2)` and `Vector2.fromAngle(Math.PI / 2, 1, existingVec)`

### Requirement: Instance mutator documentation template

Instance methods that mutate `this` and return `this` SHALL have:

- Summary describing the mutation
- `@returns` stating `` `this` for chaining `` or `` `this` ``
- `@example` showing chaining when natural

#### Scenario: Chainable instance method

- **WHEN** `Vector2.prototype.add(v)` is documented
- **THEN** `@returns` SHALL mention `this` for chaining
- **AND** `@example` MAY show chaining (e.g., `v.add(a).scale(2)`)

### Requirement: Internal function documentation template

Functions marked `@internal` SHALL have:

- Summary describing the internal purpose
- `@param` and `@returns` as needed
- `@remarks` only for complex algorithms
- `@internal` as the last tag

Internal functions SHALL NOT have `@category`, `@since`, or `@example` tags.

#### Scenario: Internal helper

- **WHEN** `ensureOut()` private static method is documented
- **THEN** it SHALL have `@internal` and SHALL NOT have `@category` or `@since`

#### Scenario: Internal algorithm

- **WHEN** `complexDivideSmith()` is documented
- **THEN** it SHALL have `@internal` and `@remarks` explaining the algorithm

### Requirement: Type alias and re-export documentation

Exported type aliases SHALL have:

- Summary with `{@link}` to the source type (e.g., "Readonly view of a {@link Vector2} instance")
- `@category Types`, `@since`, and `@public`

Re-exports SHALL have a JSDoc block at the re-export site if the original lacks one.

#### Scenario: Readonly type alias

- **WHEN** `ReadonlyVector2` is defined as `Readonly<Vector2>`
- **THEN** its summary SHALL reference `{@link Vector2}`
- **AND** it SHALL have `@category Types`, `@since`, and `@public`

### Requirement: Transversal documentation rules

The following rules SHALL apply across all documentation:

- Summary lines SHALL use imperative voice ("Clamps", "Returns", "Tests", not "This function clamps")
- `@param` and `@returns` descriptions SHALL be sentence fragments without trailing periods
- `@see` tags SHALL use the format `{@link Target} - description`
- Unicode symbols (θ, π, φ, ≈, ±, ∞) SHALL be permitted in prose; LaTeX SHALL NOT be used
- Mathematical formulas SHALL be rendered as ASCII art inside code blocks
- `@group` tags SHALL NOT be used (use visual section dividers instead)
- `@alpha` and `@beta` tags SHALL NOT be used (all exports are stable)

#### Scenario: Imperative summary

- **WHEN** a function summary reads "This function clamps a value"
- **THEN** it SHALL be corrected to "Clamps a value"

#### Scenario: Param without period

- **WHEN** `@param value` reads "The value to clamp."
- **THEN** the trailing period SHALL be removed: "Value to clamp"

#### Scenario: See tag format

- **WHEN** a `@see` tag references `normalizeSafe`
- **THEN** it SHALL be formatted as `@see {@link normalizeSafe} - Returns (0,0) on zero-length vectors`

#### Scenario: Unicode in prose

- **WHEN** documentation mentions "pi/2 radians"
- **THEN** it MAY use "π/2 radians" with the Unicode symbol

#### Scenario: No LaTeX

- **WHEN** documentation needs to show a formula like the rotation matrix
- **THEN** it SHALL use ASCII art in a code block, not LaTeX notation

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
