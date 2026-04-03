## ADDED Requirements

### Requirement: Scalar constants completeness and placement

All mathematical constants in `auxiliary/scalar/constants.ts` SHALL be individually exported AND aggregated into a frozen `Constants` object. Every constant SHALL have a real use-case within the math2d package itself (used by at least one other module). The `SMALLEST_NORMAL` constant (2.2250738585072014e-308) SHALL be evaluated: if it is used only in numeric guard operations it SHALL be moved to `auxiliary/numeric/guards.ts` rather than `constants.ts`.

#### Scenario: Constants match their values

- **WHEN** each named constant is evaluated at runtime
- **THEN** EPSILON = 1e-10, PI ≈ 3.14159265358979, TAU = 2\*PI, HALF_PI = PI/2, QUARTER_PI = PI/4, DEG_TO_RAD = PI/180, RAD_TO_DEG = 180/PI, SQRT_2 = √2, SQRT_HALF = 1/√2, LN_2 = ln(2)

#### Scenario: Constants frozen object mirrors exports

- **WHEN** a consumer imports the `Constants` object
- **THEN** every individually exported constant SHALL appear as a property with identical value

#### Scenario: SMALLEST_NORMAL placement audit

- **WHEN** the audit traces all callers of SMALLEST_NORMAL across all source files
- **THEN** if no caller exists in `constants.ts` consumers (scalar arithmetic, interpolation) the constant SHALL be classified as RESTRUCTURE to `numeric/guards.ts`

---

### Requirement: No duplication between scalar/arithmetic and numeric/wrapping

`auxiliary/scalar/arithmetic.ts` and `auxiliary/numeric/wrapping.ts` SHALL NOT export functions with identical or near-identical semantics under different names. The current exports `loop`/`mod` appear in both modules; the audit SHALL assign each to exactly one canonical home and the other SHALL re-export or be removed.

#### Scenario: Duplicate detection

- **WHEN** the audit compares the implementations of `loop` in `scalar/arithmetic.ts` vs `numeric/wrapping.ts`
- **THEN** they SHALL either be identical (one should re-export the other) or semantically distinct (different behavior documented, different names justified)

#### Scenario: `mod` vs `flooredMod` distinction

- **WHEN** a consumer calls `mod(a, b)` vs `flooredMod(a, b)` with a negative dividend
- **THEN** `mod` SHALL return IEEE-754 remainder (same sign as dividend) and `flooredMod` SHALL return floored modulo (same sign as divisor), making them distinct operations that SHALL both exist but in the same module

---

### Requirement: Triality completeness for fallible scalar operations

Every scalar function that can produce incorrect results for degenerate inputs (division, inverse, logarithm, square root) SHALL have three variants: strict (throws on invalid input, default), `*Safe` (returns a fallback), and `*Unchecked` (no validation). Functions that cannot fail (e.g., `clamp`, `sign`, `step`) SHALL NOT have `*Safe` or `*Unchecked` variants (SOLID: no unused complexity).

#### Scenario: `remap` triality is complete

- **WHEN** `remapSafe` is called with `inMin === inMax` (zero-width input range)
- **THEN** it SHALL return the provided fallback without throwing

#### Scenario: `loop` triality is complete

- **WHEN** `loopUnchecked` is called with `min === max`
- **THEN** it SHALL proceed without validation (behavior may be mathematically undefined but no exception is thrown)

#### Scenario: `clamp` has no triality variants

- **WHEN** the audit checks for `clampSafe` or `clampUnchecked`
- **THEN** they SHALL NOT exist, because `clamp` never fails for finite inputs

---

### Requirement: `pingPong` is mathematically correct and named consistently

`pingPong(value, min, max)` SHALL implement the standard game-math ping-pong (triangle wave) function: the value bounces back and forth between `min` and `max`. The name SHALL match Unity/Godot conventions (`PingPong` in Unity, `pingpong` in Godot). The function SHALL be present in `scalar/arithmetic.ts` only.

#### Scenario: Triangle wave behavior

- **WHEN** `pingPong(t, 0, 1)` is called for t = 0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5
- **THEN** results SHALL be 0, 0.25, 0.5, 0.75, 1.0, 0.75, 0.5 (bounces at boundaries)

---

### Requirement: `saturate` and `saturateSigned` naming and semantics

