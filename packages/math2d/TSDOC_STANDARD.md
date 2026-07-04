# @lenguados/math2d TSDoc Standard

This document is the authoritative reference for TSDoc documentation conventions in the `@lenguados/math2d` package. It extends the engine-wide [TSDoc Standard](../../TSDOC_STANDARD.md) with package-specific templates, `@category` vocabulary, and member-ordering rules. Every source file in `packages/math2d/src/` SHALL conform to this standard.

**Scope:** documentation only — this standard does not govern runtime behavior, API design, or build configuration.

**Related documents:**

- [ARCHITECTURE.md](ARCHITECTURE.md) — layering strategy, key patterns, naming conventions
- [DESIGN_PHILOSOPHY.md](DESIGN_PHILOSOPHY.md) — POA principles, intentional SOLID deviations
- [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) — ADRs for architectural choices

---

## 1. Canonical Tag Order

All TSDoc blocks SHALL follow this fixed order. Only tags present in a given block need appear — but those that do SHALL respect this sequence:

| #   | Tag             | Scope               | Purpose                                  |
| --- | --------------- | ------------------- | ---------------------------------------- |
| 1   | _(summary)_     | All                 | First line, no tag prefix                |
| 2   | `@file`         | File headers only   | Relative path from `src/`                |
| 3   | `@module`       | File headers only   | Full NPM module path                     |
| 4   | `@description`  | File headers only   | One-sentence purpose                     |
| 5   | `@remarks`      | Where needed        | Details, design context, edge cases      |
| 6   | `@param`        | Functions/methods   | One per parameter, in signature order    |
| 7   | `@returns`      | Functions/methods   | Return value description                 |
| 8   | `@throws`       | Fallible functions  | Error type and condition                 |
| 9   | `@defaultValue` | Optional params     | Default value when inline is unclear     |
| 10  | `@example`      | Most public symbols | Usage demonstrations                     |
| 11  | `@see`          | Cross-references    | Links to related symbols                 |
| 12  | `@internal`     | Private helpers     | Marks non-public API                     |
| 13  | `@constant`     | Constants           | Type annotation for constants            |
| 14  | `@category`     | Public exports      | TypeDoc grouping (controlled vocabulary) |
| 15  | `@since`        | Public exports      | First version containing this symbol     |
| 16  | `@public`       | Overrides only      | Explicit public visibility               |

### Required vs Optional Tags by Symbol Type

| Tag         | Function  | Triality Strict | Triality Safe | Triality Unchecked | Class    | Interface | Constant | Factory   | Instance Method | @internal |
| ----------- | --------- | --------------- | ------------- | ------------------ | -------- | --------- | -------- | --------- | --------------- | --------- |
| Summary     | **REQ**   | **REQ**         | **REQ**       | **REQ**            | **REQ**  | **REQ**   | **REQ**  | **REQ**   | **REQ**         | **REQ**   |
| `@remarks`  | opt       | opt             | opt¹          | **REQ**²           | **REQ**³ | —         | opt⁴     | opt       | opt             | opt⁵      |
| `@param`    | **REQ**   | **REQ**         | **REQ**       | **REQ**            | —        | —         | —        | **REQ**   | **REQ**         | **REQ**   |
| `@returns`  | **REQ**   | **REQ**         | **REQ**       | **REQ**            | —        | —         | —        | **REQ**   | **REQ**         | **REQ**   |
| `@throws`   | if throws | **REQ**         | **NO**        | —                  | —        | —         | —        | if throws | if throws       | —         |
| `@example`  | **REQ**   | **REQ**         | **REQ**       | **NO**             | **REQ**  | **NO**    | opt⁶     | **REQ**   | opt             | **NO**    |
| `@see`      | opt       | **REQ**⁷        | **REQ**⁸      | **REQ**⁹           | opt      | —         | opt      | opt       | opt             | —         |
| `@constant` | —         | —               | —             | —                  | —        | —         | **REQ**  | —         | —               | —         |
| `@category` | **REQ**   | **REQ**         | **REQ**       | **REQ**            | **REQ**  | **REQ**   | **REQ**  | **REQ**   | **REQ**         | **NO**    |
| `@since`    | **REQ**   | **REQ**         | **REQ**       | **REQ**            | **REQ**  | **REQ**   | **REQ**  | **REQ**   | **REQ**         | **NO**    |

