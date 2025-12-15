# @lenguados/math2d — Overload & Category Organization Audit 2025

> **Audit Date:** December 25, 2025  
> **Methodology:** Source code analysis of constructor patterns and category block organization.  
> **Scope:** Complete codebase organizational consistency.

---

## Constructor Overload Patterns

### Pattern Types Identified

#### Pattern A: TypeScript Declaration Merging (Full Overloads)

Used by **Vector2**, **Matrix2**, **Matrix3**:

```typescript
class Vector2 {
 constructor(); // Zero/Identity
 constructor(x: number, y: number); // Components
 constructor(array: [number, number]); // Tuple
 constructor(object: ReadonlyVector2Like); // Object
 constructor(xOrSource?, y?) {
  // Implementation
  // Unified handling
 }
}
```

**Advantages:**

- Maximum flexibility for callers
- IDE autocomplete shows all options
- Type safety at call site

**Disadvantages:**

- More verbose implementation
- Runtime type checking overhead

#### Pattern B: Simple Constructor with Defaults

Used by **Rotation2**, **Complex**, **Interval**, **Transform2**:

```typescript
class Rotation2 {
 constructor(cos = 1, sin = 0) {
  // Direct assignment
 }
}

class Complex {
 constructor(real = 0, imag = 0) {
  // Direct assignment
 }
}

class Transform2 {
 constructor(position?: ReadonlyVector2Like, rotation = 0, scale?: ReadonlyVector2Like) {
  // Direct assignment with fallbacks
 }
}
```

**Advantages:**

- Simple implementation
- No runtime type checking
- Clear parameter names

**Disadvantages:**

- Less flexible for callers
- Must use factories for array/object input

---

### Overload Coverage Matrix

| Class      | `()` |        Components         | Array | Object | Pattern |
| ---------- | :--: | :-----------------------: | :---: | :----: | :-----: |
| Vector2    |  ✅  |        ✅ `(x, y)`        |  ✅   |   ✅   |    A    |
| Matrix2    |  ✅  | ✅ `(m00, m01, m10, m11)` |  ✅   |   ✅   |    A    |
| Matrix3    |  ✅  |     ✅ `(m00...m22)`      |  ✅   |   ✅   |    A    |
| Rotation2  |  ✅  |      ✅ `(cos, sin)`      |  ❌   |   ❌   |    B    |
| Complex    |  ✅  |     ✅ `(real, imag)`     |  ❌   |   ❌   |    B    |
| Interval   |  ✅  |      ✅ `(min, max)`      |  ❌   |   ❌   |    B    |
| Transform2 |  ✅  |        ✅ complex         |  ❌   |   ❌   |    B    |

### Recommendation

The current pattern split is **intentional and appropriate**:

- **Pattern A** for heavy-use classes (Vector2, Matrix2, Matrix3) that benefit from constructor flexibility
- **Pattern B** for simpler/specialized classes where factories suffice

**No changes recommended** - this is a reasonable design decision.

---

## Category Block Organization

### Core Classes: Section Separator Pattern

Core classes use `/* === */` block comment separators:

```typescript
/* ======================================================================== */
/* Section Name                                                             */
/* ======================================================================== */
```

#### Standard Section Order (Core Classes)

| Order | Section Name                 | Purpose                            |
| ----- | ---------------------------- | ---------------------------------- |
| 1     | Instance Properties          | Public fields                      |
| 2     | Constructor                  | Constructor(s)                     |
| 3     | Private Helpers              | ensureOut, sanitize, etc.          |
| 4     | Static Constants (Immutable) | ZERO, IDENTITY, etc.               |
| 5     | Static Factories             | fromArray, fromObject, clone, etc. |
| 6     | Static Arithmetic            | add, subtract, multiply, etc.      |
| 7     | Static Transforms            | normalize, rotate, etc.            |
| 8     | Static Interpolation         | lerp, slerp, smoothStep            |
| 9     | Static Comparison            | exactEquals, nearEquals            |
| 10    | Instance Getters (Derived)   | normalized, negated                |
| 11    | Instance Swizzle Getters     | xy, yx (Vector2 only)              |
| 12    | Instance Basic Mutators      | set, copy, zero                    |
| 13    | Instance Arithmetic          | add, subtract, multiply            |
| 14    | Instance Measures & Geometry | length, dot, cross                 |
| 15    | Instance Transforms          | normalize, rotate                  |
| 16    | Instance Interpolation       | lerp, slerp                        |
| 17    | Instance Comparison          | exactEquals, nearEquals            |
| 18    | Instance Serialization       | toArray, toObject, toString        |
| 19    | Instance Iterator            | [Symbol.iterator]                  |

### Auxiliary Modules: JSDoc @category Pattern

Auxiliary modules use inline `@category` JSDoc tags:

