# @lenguados/math2d — Cross-Module Consistency Audit 2025

> **Audit Date:** December 25, 2025  
> **Methodology:** Pattern-matching grep searches across all core modules, verified against source.  
> **Scope:** Consistency of tolerances, naming conventions, static/instance symmetry, triality patterns, constructor patterns, and mathematical correctness.

---

## Executive Summary

This audit examines **cross-cutting concerns** to identify inconsistencies between modules. The codebase is **highly consistent overall**, but has **specific gaps** that should be addressed for full standardization.

---

## 🔴 Critical Findings

### 1. Tolerance Constants Fragmentation

| Constant              | Value   | Location                 | Status                       |
| --------------------- | ------- | ------------------------ | ---------------------------- |
| `EPSILON`             | `1e-10` | `scalar/constants.ts`    | ✅ Exported, used everywhere |
| `ANGLE_EPSILON`       | `1e-12` | `scalar/constants.ts`    | ✅ Exported                  |
| `ITERATIVE_TOLERANCE` | `1e-6`  | `angle/operations.ts:24` | 🔴 **LOCAL CONSTANT**        |

**Issue:** `ITERATIVE_TOLERANCE` is defined locally instead of being exported from `scalar/constants.ts`.

**Impact:** If someone needs to customize iterative tolerance for angle bisection, they cannot.

**Recommendation:** Move to `constants.ts` and export.

---

### 2. Static/Instance Method Asymmetry

#### `clone()` Method

| Class      | Static `clone()` | Instance `clone()` |
| ---------- | ---------------- | ------------------ |
| Vector2    | ✅               | ✅                 |
| Matrix2    | ✅               | ✅                 |
| Matrix3    | ✅               | ✅                 |
| Rotation2  | ✅               | ❌ **MISSING**     |
| Complex    | ✅               | ❌ **MISSING**     |
| Interval   | ✅               | ❌ **MISSING**     |
| Transform2 | ✅               | ❌ **MISSING**     |

#### `copy()` Method

| Class      | Static `copy()` | Instance `copy()` |
| ---------- | --------------- | ----------------- |
| Vector2    | ✅              | ✅                |
| Matrix2    | ✅              | ✅                |
| Matrix3    | ✅              | ✅                |
| Rotation2  | ✅              | ❌ **MISSING**    |
| Complex    | ✅              | ❌ **MISSING**    |
| Interval   | ✅              | ❌ **MISSING**    |
| Transform2 | ✅              | ❌ **MISSING**    |

**Pattern:** Only the "heavy" classes (Vector2, Matrix2, Matrix3) have full static+instance coverage.

---

### 3. Serialization Method Gaps

#### `toArray()` / `toObject()` Methods

| Class      | `toArray()`    | `toObject()`   |
| ---------- | -------------- | -------------- |
| Vector2    | ✅             | ✅             |
| Matrix2    | ✅             | ✅             |
| Matrix3    | ✅             | ✅             |
| Rotation2  | ❌ **MISSING** | ❌ **MISSING** |
| Complex    | ❌ **MISSING** | ❌ **MISSING** |
| Interval   | ❌ **MISSING** | ❌ **MISSING** |
| Transform2 | ❌ **MISSING** | ❌ **MISSING** |

**Note:** These classes likely have equivalent functionality via different names or through `fromArray`/`fromObject` factories, but the naming is inconsistent.

---

### 4. Constructor Overload Inconsistency

| Class      | Constructor Pattern                                   |
| ---------- | ----------------------------------------------------- |
| Vector2    | ✅ Overloaded: `()`, `(x, y)`, `([x, y])`, `({x, y})` |
| Matrix2    | ✅ Overloaded: `()`, `(values...)`, `({...})`         |
| Matrix3    | ✅ Overloaded: `()`, `(values...)`, `({...})`         |
| Rotation2  | Simple: `(cos = 1, sin = 0)`                          |
| Complex    | Simple: `(real = 0, imag = 0)`                        |
| Interval   | Simple: `(min = 0, max = 0)`                          |
| Transform2 | Simple: `(position?, rotation = 0, scale?)`           |

