# @lenguados/math2d — Fresh Code Audit 2025

> **Audit Date:** December 25, 2025  
> **Methodology:** Line-by-line source code analysis, ignoring all prior documentation.  
> **Scope:** All source files in `src/` directory.

---

## Executive Summary

The `@lenguados/math2d` package is a **high-quality, deterministic 2D math library** designed for physics simulations and game engines. Key characteristics:

- **~55,000+ lines** of TypeScript across 29 files
- **Consistent architectural patterns** (Triality, ensureOut, freeze*, *Like interfaces)
- **Deterministic math** via 65536-entry lookup tables and Fast Inverse Square Root
- **Zero-allocation hot paths** through `out` parameters
- **Column-major matrices** (WebGL-compatible)
- **CCW-positive angular convention**

---

## Complete Module Structure

### Auxiliary Layer (`src/auxiliary/`)

| Module                    | Lines | Purpose                                                          |
| ------------------------- | ----- | ---------------------------------------------------------------- |
| `angle/conversion.ts`     | 132   | Degrees ↔ radians ↔ turns ↔ gradians                             |
| `angle/normalization.ts`  | 139   | Normalize angles to ranges like [-π,π)                           |
| `angle/operations.ts`     | 484   | sinCos, angleDifference, isAngleBetween                          |
| `angle/interpolation.ts`  | 126   | lerpAngle, slerpAngle, smoothStepAngle, springAngle              |
| `angle/unwrapping.ts`     | 203   | unwrapAngles, AngleUnwrapper class for continuous sequences      |
| `scalar/arithmetic.ts`    | 474   | clamp, sign, abs, min, max, saturate, remap, loop, pingPong, mod |
| `scalar/comparison.ts`    | 210   | nearEquals, isNearZero, relativeEquals, inRange                  |
| `scalar/interpolation.ts` | 261   | lerp, lerpClamped, inverseLerp, smoothStep, bezierInterp         |
| `scalar/constants.ts`     | 310   | EPSILON, TAU, PI, HALF_PI, GOLDEN_RATIO, conversion factors      |
| `numeric/guards.ts`       | 196   | isFinite, isNaN, isInfinity, isDenormal, isSafeInteger           |
| `numeric/rounding.ts`     | 205   | roundToInt, roundToPlaces, roundToMultiple, snapToGrid, quantize |
| `numeric/wrapping.ts`     | 261   | flooredMod, truncatedMod, mirror, repeat                         |
| `numeric/safety.ts`       | 428   | safeDivide, safeSqrt, safeAcos, robustSum, neumaierSum           |

### Deterministic Layer (`src/deterministic/`)

| Module                  | Lines  | Purpose                                                                     |
| ----------------------- | ------ | --------------------------------------------------------------------------- |
| `deterministic-math.ts` | 901    | DeterministicMath class with L0/L1/L2 sin/cos/sqrt/atan2/pow                |
| `precision-math.ts`     | 333    | PrecisionMath: Kahan/Neumaier summation, twoSum, twoProduct, compensatedDot |
| `rounding-control.ts`   | 391    | RoundingControl: banker's rounding, quantization, stochastic rounding       |
| `trig-tables.ts`        | 30,528 | SIN_TABLE, COS_TABLE (65536 entries each for L0 determinism)                |

### Validation Layer (`src/validation/`)

| Module      | Lines | Purpose                                      |
| ----------- | ----- | -------------------------------------------- |
| `assert.ts` | 519   | Dev-time assertions (stripped in production) |

### Utils Layer (`src/utils/`)

| Module             | Lines | Purpose                                                            |
| ------------------ | ----- | ------------------------------------------------------------------ |
| `random.ts`        | 582   | randomVector2, randomInCircle, randomGaussianVector2 (Box-Muller)  |
| `random-source.ts` | 267   | RandomSource interface, MathRandomSource, SeededRandomSource (LCG) |
| `parse.ts`         | 640   | parseVector2, parseMatrix2, parseTransform2, format\* functions    |
| `performance.ts`   | 368   | measure, measureAsync, MeasurementCollector for profiling          |

### Core Layer (`src/core/`)

| Class        | Lines | Methods | Purpose                                                 |
| ------------ | ----- | ------- | ------------------------------------------------------- |
| `Vector2`    | 3,640 | 180+    | 2D vector with full arithmetic/geometry/transforms      |
| `Rotation2`  | 1,478 | 60+     | Unit complex number as (cos,sin) for efficient rotation |
| `Complex`    | 1,768 | 80+     | General complex number for advanced math                |
| `Interval`   | 1,651 | 70+     | Closed interval [min,max] with arithmetic               |
| `Matrix2`    | 2,971 | 120+    | 2×2 matrix for linear transforms                        |
| `Matrix3`    | 4,097 | 170+    | 3×3 matrix for affine transforms                        |
| `Transform2` | 1,919 | 83+     | Decomposed SRT transform                                |

---

## Deterministic Layer Details

### PrecisionMath (333 lines)

High-precision arithmetic using compensation techniques:

- **kahanSum**: Compensates for rounding errors in summation
- **neumaierSum**: Better for varying magnitudes
- **twoSum**: Exact error tracking (Knuth's algorithm)
- **twoProduct**: Exact multiplication error (Veltkamp splitting)
- **compensatedDot**: High-precision dot product
- **extendedSum**: Combines compensated results

### RoundingControl (391 lines)

Explicit rounding control for deterministic behavior:

```typescript
enum RoundingMode {
 TRUNCATE, // Round towards zero
 NEAREST_EVEN, // Banker's rounding (ties to even)
 NEAREST_AWAY, // Traditional (ties away from zero)
 CEIL, // Round towards +∞
 FLOOR, // Round towards -∞
}
```

**Methods:** round, truncate, nearestEven, nearestAway, ceil, floor, roundToPlaces, roundToMultiple, quantizeToFixed, stochasticRound, rangeReduce

### Trig Tables (30,528 lines)

L0 deterministic lookup tables with 65536 entries each for SIN_TABLE and COS_TABLE. Provides bit-exact sin/cos across all platforms via linear interpolation.

---

## Utils Layer Details

### Random Sources (267 lines)

```typescript
interface RandomSource {
 next(): number; // [0, 1)
 nextInt(max: number): number;
 seed?(seed: number): void;
}
```

- **MathRandomSource**: Non-deterministic (Math.random)
- **SeededRandomSource**: Deterministic LCG (Park-Miller minimal standard, a=16807, m=2^31-1)

### Random Geometry (582 lines)

- **Vectors:** randomVector2, randomUnitVector2
- **Circles:** randomOnCircle, randomInCircle, randomInUnitCircle (sqrt(r) for uniform area)
- **Rectangles:** randomInRectangle, randomOnRectangle, randomInBox
- **Triangles:** randomInTriangle (barycentric), randomOnTriangle (edge-weighted)
- **Gaussian:** randomGaussianVector2 (Box-Muller transform)
- **Transforms:** randomRotation2, randomTransform2

### Parsing & Formatting (640 lines)

- **parseVector2:** Supports "(x,y)", "[x,y]", "{x:n,y:n}", "x,y", "x y"
- **parseRotation2:** Supports "90deg", radians, "c,s" components
- **parseMatrix2/3:** Supports flat, nested arrays, JSON
- **parseTransform2:** Supports "px,py,c,s", JSON
- **format\*:** Outputs csv, space, json, brackets formats

### Performance Utilities (368 lines)

- **timestamp():** High-resolution timestamp
- **measure(label, fn):** Sync measurement
- **measureAsync(label, fn):** Async measurement
- **MeasurementCollector:** Aggregates measurements with summary statistics

---

## Auxiliary Layer Details (Additional)

### Scalar Constants (310 lines)

| Category     | Constants                                               |
| ------------ | ------------------------------------------------------- |
| Tolerance    | EPSILON (1e-10), EPSILON_SQUARED, ANGLE_EPSILON (1e-12) |
| Angular      | PI, TAU (2π), HALF_PI, QUARTER_PI                       |
| Conversion   | DEG_TO_RAD, RAD_TO_DEG, RAD_TO_TURN, GRAD_TO_RAD        |
| Mathematical | SQRT_2, SQRT_HALF, LN_2, LN_10, GOLDEN_RATIO, E         |

### Angle Unwrapping (203 lines)

For continuous angle sequences (avoiding 2π jumps):

- **unwrapAngles(angles, reference?):** Batch unwrap to new array
- **unwrapAnglesInPlace(angles, reference?):** Memory-efficient in-place
- **AngleUnwrapper:** Streaming class with next(), value, reset()

---

## Architectural Patterns

### 1. Triality Policy (Strict/Safe/Unchecked)

| Variant             | Behavior          | Use Case                   |
| ------------------- | ----------------- | -------------------------- |
| `method()`          | Throws on invalid | Default, catches bugs      |
| `methodSafe()`      | Returns fallback  | Graceful degradation       |
| `methodUnchecked()` | No validation     | Hot paths w/ preconditions |

### 2. ensureOut Pattern

Zero-allocation via optional `out` parameter:

```typescript
Vector2.add(a, b, out?)  // Reuses out if provided
```

### 3. freeze\* Helpers

Immutable static constants:

```typescript
public static readonly ZERO = freezeVector2(new Vector2(0, 0));
```

### 4. \*Like Interfaces

Loose coupling via structural types:

```typescript
interface Vector2Like {
 x: number;
 y: number;
}
```

### 5. \*CS Methods

Precomputed cos/sin for hot paths:

```typescript
Vector2.rotateCS(v, cos, sin, out); // Faster than rotate(v, angle, out)
```

---

## Determinism Levels

| Level | Name                  | Guarantee            | Implementation            |
| ----- | --------------------- | -------------------- | ------------------------- |
| L0    | Bit-exact             | Same bits everywhere | 65536-entry tables + FISR |
| L1    | Engine-consistent     | Same within engine   | Math.\* + quantization    |
| L2    | Invocation-consistent | Same per call        | Standard IEEE 754         |

---

## Summary Statistics

| Layer         | Files  | Lines       |
| ------------- | ------ | ----------- |
| Auxiliary     | 13     | ~3,400      |
| Deterministic | 4      | ~32,150     |
| Validation    | 1      | 519         |
| Utils         | 4      | ~1,857      |
| Core          | 7      | ~17,500     |
| **Total**     | **29** | **~55,400** |

---

## Recommendations

### High Priority

1. Complete L0 determinism for `atan2` and `pow` (precomputed tables)
2. Add `wrapAngleSafe` that returns fallback instead of silent 0

### Medium Priority

3. Document transform order more prominently in Matrix3
4. Add stricter input validation in parse\* functions

### Low Priority

5. Add static `from` factory as unified entry point
6. Consider typed arrays for Matrix internal storage

---

_Audit completed: December 25, 2025_