**REQ** = mandatory, **opt** = use when relevant, **NO** = must not include, **—** = not applicable

¹ Only if fallback choice needs justification.
² Must include bold **Precondition:** statement.
³ Must contain **Design**, **Numerics**, **Safety** sections.
⁴ Required for constants with non-obvious values (for example `MIN_SAFE_DIVISOR`).
⁵ Only for complex algorithms (for example `complexDivideSmith`).
⁶ Required for conversion constants (for example `DEG_TO_RAD`); optional for trivial constants (for example `PI`).
⁷ `@see` to Safe + Unchecked.
⁸ `@see` to Strict only.
⁹ `@see` to Strict + Safe.

---

## 2. Documentation Templates

### Template 1: File Header

Every `.ts` source file SHALL start with this block:

```typescript
/**
 * @file layer/module/filename.ts
 * @module @lenguados/math2d/layer/module
 * @description One-sentence purpose of this file
 *
 * @remarks
 * **Section Heading** (markdown bold)
 * - Design notes, conventions, mathematical context
 * - ASCII diagrams or formulas in code blocks when helpful
 */
```

**Rules:**

- `@file`: path relative from `src/` (for example `core/vector2.ts`)
- `@module`: full NPM path (for example `@lenguados/math2d/core`)
- `@description`: one sentence, no trailing period, no project name suffix
- `@remarks`: mandatory for `core/*.ts` files; optional elsewhere

**Gold standard:** `core/vector2.ts`, `core/matrix3.ts`

### Template 2: Exported Constant

````typescript
/**
 * Summary: what the constant represents.
 *
 * @remarks
 * Why this value was chosen. Trade-offs considered.
 * Cross-references to external standards.
 *
 * @example
 * ```typescript
 * const radians = degrees * DEG_TO_RAD;
 * ```
 *
 * @constant {number}
 * @category CategoryName
 * @since X.Y.Z
 */
export const CONSTANT_NAME = value;
````

**Rules:**

- `@constant {type}` always present with explicit type
- `@remarks` if the value needs justification (for example `MIN_SAFE_DIVISOR`, `EPSILON`)
- `@example` if the constant is used in arithmetic (for example conversion factors); omit for trivial constants (for example `PI`)

**Gold standard:** `MIN_SAFE_DIVISOR` (safety.ts), `DEG_TO_RAD` (constants.ts)

### Template 3: Standalone Function

````typescript
/**
 * Present-tense third-person summary of what the function does.
 * @param name - Sentence fragment, no trailing period
 * @param name - Another parameter description
 * @returns Sentence fragment describing return value
 *
 * @remarks
 * Edge cases, precision notes, or algorithm description.
 *
 * @example
 * ```typescript
 * functionName(normalInput);    // expected output
 * functionName(edgeCase);       // edge case output
 * ```
 *
 * @category CategoryName
 * @since X.Y.Z
 */
````

**Rules:**

- Summary uses present-tense third-person singular: "Clamps", "Returns", "Tests" (NOT "This function clamps", and NOT the literal imperative "Clamp")
- `@param`: sentence fragment without trailing period, one dash after name
- `@returns`: sentence fragment
- `@example`: minimum 2 cases (normal + edge) with inline result comments
- `@remarks`: only if edge cases, precision limits, or algorithm are non-trivial

**Gold standard:** `clamp` (arithmetic.ts), `nearEquals` (comparison.ts)

### Template 4: Triality — Strict Variant