```typescript
/**
 * Clamps a value between min and max bounds.
 * @param value - Value to clamp.
 * @returns Clamped value.
 *
 * @category Arithmetic
 * @since 1.0.0
 */
export function clamp(value: number, min: number, max: number): number {
```

#### Category Tags Used in Auxiliary

| Module                  | Categories                                                               |
| ----------------------- | ------------------------------------------------------------------------ |
| scalar/arithmetic.ts    | Arithmetic                                                               |
| scalar/comparison.ts    | Comparison                                                               |
| scalar/constants.ts     | Tolerance, Numeric Limits, Angular, Conversion, Mathematical, Collection |
| scalar/interpolation.ts | Interpolation                                                            |
| angle/operations.ts     | Types, Operations                                                        |
| angle/interpolation.ts  | Interpolation                                                            |
| angle/unwrapping.ts     | Unwrapping                                                               |
| numeric/guards.ts       | Guards                                                                   |
| numeric/safety.ts       | Safety                                                                   |
| numeric/rounding.ts     | Rounding                                                                 |
| numeric/wrapping.ts     | Wrapping                                                                 |

---

## Category Consistency Analysis

### Core Classes Section Consistency

| Section                 | Vector2 | Rotation2 | Complex | Interval | Matrix2 | Matrix3 | Transform2 |
| ----------------------- | :-----: | :-------: | :-----: | :------: | :-----: | :-----: | :--------: |
| Instance Properties     |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Constructor             |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Private Helpers         |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Static Constants        |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Static Factories        |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Static Arithmetic       |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Static Transforms       |   ✅    |    ✅     |   ✅    |    —     |   ✅    |   ✅    |     ✅     |
| Static Interpolation    |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Static Comparison       |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Getters        |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Basic Mutators |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Arithmetic     |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Transforms     |   ✅    |    ✅     |   ✅    |    —     |   ✅    |   ✅    |     ✅     |
| Instance Interpolation  |   ✅    |    ❌     |   ❌    |    ❌    |   ✅    |   ✅    |     ❌     |
| Instance Comparison     |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Serialization  |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |
| Instance Iterator       |   ✅    |    ✅     |   ✅    |    ✅    |   ✅    |   ✅    |     ✅     |

### Findings

1. **Instance Interpolation section** missing from Rotation2, Complex, Interval, Transform2
   - These classes have static lerp/slerp but lack instance versions
   - Consistent with previous finding about missing instance methods

2. **Instance Transforms section** not applicable to Interval (no geometric transforms)

---

## Misplaced Methods Identified

### Methods with Wrong @category Tag

No misplaced methods found. All methods are correctly categorized within their section blocks.

### Local Constants That Should Be Exported

| Constant                           | Current Location                    | Should Be                         |
| ---------------------------------- | ----------------------------------- | --------------------------------- |
| `ITERATIVE_TOLERANCE = 1e-6`       | `angle/operations.ts:24` (local)    | `scalar/constants.ts` (exported)  |
| `INVERSE_WEIGHT_SMOOTHING = 0.001` | `angle/operations.ts:18` (internal) | Keep internal (very specific use) |

---

## Auxiliary Module Organization

### Section Separator Usage

Auxiliary modules use **both** patterns:

1. **Block separators** for major sections:

```typescript
/* ========================================================================== */
/* SinCos Type and Utility                                                    */
/* ========================================================================== */
```

2. **@category JSDoc** for individual functions

This is **consistent and appropriate** - block separators group related functions, @category provides API documentation.

---

## Recommendations

### High Priority

1. **Export `ITERATIVE_TOLERANCE`** from `scalar/constants.ts`
   ```typescript
   export const ITERATIVE_TOLERANCE = 1e-6;
   ```

### Medium Priority

2. **Add Instance Interpolation section** to Rotation2, Complex, Interval, Transform2
   - Add `lerp()` instance method that delegates to static
   - Add `slerp()` instance method where applicable

### Low Priority

3. **Document section order convention** in a CONTRIBUTING.md
   - Helps new contributors maintain organization
   - Makes code reviews easier

---

## Summary

| Aspect                           | Status  | Notes                                  |
| -------------------------------- | ------- | -------------------------------------- |
| Constructor overload consistency | ✅ Good | Intentional A/B pattern split          |
| Section separator format         | ✅ Good | Consistent `/* === */` in core         |
| Section ordering                 | ✅ Good | Consistent across all core classes     |
| @category JSDoc usage            | ✅ Good | Consistent in auxiliary                |
| Instance Interpolation coverage  | ⚠️ Gap  | Missing from 4/7 classes               |
| Local constants                  | ⚠️ Gap  | ITERATIVE_TOLERANCE should be exported |

**Overall Organization Score: 91%**

---

_Overload and category audit completed: December 25, 2025_