**Pattern:** Core math classes have full overloads, auxiliary/simple classes use simple constructors.

**Assessment:** This is **intentional and acceptable** - Rotation2/Complex/Interval are simple 2-component types where overloads add little value.

---

## 🟡 Moderate Findings

### 5. Triality Pattern Coverage

#### Divide/Inverse Operations

| Class            | `divide` | `divideSafe` | `divideUnchecked`            |
| ---------------- | -------- | ------------ | ---------------------------- |
| Vector2          | ✅       | ✅           | ✅                           |
| Complex          | ✅       | ✅           | ✅                           |
| Matrix2 (scalar) | ✅       | ✅           | ✅                           |
| Matrix3 (scalar) | ✅       | ✅           | ✅                           |
| Interval         | ✅       | ✅           | ❌ Missing `divideUnchecked` |

| Class      | `inverse` | `inverseSafe` | `inverseUnchecked`            |
| ---------- | --------- | ------------- | ----------------------------- |
| Matrix2    | ✅        | ✅            | ✅                            |
| Matrix3    | ✅        | ✅            | ✅                            |
| Transform2 | ✅        | ✅            | ✅                            |
| Vector2    | ✅        | ✅            | ❌ Missing `inverseUnchecked` |
| Rotation2  | ✅        | —             | —                             |

**Note on Rotation2:** Inversion is trivial (negate sin), so no safety variants needed. This is **correct**.

#### Normalize Operations

| Class                | `normalize` | `normalizeSafe` | `normalizeUnchecked` |
| -------------------- | ----------- | --------------- | -------------------- |
| Vector2 (static)     | ✅          | ✅              | ❌ Missing           |
| Vector2 (instance)   | ✅          | ✅              | ✅                   |
| Rotation2 (static)   | ✅          | ✅              | ✅                   |
| Rotation2 (instance) | ✅          | ✅              | ✅                   |
| Complex (static)     | ✅          | ✅              | ❌ Missing           |
| Complex (instance)   | ✅          | ✅              | ❌ Missing           |

#### Reciprocal Operations

| Class    | `reciprocal` | `reciprocalSafe` | `reciprocalUnchecked` |
| -------- | ------------ | ---------------- | --------------------- |
| Complex  | ✅           | ✅               | ✅                    |
| Interval | ✅           | ✅               | ❌ Missing            |

---

### 6. Epsilon Parameter Convention

All classes use **consistent default**: `epsilon: number = EPSILON`

| Pattern                     | Count | Classes                       |
| --------------------------- | ----- | ----------------------------- |
| `epsilon = EPSILON`         | 100%  | All core classes              |
| `epsilon: number = EPSILON` | 100%  | All explicit type annotations |

✅ **FULLY CONSISTENT**

---

## 🟢 Positive Findings (Confirmed Consistency)

### 7. DeterministicMath Usage

All trigonometric operations use `DeterministicMath` correctly:

| Operation                   | Classes Using It                                          |
| --------------------------- | --------------------------------------------------------- |
| `DeterministicMath.atan2()` | Vector2, Rotation2, Complex, Matrix2, Matrix3, Transform2 |
| `DeterministicMath.sin()`   | Vector2 (slerp)                                           |
| `DeterministicMath.sqrt()`  | Vector2 (normalizeUnchecked)                              |
| `DeterministicMath.pow()`   | Complex (pow)                                             |

✅ **No Math.sqrt, Math.sin, Math.cos, Math.atan2 found in core modules.**

### 8. Factory Methods

All classes have consistent factory pattern:

| Factory                           | Coverage           |
| --------------------------------- | ------------------ |
| `fromArray(array, offset?, out?)` | 100% (7/7 classes) |
| `fromObject(object, out?)`        | 100% (7/7 classes) |
| `clone(source, out?)`             | 100% (7/7 classes) |
| `copy(source, destination)`       | 100% (7/7 classes) |

✅ **FULLY CONSISTENT**

### 9. ensureOut Pattern

All static methods that can output to an existing instance use:

```typescript
private static ensureOut(out?: ClassName): ClassName {
  return out ?? new ClassName();
}
```

✅ **FULLY CONSISTENT** across all 7 core classes.

### 10. freeze\* Helper Pattern

All classes export a freeze helper:

```typescript
export function freezeClassName(instance): ReadonlyClassName;
```

✅ **FULLY CONSISTENT** (freezeVector2, freezeMatrix2, freezeMatrix3, freezeRotation2, freezeComplex, freezeInterval, freezeTransform2)

### 11. exactEquals/nearEquals Pattern

All classes implement both:

| Method                          | Static | Instance |
| ------------------------------- | ------ | -------- |
| `exactEquals`                   | ✅ All | ✅ All   |
| `nearEquals(epsilon = EPSILON)` | ✅ All | ✅ All   |

✅ **FULLY CONSISTENT**

### 12. lerp/lerpClamped Pattern

| Class      | `lerp` | `lerpClamped` | `lerpUnclamped` |
| ---------- | ------ | ------------- | --------------- |
| Vector2    | ✅     | ✅            | ✅              |
| Matrix2    | ✅     | ✅            | ✅              |
| Matrix3    | ✅     | ✅            | ✅              |
| Complex    | ✅     | ✅            | —               |
| Rotation2  | ✅     | ✅            | —               |
| Interval   | ✅     | ✅            | —               |
| Transform2 | ✅     | ✅            | —               |

**Note:** `lerpUnclamped` only in Vector2/Matrix2/Matrix3 (makes sense for component-wise lerp).

---

## Recommendations Priority Matrix

| Priority  | Issue                                                                 | Effort | Impact                  |
| --------- | --------------------------------------------------------------------- | ------ | ----------------------- |
| 🔴 High   | Export `ITERATIVE_TOLERANCE` from constants                           | Low    | High (API completeness) |
| 🔴 High   | Add instance `clone()` to Rotation2/Complex/Interval/Transform2       | Medium | High (API symmetry)     |
| 🟡 Medium | Add instance `copy()` to Rotation2/Complex/Interval/Transform2        | Medium | Medium                  |
| 🟡 Medium | Add `toArray()`/`toObject()` to Rotation2/Complex/Interval/Transform2 | Medium | Medium (serialization)  |
| 🟡 Medium | Add `divideUnchecked` to Interval                                     | Low    | Low                     |
| 🟡 Medium | Add static `normalizeUnchecked` to Vector2                            | Low    | Low                     |
| 🟢 Low    | Add `reciprocalUnchecked` to Interval                                 | Low    | Low                     |
| 🟢 Low    | Add `inverseUnchecked` to Vector2                                     | Low    | Low                     |

---

## Summary Statistics

| Category                               | Consistency Score |
| -------------------------------------- | ----------------- |
| Tolerance usage (EPSILON default)      | ✅ 100%           |
| DeterministicMath encapsulation        | ✅ 100%           |
| Factory methods (fromArray/fromObject) | ✅ 100%           |
| ensureOut pattern                      | ✅ 100%           |
| freeze\* helpers                       | ✅ 100%           |
| exactEquals/nearEquals                 | ✅ 100%           |
| Static clone/copy                      | ✅ 100%           |
| Instance clone/copy                    | ⚠️ 43% (3/7)      |
| Triality completeness                  | ⚠️ 85%            |
| Serialization (toArray/toObject)       | ⚠️ 43% (3/7)      |

**Overall Consistency: 87%** (very high for a codebase of this size)

---

_Cross-module audit completed: December 25, 2025_