````typescript
/**
 * Summary of the operation.
 * @param name - Description
 * @returns Description
 *
 * @remarks
 * Detailed behavior. Precision limits if applicable.
 *
 * @throws {RangeError} If condition that causes failure
 *
 * @example
 * ```typescript
 * fn(normalInput);     // normal result
 * fn(degenerateInput); // throws RangeError
 * ```
 *
 * @see {@link fnSafe} - Returns fallback if condition
 * @see {@link fnUnchecked} - No validation
 *
 * @category CategoryName
 * @since X.Y.Z
 */
````

**Rules:**

- `@throws`: error type in braces, condition as prose
- `@see`: cross-reference to BOTH Safe and Unchecked with dash and description
- `@example`: must include the case that triggers the throw

**Gold standard:** `normalize` (vector2.ts), `flooredMod` (wrapping.ts)

### Template 5: Triality — Safe Variant

````typescript
/**
 * Summary including fallback. Returns fallback if condition.
 * @param name - Description
 * @returns Description, or fallback if condition
 *
 * @remarks
 * Why this fallback was chosen (only if non-obvious).
 *
 * @example
 * ```typescript
 * fnSafe(normalInput);      // normal result
 * fnSafe(degenerateInput);  // fallback value
 * ```
 *
 * @see {@link fn} - Throws for degenerate input
 *
 * @category CategoryName
 * @since X.Y.Z
 */
````

**Rules:**

- Summary includes fallback behavior (for example "Returns (0,0) if v has zero length")
- `@returns`: documents both normal and fallback paths
- `@see`: link to strict variant ONLY (not to unchecked)
- `@remarks`: only if the fallback choice needs justification
- **NO `@throws`** — safe variants never throw

**Gold standard:** `normalizeSafe` (vector2.ts), `divideSafe` (safety.ts)

### Template 6: Triality — Unchecked Variant

```typescript
/**
 * Summary (no validation, for hot paths).
 * @param name - Description (must satisfy precondition)
 * @returns Description
 *
 * @remarks
 * **Precondition:** condition that must hold.
 * Undefined behavior if violated (result may be NaN/Infinity).
 *
 * @see {@link fn} - Throws on invalid input
 * @see {@link fnSafe} - Returns fallback on invalid input
 *
 * @category CategoryName
 * @since X.Y.Z
 */
```

**Rules:**

- Summary mentions "no validation" or "for hot paths"
- `@param`: preconditions in description with "(must ...)" phrasing
- `@remarks`: **bold** precondition statement
- `@see`: cross-reference to BOTH strict and safe
- **NO `@example`** — usage is always the same; the caller guarantees preconditions

**Gold standard:** `normalizeUnchecked` (vector2.ts), `flooredModUnchecked` (wrapping.ts)

### Template 7: Class

````typescript
/**
 * One-sentence description of the type and its purpose.
 *
 * @remarks
 * - **Design:** Instance vs static behavior description.
 * - **Numerics:** Determinism or precision characteristics.
 * - **Safety:** Availability of safe variants.
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const result = Type.operation(a, b);
 * Type.operation(a, b, existingInstance); // Reuse allocation
 *
 * // Instance (mutable, chainable)
 * instance.method1(arg).method2(arg);
 * ```
 *
 * @category Core
 * @since X.Y.Z
 */