`saturate(v)` SHALL clamp to [0, 1] matching GLSL/HLSL `saturate`. `saturateSigned(v)` SHALL clamp to [-1, 1]. Both SHALL be verifiable against gl-matrix and GLSL conventions. No additional variants are needed.

#### Scenario: `saturate` clamps to unit interval

- **WHEN** `saturate(-0.5)`, `saturate(0.3)`, `saturate(1.5)` are called
- **THEN** results SHALL be 0, 0.3, 1 respectively

#### Scenario: `saturateSigned` clamps to signed unit interval

- **WHEN** `saturateSigned(-2)`, `saturateSigned(0.7)`, `saturateSigned(3)` are called
- **THEN** results SHALL be -1, 0.7, 1 respectively

---

### Requirement: Interpolation functions completeness in scalar/interpolation

`auxiliary/scalar/interpolation.ts` SHALL contain: `lerp`, `lerpClamped`, `inverseLerp`, `inverseLerpSafe`, `inverseLerpUnchecked`, `smoothStep` (cubic Hermite), `smootherStep` (quintic). No additional interpolation variants SHALL be added unless a reference library provides evidence of need. `lerpSafe` (if it exists in `numeric/safety.ts`) SHALL be audited: if it duplicates `inverseLerpSafe` semantics it SHALL be removed.

#### Scenario: `smoothStep` matches GLSL definition

- **WHEN** `smoothStep(0, 1, 0.5)` is called
- **THEN** result SHALL be 0.5 (midpoint of cubic Hermite), and `smoothStep(0, 1, 0)` = 0, `smoothStep(0, 1, 1)` = 1

#### Scenario: `smootherStep` provides C2-continuous derivative

- **WHEN** `smootherStep(0, 1, t)` is evaluated at t = 0, 0.5, 1
- **THEN** values at 0 and 1 SHALL be 0 and 1; the function SHALL be indistinguishable from smoothStep at endpoints but provide zero second derivative there

#### Scenario: `inverseLerpSafe` handles zero-range

- **WHEN** `inverseLerpSafe(5, 5, 7)` is called (min === max)
- **THEN** it SHALL return 0 (or a configurable fallback) without throwing

---

### Requirement: Angle conversion functions are complete and bidirectional

`auxiliary/angle/conversion.ts` SHALL contain the four canonical conversion functions: `degreesToRadians`, `radiansToDegrees`, `turnsToRadians`, `radiansToTurns`. No additional unit systems (gradians) SHALL be added unless justified by a downstream use case.

#### Scenario: Round-trip conversion preserves value

- **WHEN** `radiansToDegrees(degreesToRadians(45))` is computed
- **THEN** result SHALL equal 45 within EPSILON

---

### Requirement: Angle normalization covers all standard ranges

`auxiliary/angle/normalization.ts` SHALL provide: `normalizeRadians` (→ (-π, π]), `normalizeRadiansPositive` (→ [0, 2π)), `normalizeDegrees` (→ (-180°, 180°]), `normalizeDegreesPositive` (→ [0°, 360°)). No additional normalization functions SHALL be added unless a new range convention is demonstrated by ≥2 reference libraries.

#### Scenario: `normalizeRadians` maps to half-open (-π, π]

- **WHEN** `normalizeRadians(Math.PI * 3)` is called
- **THEN** result SHALL equal -Math.PI (maps to left boundary convention)

#### Scenario: `normalizeRadiansPositive` maps to [0, 2π)

- **WHEN** `normalizeRadiansPositive(-Math.PI / 2)` is called
- **THEN** result SHALL equal 3 \* Math.PI / 2 (maps to positive equivalent)

---

### Requirement: Angle operations are complete and non-redundant

`auxiliary/angle/operations.ts` SHALL contain: `angleDifference` (signed shortest arc), `angleDistance` (unsigned shortest arc), `anglesNearEqual` (comparison within tolerance), `angleBisector` (angle midpoint on shortest arc), `isAngleBetween` (containment check), `clampAngle` (clamp to angular range), `sinCos` (combined sin+cos returning SinCos), `sinCosNormalized` (normalizes angle first), `angleFromVectors` (signed angle from v1 to v2). The `sinCos` and `sinCosNormalized` functions SHALL route their computation through `deterministic/` to guarantee L0 bit-exact results.

#### Scenario: `angleDifference` returns shortest signed arc

- **WHEN** `angleDifference(0, Math.PI * 1.5)` is called
- **THEN** result SHALL equal -Math.PI / 2 (shortest arc is -90° not +270°)

