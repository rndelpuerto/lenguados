# 📘 TSDoc/JSDoc Documentation Standard

> **Package:** `@lenguados/math2d`  
> **Version:** 2.0  
> **Last Updated:** December 2024  
> **Status:** ACTIVE

This document defines the complete documentation specification for the `@lenguados/math2d` package. It is designed to be applied consistently across all modules.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tooling & Configuration](#2-tooling--configuration)
3. [General Style & Tone](#3-general-style--tone)
4. [Required Tags by Declaration Type](#4-required-tags-by-declaration-type)
5. [Categories System](#5-categories-system)
6. [Mathematical Documentation](#6-mathematical-documentation)
7. [Examples & Code Blocks](#7-examples--code-blocks)
8. [Templates](#8-templates)
9. [Static vs Instance Methods](#9-static-vs-instance-methods)
10. [Cross-References & Linking](#10-cross-references--linking)
11. [Quality Gates](#11-quality-gates)
12. [Industry References](#12-industry-references)

---

## 1. Overview

### 1.1 Core Principles

| Principle           | Description                                               |
| ------------------- | --------------------------------------------------------- |
| **Precision**       | Mathematical definitions MUST be accurate and unambiguous |
| **Consistency**     | Same patterns applied across all modules                  |
| **Completeness**    | All public APIs documented with full context              |
| **Usability**       | Examples and cross-references for discoverability         |
| **Maintainability** | Easy to update when code changes                          |

### 1.2 Documentation Layers

```
┌─────────────────────────────────────────────────────┐
│ Package Level (@packageDocumentation)               │
│   └─ Module Level (file header comments)            │
│       └─ Class/Interface Level                      │
│           └─ Method Level (static & instance)       │
│               └─ Parameter Level                    │
└─────────────────────────────────────────────────────┘
```

---

## 2. Tooling & Configuration

### 2.1 Required Tools

```bash
# Core
npm install --save-dev typedoc typescript

# Linting
npm install --save-dev eslint-plugin-tsdoc @microsoft/tsdoc
```

### 2.2 TSDoc Configuration (`tsdoc.json`)

```json
{
 "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
 "noStandardTags": false,
 "tagDefinitions": [
  { "tagName": "@unit", "syntaxKind": "block" },
  { "tagName": "@range", "syntaxKind": "block" },
  { "tagName": "@complexity", "syntaxKind": "block" },
  { "tagName": "@determinism", "syntaxKind": "block" }
 ],
 "supportForTags": {
  "@unit": true,
  "@range": true,
  "@complexity": true,
  "@determinism": true
 }
}
```

### 2.3 TypeDoc Configuration (`typedoc.json`)

```json
{
 "entryPoints": ["src/index.ts"],
 "out": "docs/api",
 "tsconfig": "tsconfig.json",
 "excludePrivate": true,
 "excludeInternal": true,
 "includeVersion": true,
 "categorizeByGroup": true,
 "categoryOrder": [
  "Factory",
  "Arithmetic",
  "Transform",
  "Transform Integration",
  "Comparison",
  "Interpolation",
  "Geometry",
  "Utility",
  "Conversion",
  "Serialization",
  "*"
 ]
}
```

### 2.4 ESLint Configuration

```javascript
// eslint.config.js
{
  plugins: ['eslint-plugin-tsdoc'],
  rules: {
    'tsdoc/syntax': 'warn'
  }
}
```

---

## 3. General Style & Tone

### 3.1 Language Rules

| Rule              | Example                                            |
| ----------------- | -------------------------------------------------- |
| **English only**  | All documentation in English                       |
| **Formal tone**   | Scientific, precise, unambiguous                   |
| **Present tense** | "Returns the sum" not "Will return"                |
| **Active voice**  | "Calculates distance" not "Distance is calculated" |
| **Third person**  | "The vector" not "Your vector"                     |

### 3.2 Summary Line Format

The first line MUST be a complete sentence that:

- Starts with a verb (for methods) or noun (for classes/properties)
- Ends with a period
- Is self-contained (understandable without reading further)
- Is 80 characters or less

```typescript
// ✅ Good
/**
 * Calculates the Euclidean distance between two points.
 */

// ❌ Bad
/**
 * Distance calculation
 */

// ❌ Bad
/**
 * This method is used for calculating the distance between two points in 2D space
 */
```

### 3.3 Formatting Guidelines

| Element              | Format                                     |
| -------------------- | ------------------------------------------ |
| Code references      | `backticks`                                |
| Mathematical symbols | Unicode: `π`, `θ`, `∈`, `≈`                |
| Parameter names      | `paramName` in backticks                   |
| Method names         | `{@link methodName}`                       |
| Ranges               | Interval notation: `∈ [0, 1]`, `∈ (−π, π]` |

---

## 4. Required Tags by Declaration Type

### 4.1 Classes

````typescript
/**
 * [Summary line ending with period.]
 *
 * @remarks
 * [Extended description if needed.]
 * [Design decisions, invariants, or relationships.]
 *
 * @example
 * ```typescript
 * const v = new Vector2(3, 4);
 * console.log(v.length()); // 5
 * ```
 *
 * @category [Category]
 * @since [Version]
 */
````

**Required Tags:**

- Summary line ✅
- `@category` ✅
- `@since` ✅

**Recommended Tags:**

- `@remarks` (for complex classes)
- `@example` (at least one)
- `@see` (for related classes)

### 4.2 Static Methods

````typescript
/**
 * [Summary line with action verb.]
 *
 * @param paramName - [Description with units/range if applicable.]
 * @param out - Optional output object to avoid allocation.
 * @returns [Description of return value.]
 *
 * @remarks
 * [Algorithm details, complexity, or edge cases.]
 *
 * @example
 * ```typescript
 * const result = Vector2.add(a, b);
 * ```
 *
 * @category [Category]
 * @since [Version]
 */
````

**Required Tags:**

- Summary line ✅
- `@param` for each parameter ✅
- `@returns` ✅
- `@category` ✅
- `@since` ✅

**Recommended Tags:**

- `@remarks` (for non-trivial algorithms)
- `@example`
- `@throws` (if applicable)
- `@see` (for related methods)

### 4.3 Instance Methods

```typescript
/**
 * [Summary line - often starts with verb describing mutation.]
 *
 * @param paramName - [Description.]
 * @returns This instance for method chaining.
 *
 * @remarks
 * Mutates this instance in place.
 *
 * @category [Category]
 * @since [Version]
 */
```

**Required Tags:**

- Summary line ✅
- `@param` for each parameter ✅
- `@returns` (note chainability) ✅
- `@category` ✅
- `@since` ✅

### 4.4 Properties

```typescript
/**
 * [Description of property.]
 *
 * @defaultValue [Default value if applicable]
 *
 * @category [Category]
 * @since [Version]
 */
```

### 4.5 Constants

```typescript
/**
 * [Description with mathematical meaning.]
 *
 * @remarks
 * [Precision, derivation, or use cases.]
 *
 * @constant {number}
 * @category [Category]
 * @since [Version]
 */
export const PI = Math.PI;
```

### 4.6 Type Aliases & Interfaces

```typescript
/**
 * [Description of what the type represents.]
 *
 * @remarks
 * [Usage patterns or constraints.]
 *
 * @category Types
 * @since [Version]
 */
export interface Vector2Like {
 /** X component. */
 x: number;
 /** Y component. */
 y: number;
}
```

---

## 5. Categories System

### 5.1 Standard Categories

Categories MUST be assigned using the `@category` tag. Use these standardized categories:

| Category                  | Description               | Example Methods                                       |
| ------------------------- | ------------------------- | ----------------------------------------------------- |
| **Factory**               | Object creation           | `fromValues`, `fromAngle`, `clone`, `create`          |
| **Arithmetic**            | Basic math operations     | `add`, `subtract`, `multiply`, `divide`, `negate`     |
| **Transform**             | Transformation operations | `rotate`, `scale`, `translate`, `invert`              |
| **Transform Integration** | Cross-module transforms   | `applyRotation2`, `applyMatrix3`, `applyTransform2`   |
| **Comparison**            | Equality & ordering       | `equals`, `nearEquals`, `isZero`, `compareTo`         |
| **Interpolation**         | Blending operations       | `lerp`, `slerp`, `smoothStep`, `lerpClamped`          |
| **Geometry**              | Geometric calculations    | `dot`, `cross`, `project`, `reflect`, `perpendicular` |
| **Utility**               | Helper operations         | `copy`, `set`, `swap`, `toString`, `toArray`          |
| **Conversion**            | Type conversions          | `toVector2`, `toMatrix3`, `toDegrees`, `toRadians`    |
| **Serialization**         | Data persistence          | `serialize`, `deserialize`, `toJSON`, `fromJSON`      |
| **Tolerance**             | Precision constants       | `EPSILON`, `EPSILON_SQUARED`                          |
| **Angular**               | Angle constants           | `PI`, `TAU`, `HALF_PI`                                |
| **Mathematical**          | Math constants            | `SQRT_2`, `GOLDEN_RATIO`, `E`                         |
| **Types**                 | Type definitions          | Interfaces, type aliases                              |
| **Collection**            | Grouped constants         | `Constants` object                                    |

### 5.2 Category Assignment Rules

1. **One category per symbol** - Choose the most specific category
2. **Consistency across modules** - Same operation = same category
3. **Factory methods** - Always `Factory`, even if they also transform
4. **Static vs Instance** - Same category for symmetric methods

```typescript
// ✅ Correct - Both use same category
/**
 * Adds two vectors.
 * @category Arithmetic
 */
public static add(a, b, out?): Vector2

/**
 * Adds a vector to this instance.
 * @category Arithmetic
 */
public add(v): this
```

---

## 6. Mathematical Documentation

### 6.1 Units

When a parameter or return value has physical meaning, document units:

```typescript
/**
 * Rotates this vector by the specified angle.
 *
 * @param angle - Rotation angle in radians ∈ (−π, π].
 * @returns Rotated vector.
 */
```

Common units in math2d:

- **Angles**: radians (default), degrees (when explicitly stated)
- **Distances**: unitless (user-defined coordinate system)
- **Scale factors**: dimensionless ratios

### 6.2 Ranges & Domains

Document valid input ranges using interval notation:

| Notation    | Meaning                             |
| ----------- | ----------------------------------- |
| `∈ [0, 1]`  | Closed interval, includes endpoints |
| `∈ (0, 1)`  | Open interval, excludes endpoints   |
| `∈ [0, 1)`  | Half-open interval                  |
| `∈ (−π, π]` | Angular wrap range                  |
| `∈ ℝ`       | Any real number                     |
| `∈ ℝ⁺`      | Positive real numbers               |
| `> 0`       | Strictly positive                   |
| `≥ 0`       | Non-negative                        |

```typescript
/**
 * Interpolates between two values.
 *
 * @param t - Interpolation factor ∈ [0, 1]. Values outside are not clamped.
 */
```

### 6.3 Mathematical Formulas

For non-trivial calculations, include the formula in `@remarks`:

````typescript
/**
 * Calculates the cross product of two 2D vectors.
 *
 * @remarks
 * Computes the z-component of the 3D cross product:
 * ```
 * result = a.x * b.y - a.y * b.x
 * ```
 * The result is positive if b is counter-clockwise from a.
 */
````

### 6.4 Coordinate System

Document when coordinate system matters:

```typescript
/**
 * @remarks
 * Assumes standard 2D coordinates: X-axis right, Y-axis up.
 * Positive angles rotate counter-clockwise.
 */
```

### 6.5 Floating-Point Considerations

Add determinism notes when relevant:

```typescript
/**
 * @remarks
 * Results may vary slightly across JavaScript engines due to
 * floating-point implementation differences. Use `nearEquals`
 * for comparisons with appropriate tolerance.
 */
```

---

## 7. Examples & Code Blocks

### 7.1 Example Requirements

Every public method SHOULD have at least one example. Examples MUST:

1. Be syntactically valid TypeScript
2. Be self-contained (no external dependencies)
3. Show the most common use case
4. Include expected output as comments

````typescript
/**
 * @example
 * ```typescript
 * const a = new Vector2(3, 0);
 * const b = new Vector2(0, 4);
 * const distance = Vector2.distance(a, b);
 * console.log(distance); // 5
 * ```
 */
````

### 7.2 Multiple Examples

For complex methods, provide multiple examples:

````typescript
/**
 * @example Basic usage
 * ```typescript
 * const result = Vector2.lerp(a, b, 0.5);
 * ```
 *
 * @example With output parameter (zero allocation)
 * ```typescript
 * const out = new Vector2();
 * Vector2.lerp(a, b, 0.5, out);
 * ```
 *
 * @example Extrapolation (t > 1)
 * ```typescript
 * const extended = Vector2.lerp(a, b, 2); // Beyond b
 * ```
 */
````

### 7.3 Code Block Language

Always specify the language:

````typescript
/**
 * @example
 * ```typescript
 * // TypeScript code here
 * ```
 */
````

---

## 8. Templates

### 8.1 Vector/Point Operations

````typescript
/**
 * [Action verb] [object] [preposition] [object].
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @param out - Optional output vector to avoid allocation.
 * @returns New vector with the result, or `out` if provided.
 *
 * @remarks
 * [Formula or algorithm description if non-obvious.]
 *
 * @example
 * ```typescript
 * const result = Vector2.[method](a, b);
 * ```
 *
 * @category Arithmetic
 * @since 0.1.0
 */
public static [method](
  a: ReadonlyVector2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  // Implementation
}
````

### 8.2 Transformation Methods

````typescript
/**
 * [Transforms/Rotates/Scales] [object] by [transformation].
 *
 * @param target - [Object] to transform.
 * @param transformation - Transformation to apply.
 * @param out - Optional output to avoid allocation.
 * @returns Transformed [object].
 *
 * @remarks
 * Transform order: [describe order if composite].
 * [Describe if in-place or creates new object].
 *
 * @example
 * ```typescript
 * const rotated = Vector2.rotate(v, Math.PI / 4);
 * ```
 *
 * @category Transform
 * @since 0.1.0
 */
````

### 8.3 Comparison Methods

```typescript
/**
 * [Compares/Tests] [condition].
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 * @param tolerance - Optional tolerance for floating-point comparison.
 * @returns `true` if [condition], `false` otherwise.
 *
 * @remarks
 * Uses absolute tolerance comparison: `|a - b| < tolerance`.
 *
 * @category Comparison
 * @since 0.1.0
 */
```

### 8.4 Factory Methods

````typescript
/**
 * Creates a [type] from [source].
 *
 * @param source - [Description of source].
 * @param out - Optional output to reuse existing instance.
 * @returns New [type] instance, or `out` if provided.
 *
 * @example
 * ```typescript
 * const v = Vector2.fromAngle(Math.PI / 4);
 * ```
 *
 * @category Factory
 * @since 0.1.0
 */
````

### 8.5 Instance Mutator Methods

```typescript
/**
 * [Mutates this instance by action].
 *
 * @param param - [Description].
 * @returns This instance for method chaining.
 *
 * @remarks
 * Mutates in place. For immutable operation, use static `[Method].method()`.
 *
 * @category Arithmetic
 * @since 0.1.0
 */
public [method](param: Type): this {
  // Implementation
  return this;
}
```

---

## 9. Static vs Instance Methods

### 9.1 Symmetry Requirements

When a method exists in both static and instance form, documentation MUST:

1. Use the same `@category`
2. Use consistent parameter descriptions
3. Note the difference in mutation behavior

```typescript
// Static - creates new or uses out
/**
 * Normalizes a vector to unit length.
 *
 * @param v - Vector to normalize.
 * @param out - Optional output vector.
 * @returns Normalized vector with length 1.
 *
 * @category Geometry
 * @since 0.1.0
 */
public static normalize(v: ReadonlyVector2Like, out?: Vector2): Vector2

// Instance - mutates this
/**
 * Normalizes this vector to unit length in place.
 *
 * @returns This instance for chaining.
 *
 * @remarks
 * Mutates this instance. Use `Vector2.normalize(v)` for immutable operation.
 *
 * @category Geometry
 * @since 0.1.0
 */
public normalize(): this
```

### 9.2 Cross-Module Methods

For methods that bridge modules (e.g., `Vector2.applyRotation2`):

```typescript
/**
 * Applies a rotation to this vector.
 *
 * @param rotation - Rotation to apply (cos/sin components).
 * @returns This instance for chaining.
 *
 * @remarks
 * Equivalent to `Rotation2.apply(rotation, this)`.
 * See also: {@link Rotation2.apply}
 *
 * @category Transform Integration
 * @since 0.9.0
 */
public applyRotation2(rotation: ReadonlyRotation2Like): this
```

---

## 10. Cross-References & Linking

### 10.1 Internal Links

Use `{@link Symbol}` for cross-references:

```typescript
/**
 * @see {@link Vector2.normalize} - For normalization
 * @see {@link Matrix2.transformVector} - Related transformation
 */
```

### 10.2 Related Methods

Group related methods with `@see`:

```typescript
/**
 * @see {@link lerp} - Linear interpolation without clamping
 * @see {@link smoothStep} - Smooth interpolation with easing
 */
```

### 10.3 External References

For algorithm references, use plain text in `@remarks`:

```typescript
/**
 * @remarks
 * Implements the Hermite interpolation formula.
 * See: https://en.wikipedia.org/wiki/Hermite_interpolation
 */
```

---

## 11. Quality Gates

### 11.1 PR Checklist

Before merging, verify:

- [ ] Summary line present and follows format
- [ ] All `@param` tags document parameters
- [ ] `@returns` describes return value
- [ ] `@category` assigned from standard list
- [ ] `@since` version specified
- [ ] `@example` included for public methods
- [ ] Chainability noted for mutating methods
- [ ] Units/ranges documented where applicable
- [ ] Cross-references added for related methods
- [ ] TypeDoc generates without warnings

### 11.2 Automated Checks

```bash
# Lint TSDoc syntax
npm run lint

# Generate docs and check for warnings
npx typedoc 2>&1 | grep -i "warning"

# Verify all exports are documented
npx typedoc --validation.notDocumented
```

### 11.3 Coverage Goals

| Metric                      | Target |
| --------------------------- | ------ |
| Public methods with JSDoc   | 100%   |
| Methods with `@example`     | 90%+   |
| Methods with `@category`    | 100%   |
| Cross-references per module | 5+     |

---

## 12. Industry References

### 12.1 Libraries Analyzed

| Library       | Patterns Adopted                              |
| ------------- | --------------------------------------------- |
| **gl-matrix** | `out` parameter pattern, pure functions       |
| **Three.js**  | `@param`/`@returns` style, method chaining    |
| **Box2D**     | Assertion patterns, determinism notes         |
| **math.js**   | Category organization, comprehensive examples |

### 12.2 Standards Consulted

- [TSDoc Specification](https://tsdoc.org/)
- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [Microsoft TSDoc Guidelines](https://api-extractor.com/pages/tsdoc/doc_comment_syntax/)

### 12.3 Naming Conventions

Aligned with our `NAMING_CONVENTIONS.md`:

| Pattern                 | Example                                              |
| ----------------------- | ---------------------------------------------------- |
| `from[Source]`          | `fromAngle`, `fromVector2`, `fromTransform2`         |
| `to[Target]`            | `toVector2`, `toMatrix3`, `toRadians`                |
| `apply[Transformation]` | `applyRotation2`, `applyMatrix3`                     |
| `[verb]CS`              | `rotateCS`, `transformPointCS` (precomputed cos/sin) |
| `[verb]Unchecked`       | `divideScalarUnchecked` (no validation)              |
| `[verb]Safe`            | `divideScalarSafe` (returns zero on error)           |
| `[verb]Clamped`         | `lerpClamped` (clamps input range)                   |

---

## Appendix A: Version History

| Version | Date     | Changes                                 |
| ------- | -------- | --------------------------------------- |
| 2.0     | Dec 2024 | Complete rewrite with industry research |
| 1.0     | Nov 2024 | Initial draft                           |

---

## Appendix B: Quick Reference

### Essential Tags

````typescript
/**
 * Summary line.
 *
 * @param name - Description.
 * @returns Description.
 *
 * @example
 * ```typescript
 * // code
 * ```
 *
 * @category Category
 * @since 0.1.0
 */
````

### Common Phrases

| Context          | Phrase                                             |
| ---------------- | -------------------------------------------------- |
| Factory static   | "Creates a new X from Y."                          |
| Factory with out | "Creates a new X, or writes to `out` if provided." |
| Mutator instance | "Modifies this X in place."                        |
| Return chainable | "Returns this instance for method chaining."       |
| Pure static      | "Returns a new X without modifying inputs."        |
| Tolerance        | "Uses `EPSILON` for floating-point comparison."    |
| Hot path         | "Optimized for hot paths with precomputed values." |

---

_End of TSDoc/JSDoc Documentation Standard_