export class TypeName implements TypeNameLike {
````

**Rules:**

- Summary: type + purpose in one sentence
- `@remarks`: three standard sections (Design, Numerics, Safety) with bullets
- `@example`: show both static pure and instance chainable patterns

**Gold standard:** `Vector2` (vector2.ts), `Matrix3` (matrix3.ts)

### Template 8: Interface (`*Like`)

```typescript
/**
 * Readonly interface for Type components.
 *
 * @category Types
 * @since X.Y.Z
 */
export interface ReadonlyTypeLike {
 readonly prop: number;
}
```

**Rules:**

- Minimal summary — one sentence
- No `@remarks`, no `@example`
- `@category Types` always
- Readonly and Mutable as a pair

**Gold standard:** `ReadonlyVector2Like` (types/index.ts)

### Template 9: Static Class Constant

```typescript
/**
 * Description `(value representation)`.
 * @category Constant
 * @since X.Y.Z
 */
public static readonly NAME = freezeType(new Type(values));
```

**Rules:**

- Summary in one line with value representation in backticks
- `@category Constant` (not the class's main category)
- No `@remarks` unless the value has special geometric significance

**Gold standard:** `Vector2.ZERO`, `Vector2.UNIT_X`

### Template 10: Static Factory Method

````typescript
/**
 * Creates a Type from [source description].
 *
 * @param source - Description
 * @param out - Optional output instance
 * @returns A Type with description of state
 * @throws {ErrorType} If validation fails
 *
 * @example
 * ```typescript
 * Type.fromSource(input);              // new instance
 * Type.fromSource(input, existing);    // reuse allocation
 * ```
 *
 * @category Factory
 * @since X.Y.Z
 */
````

**Rules:**

- Summary starts with "Creates"
- `@param out - Optional output [type]` — standard phrasing
- `@example`: show both with and without `out`

**Gold standard:** `Vector2.fromAngle` (vector2.ts), `Rotation2.fromAngle` (rotation2.ts)

### Template 11: Instance Method (Mutator/Chainable)

````typescript
/**
 * Summary of the mutation.
 *
 * @param name - Description
 * @returns `this` for chaining
 *
 * @example
 * ```typescript
 * v.method(arg1).otherMethod(arg2);
 * ```
 *
 * @category CategoryName
 * @since X.Y.Z
 */
public method(param: type): this {
````

**Rules:**

- `@returns` always says `` `this` for chaining `` or `` `this` ``
- `@example` shows chaining when natural

### Template 12: `@internal` Function

```typescript
/**
 * Summary of internal purpose.
 * @param name - Description
 * @returns Description
 *
 * @remarks
 * Algorithm details if non-trivial.
 *
 * @internal
 */
```

**Rules:**

- No `@category`, no `@since`, no `@example`
- `@internal` as last tag
- `@remarks` only for complex algorithms (for example Smith's division, fdlibm kernels)

**Gold standard:** `complexDivideSmith` (complex.ts), `ensureOut` (all core types)

### Template 13: Type Alias / Re-export

```typescript
/**
 * Readonly view of a {@link TypeName} instance.
 *
 * @category Types
 * @since X.Y.Z
 * @public
 */
export type ReadonlyType = Readonly<TypeName>;
```

**Rules:**

- Summary uses `{@link}` to reference the source type
- `@public` to ensure visibility in TypeDoc

### Template 14: Section Divider

Section dividers visually group related code. They are NOT TSDoc tags.

**File-level** (outside class, 80 characters total):

```
/* ========================================================================== */
/* Section Name                                                               */
/* ========================================================================== */
```

**Class-level** (inside class, 78 characters total, 1-space indent):

```
 /* ======================================================================== */
 /* Section Name                                                             */
 /* ======================================================================== */
```

**Rules:**

- `=` sign padding
- Section name left-aligned, space-padded to width
- Three lines per divider
- Omit dividers for sections with no members

---

## 3. Controlled `@category` Vocabulary

### Base Categories

Reused across ALL core type class files:

| `@category`     | Purpose                               | Typical Members                                                           |
| --------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| `Constant`      | Static readonly frozen instances      | `ZERO`, `IDENTITY`, `UNIT_X`                                              |
| `Factory`       | Static creation methods               | `fromValues`, `clone`, `copy`, `fromAngle`                                |
| `Arithmetic`    | Arithmetic operations                 | `add`, `subtract`, `multiply`, `divide`, `scale`, `negate`, `fma`         |
| `Computed`      | Pure computations returning scalars   | `determinant`, `trace`, `frobeniusNorm`, `angle`, `magnitude`             |
| `Transform`     | Shape-preserving operations           | `normalize`, `rotate`, `project`, `reflect`, `floor`, `ceil`, `abs`       |
| `Interpolation` | Value blending                        | `lerp`, `slerp`, `smoothStep`, `lerpClamped`                              |
| `Comparison`    | Equality, ordering, predicates        | `exactEquals`, `nearEquals`, `isZero`, `isUnit`, `isFinite`, `isParallel` |
| `Mutator`       | Instance set/copy/reset               | `set`, `copy`, `zero`, `setX`, `setY`, `setScalar`                        |
| `Accessor`      | Derived getters (readonly properties) | `normalized`, `negated`, `flippedX`, `xx`, `xy`                           |
| `Conversion`    | Serialization and type conversion     | `toArray`, `toJSON`, `toString`, `clone`, `toComplexLike`                 |

### Type-Specific Categories

Only valid in the files listed:

| `@category`             | Valid In            | Typical Members                                                                 |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `Matrix Operations`     | Matrix2, Matrix3    | `transpose`, `inverse`, `compose`, `decompose`                                  |
| `Set Operations`        | Interval            | `union`, `intersect`, `contains`, `overlaps`                                    |
| `Column/Row`            | Matrix2, Matrix3    | `getColumn`, `setColumn`, `getRow`, `setRow`                                    |
| `Transform Integration` | Vector2, Transform2 | `applyRotation2`, `applyMatrix3`, `applyTransform2`                             |
| `Direction`             | Vector2             | `direction`, `directionSafe`, `perpendicular`, `angleTo`                        |
| `Geometry`              | Vector2             | `dot`, `cross`, `magnitude`, `distance`, `distanceSquared`, `manhattanDistance` |
| `Constraint`            | Vector2             | `clamp`, `clampMagnitude`, `limit`, `min`, `max`                                |

### Auxiliary File Categories

Each auxiliary file uses a single primary category:

| File                      | `@category`     |
| ------------------------- | --------------- |
| `scalar/arithmetic.ts`    | `Arithmetic`    |
| `scalar/comparison.ts`    | `Comparison`    |
| `scalar/interpolation.ts` | `Interpolation` |
| `numeric/safety.ts`       | `Safety`        |
| `numeric/wrapping.ts`     | `Wrapping`      |
| `numeric/rounding.ts`     | `Arithmetic`    |
| `numeric/guards.ts`       | `Guards`        |
| `angle/operations.ts`     | `Arithmetic`    |
| `angle/conversion.ts`     | `Conversion`    |
| `angle/normalization.ts`  | `Normalization` |
| `angle/interpolation.ts`  | `Interpolation` |
| `angle/unwrapping.ts`     | `Normalization` |

### Constants File Sub-Categories

The constants file (`scalar/constants.ts`) uses sub-categories to group its exports:

| `@category`      | Members                                                  |
| ---------------- | -------------------------------------------------------- |
| `Tolerance`      | `EPSILON`, `MIN_SAFE_DIVISOR`                            |
| `Angular`        | `PI`, `TAU`, `HALF_PI`, `QUARTER_PI`                     |
| `Conversion`     | `DEG_TO_RAD`, `RAD_TO_DEG`, `RAD_TO_TURN`, `TURN_TO_RAD` |
| `Mathematical`   | `SQRT_2`, `SQRT_HALF`, `LN_2`                            |
| `Numeric Limits` | `SMALLEST_NORMAL`                                        |
| `Collection`     | `Constants` (unified object)                             |

### Structural Categories

Used outside core types:

| `@category`     | Used In                                                  |
| --------------- | -------------------------------------------------------- |
| `Core`          | Class-level `@category` on core types                    |
| `Types`         | Interfaces, type aliases, type guards                    |
| `Helpers`       | Helper functions outside classes (`freezeVector2`, etc.) |
| `Configuration` | Validation configuration functions                       |
| `Assertion`     | Public assertion functions (`assert`, `assertFinite`)    |

### Invalid Categories

The following are **deprecated** and SHALL NOT be used; replace them when encountered:

| Old Value                   | Replacement               |
| --------------------------- | ------------------------- |
| `Geometry & Measures`       | `Computed` or `Geometry`  |
| `Direction & Angles`        | `Direction` or `Computed` |
| `Numeric Transform`         | `Transform`               |
| `Vector Transforms`         | `Transform`               |
| `Constraints`               | `Constraint`              |
| `Predicate`                 | `Comparison`              |
| `Serialization`             | `Conversion`              |
| `Composition`               | `Matrix Operations`       |
| `Batch Operations`          | `Matrix Operations`       |
| `Validation` (as @category) | `Comparison`              |
| `Component`                 | `Accessor` or remove      |

---

## 4. Class Member Section Ordering

### Core Type Files

All class files in `src/core/` SHALL organize members in this order:

```
FILE HEADER (@file, @module, @description, @remarks)

=== Type Exports ===                     (outside class)
=== Helper Functions ===                 (outside class)

=== Class: TypeName ===

  -- Instance Properties --              instance fields (x, y, etc.)
  -- Static Constants (Immutable) --     static readonly fields (ZERO, IDENTITY)
  -- Constructor --                      constructor overloads + implementation
  -- Private Helpers --                  private static methods (ensureOut)

  -- Static Factories --                 @category Factory
  -- Static Arithmetic --                @category Arithmetic
  -- Static Computed --                  @category Computed
  -- Static Transforms --               @category Transform
  -- Static Interpolation --            @category Interpolation
  -- Static Comparison --               @category Comparison
  -- [Static Type-Specific] --          type-specific @category

  -- Instance Accessors --               @category Accessor (ALL accessors)
  -- Instance Mutators --                @category Mutator
  -- Instance Arithmetic --              @category Arithmetic
  -- Instance Computed --                @category Computed
  -- Instance Transforms --              @category Transform
  -- Instance Interpolation --           @category Interpolation
  -- Instance Comparison --              @category Comparison
  -- [Instance Type-Specific] --         type-specific @category
  -- Instance Conversion --              @category Conversion
```

**Linter compatibility** (`@typescript-eslint/member-ordering` defaults):

| Rule Constraint                        | Our Order                                                   | Status |
| -------------------------------------- | ----------------------------------------------------------- | ------ |
| Fields before constructor              | Instance Props + Static Constants first                     | OK     |
| Constructor before methods             | Constructor after fields, before all methods                | OK     |
| Static methods before instance methods | Static Factories→...→Comparison before Instance Getters→... | OK     |
| Accessors grouped before methods       | Instance Accessors before Instance Mutators                 | OK     |
| Public before protected before private | Natural (all public except Private Helpers)                 | OK     |

**Section omission:** sections with no members SHALL be omitted entirely (no empty dividers).

**Type-specific sections** appear after the last base section in their group (for example "Static Matrix Operations" after "Static Comparison") and before the next group starts.

### Function Files (Auxiliary / Utils)

Files containing standalone functions follow simpler rules:

```
FILE HEADER (@file, @module, @description)

=== Group Name ===                    <- only if multiple thematic groups
functions/constants...

=== Next Group ===
```

**When to use section dividers:**

- Files with multiple thematic groups (for example `constants.ts` has Tolerance, Angular, Conversion, Mathematical)
- Files with re-export sections (for example `safety.ts` has "Re-exports from deterministic-kernels")
- Utils files organized by type (for example `parse.ts` has sections per core type)

**When to omit section dividers:**

- Files with a single theme (for example `comparison.ts` — all functions are comparisons)
- Files with fewer than 5 exports of the same kind

---

## 5. Transversal Rules

### Text Conventions

| Rule                             | Correct                         | Incorrect                             |
| -------------------------------- | ------------------------------- | ------------------------------------- |
| Present-tense 3rd person         | `Clamps a value between bounds` | `Clamp a value between bounds`        |
| `@param` sentence fragments      | `@param value - Value to clamp` | `@param value - The value to clamp.`  |
| `@returns` sentence fragments    | `@returns Clamped value`        | `@returns Returns the clamped value.` |
| No trailing periods on fragments | `Value to test`                 | `Value to test.`                      |

### Symbol and Formula Conventions (TSDoc blocks)

TSDoc blocks in `.ts` source files are rendered by TypeDoc, which does **not** support LaTeX. Use Unicode or ASCII art.

- **Unicode permitted:** θ, π, φ, ≈, ±, ∞, √ in prose
- **LaTeX prohibited in TSDoc:** do not use `\frac{}{}`, `\sqrt{}`, etc.
- **Formulas:** render as ASCII art inside code blocks:

```
[ cosθ  -sinθ ]
[ sinθ   cosθ ]
```

Note: this applies only to TSDoc blocks. Markdown documentation (`.md` files and Docusaurus pages) supports KaTeX via `$inline$` and `$$block$$` delimiters.

### `@see` Format

Always use: `@see {@link Target} - description`

```typescript
// Correct
@see {@link normalizeSafe} - Returns (0,0) on zero-length vectors

// Incorrect
@see normalizeSafe
@see {@link normalizeSafe}
```

### Triality Cross-Linking Convention

| Variant                       | `@see` Links To  | Notes                                                  |
| ----------------------------- | ---------------- | ------------------------------------------------------ |
| **Strict** (`fn`)             | Safe + Unchecked | Primary entry point; users discover variants from here |
| **Safe** (`fnSafe`)           | Strict only      | No link to Unchecked; no `@throws`                     |
| **Unchecked** (`fnUnchecked`) | Strict + Safe    | No `@example`; bold precondition in `@remarks`         |

**Complete example:**

````typescript
/**
 * Normalizes v to unit length.
 * @param v - Vector to normalize
 * @param out - Optional output vector
 * @returns Unit vector
 * @throws {RangeError} If v has zero length
 *
 * @example
 * ```typescript
 * Vector2.normalize(new Vector2(3, 4));       // (0.6, 0.8)
 * Vector2.normalize(new Vector2(0, 0));       // throws RangeError
 * ```
 *
 * @see {@link normalizeSafe} - Returns (0,0) on zero-length vectors
 * @see {@link normalizeUnchecked} - No validation
 *
 * @category Transform
 * @since 0.6.0
 */
public static normalize(v: ReadonlyVector2Like, out?: Vector2): Vector2 { }

/**
 * Safe normalization. Returns (0,0) if v has zero length.
 * @param v - Vector to normalize
 * @param out - Optional output vector
 * @returns Normalized vector or zero vector
 *
 * @remarks
 * Returns `(0,0)` for zero-length vectors because there is no meaningful
 * unit direction to preserve.
 *
 * @example
 * ```typescript
 * Vector2.normalizeSafe(new Vector2(3, 4));   // (0.6, 0.8)
 * Vector2.normalizeSafe(new Vector2(0, 0));   // (0, 0)
 * ```
 *
 * @see {@link normalize} - Throws on zero-length vectors
 *
 * @category Transform
 * @since 0.6.0
 */
public static normalizeSafe(v: ReadonlyVector2Like, out?: Vector2): Vector2 { }

/**
 * Normalizes a vector without validation (for hot paths).
 * @param v - Vector to normalize (must have non-zero length)
 * @param out - Optional output vector
 * @returns Normalized vector
 *
 * @remarks
 * **Precondition:** v must have non-zero length.
 * If v is zero, the result will be (NaN, NaN).
 *
 * @see {@link normalize} - Throws on zero-length vectors
 * @see {@link normalizeSafe} - Returns (0,0) on zero-length vectors
 *
 * @category Transform
 * @since 0.7.0
 */
public static normalizeUnchecked(v: ReadonlyVector2Like, out?: Vector2): Vector2 { }
````

### Prohibited Tags

| Tag           | Reason                                                               |
| ------------- | -------------------------------------------------------------------- |
| `@group`      | Use visual section dividers instead                                  |
| `@alpha`      | All exports are stable                                               |
| `@beta`       | All exports are stable                                               |
| `@override`   | Not in project's ESLint allowed list                                 |
| `@migration`  | Deprecated; use CHANGELOG instead                                    |
| `@deprecated` | Project removes deprecated symbols outright rather than marking them |
| `@alias`      | Project removes aliased symbols outright                             |