#### Scenario: `sinCos` uses deterministic kernels

- **WHEN** the audit traces the implementation of `sinCos(angle)`
- **THEN** it SHALL call the deterministic `sin` and `cos` from `deterministic/`, not `Math.sin`/`Math.cos`

---

### Requirement: AngleUnwrapper class is the only stateful export in auxiliary

`AngleUnwrapper` SHALL be the only stateful (class-based) export in the entire `auxiliary/` layer. Its placement in `auxiliary/angle/unwrapping.ts` is appropriate because it is a pure mathematical utility (no allocations beyond its own state). The `unwrapAngles` and `unwrapAnglesInPlace` functions SHALL coexist as stateless convenience variants.

#### Scenario: AngleUnwrapper is the sole class in auxiliary

- **WHEN** the audit scans all exports from `auxiliary/scalar/`, `auxiliary/angle/`, `auxiliary/numeric/`
- **THEN** `AngleUnwrapper` SHALL be the only `class` export; all other exports SHALL be functions or constants

#### Scenario: Streaming unwrap produces continuous angles

- **WHEN** an AngleUnwrapper receives a sequence of angles that cross the ±π boundary
- **THEN** the output sequence SHALL be continuous (no jumps greater than π)

---

### Requirement: Numeric safety functions cover all standard unsafe operations

`auxiliary/numeric/safety.ts` SHALL contain safe wrappers for: `log` (logSafe), `pow` (powSafe), `divide` (divideSafe), `reciprocal` (reciprocalSafe), `sqrt` (sqrtSafe), `acos` (acosSafe), `asin` (asinSafe). It SHALL also contain: `robustSum` (Kahan compensated summation), `neumaierSum` (improved Kahan), `compensatedProduct`, `sanitizeNumber` (NaN/Inf → fallback), `ensureFinite` (throws on NaN/Inf). The `lerpSafe` in this file SHALL be audited: if it duplicates `inverseLerpSafe` from interpolation it SHALL be removed; if it is a fallback-returning `lerp` for degenerate t values it SHALL be kept and documented clearly.

#### Scenario: `divideSafe` returns fallback for zero divisor

- **WHEN** `divideSafe(5, 0, Infinity)` is called
- **THEN** result SHALL be `Infinity` (the provided fallback) without throwing

#### Scenario: `neumaierSum` reduces floating-point accumulation error

- **WHEN** `neumaierSum([1e10, 1, -1e10])` is computed
- **THEN** result SHALL equal 1.0 (not 0.0 as naive summation would produce)

---

### Requirement: Numeric guards cover IEEE-754 special values

`auxiliary/numeric/guards.ts` SHALL contain: `isPositiveInfinity`, `isNegativeInfinity`, `isInfinity`, `isDenormal`, `isInRange`, `flushDenormal`. No guard for `isNaN` SHALL be added because `Number.isNaN` is already standard. `flushDenormal` SHALL flush a denormal number to zero (matching the IEEE-754 flush-to-zero behavior common in hardware).

#### Scenario: `isDenormal` identifies numbers below SMALLEST_NORMAL

- **WHEN** `isDenormal(5e-324)` (Number.MIN_VALUE) is checked
- **THEN** result SHALL be `true`

#### Scenario: `flushDenormal` returns zero for denormal inputs

- **WHEN** `flushDenormal(5e-324)` is called
- **THEN** result SHALL be 0

---

### Requirement: Rounding functions cover standard snap/grid operations

`auxiliary/numeric/rounding.ts` SHALL contain: `roundToInt`, `roundToPlaces`, `roundToMultiple`, `snapToGrid`, `fract`, `ceilPowerOfTwo`, `floorPowerOfTwo`. `roundToPowerOfTwo` SHALL be evaluated: if it is equivalent to `Math.round` toward the nearest power-of-two it must be clearly distinguished from `ceilPowerOfTwo`/`floorPowerOfTwo` or removed as redundant.

#### Scenario: `fract` returns fractional part

- **WHEN** `fract(3.75)` is called
- **THEN** result SHALL be 0.75; `fract(-1.25)` SHALL be 0.75 (matching GLSL fract, always non-negative)

#### Scenario: `ceilPowerOfTwo` and `floorPowerOfTwo` are monotone

- **WHEN** `ceilPowerOfTwo(5)` and `floorPowerOfTwo(5)` are called
- **THEN** results SHALL be 8 and 4 respectively
