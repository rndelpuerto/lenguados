# Scalar Layer Verdict

Source files:

- `packages/math2d/src/auxiliary/scalar/constants.ts`
- `packages/math2d/src/auxiliary/scalar/arithmetic.ts`
- `packages/math2d/src/auxiliary/scalar/comparison.ts`
- `packages/math2d/src/auxiliary/scalar/interpolation.ts`

## Summary

All scalar exports are correctly designed and complete. Full triality coverage (strict / safe / unchecked) on all fallible operations. No issues found.

## constants.ts

| Export            | Verdict | Rationale                                                                                                                      |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `EPSILON`         | KEEP    | 1e-10 tolerance constant; correctly documented as geometric comparison threshold, distinct from `MIN_SAFE_DIVISOR`             |
| `EPSILON_SQUARED` | KEEP    | Used for squared-distance comparisons; avoids sqrt in hot paths                                                                |
| `PI`              | KEEP    | Canonical re-export of `Math.PI`; avoids raw literals in consumer code                                                         |
| `TAU`             | KEEP    | 2π; useful for full-rotation calculations                                                                                      |
| `HALF_PI`         | KEEP    | π/2; widely used in angle operations                                                                                           |
| `QUARTER_PI`      | KEEP    | π/4; used in 45° diagonal computations                                                                                         |
| `DEG_TO_RAD`      | KEEP    | Conversion factor; standard for angle unit conversions                                                                         |
| `RAD_TO_DEG`      | KEEP    | Inverse conversion factor                                                                                                      |
| `RAD_TO_TURN`     | KEEP    | Radians-to-turns conversion; less common but documented                                                                        |
| `TURN_TO_RAD`     | KEEP    | Inverse; equals TAU                                                                                                            |
| `SQRT_2`          | KEEP    | √2; diagonal of unit square; commonly needed                                                                                   |
| `SQRT_HALF`       | KEEP    | 1/√2; used for 45° sin/cos in rotation constants                                                                               |
| `LN_2`            | KEEP    | Natural log of 2; used in `roundToPowerOfTwo` and power-of-two utilities                                                       |
| `SMALLEST_NORMAL` | KEEP    | IEEE 754 smallest normal double (2^-1022); used in `isDenormal`; correctly placed here (scalar constant, not a type operation) |
| `Constants`       | KEEP    | Frozen aggregation object for environments that prefer namespaced access; no runtime overhead                                  |

## arithmetic.ts

| Export                 | Verdict | Rationale                                                                 |
| ---------------------- | ------- | ------------------------------------------------------------------------- | --- | -------------- |
| `clamp`                | KEEP    | Fundamental; used throughout the library                                  |
| `sign`                 | KEEP    | Normalizes NaN→0 and ±0→0, unlike `Math.sign`; returns `-1                | 0   | 1` typed union |
| `saturate`             | KEEP    | [0,1] clamp; widely used for interpolation factors and color values       |
| `saturateSigned`       | KEEP    | [-1,1] clamp; useful for normalized directions and sine/cosine values     |
| `remap`                | KEEP    | Strict linear range mapping; triality complete                            |
| `remapSafe`            | KEEP    | Safe variant with degenerate-range fallback                               |
| `loop`                 | KEEP    | Periodic wrapping; strict variant; correct positive-modulo implementation |
| `loopSafe`             | KEEP    | Safe variant returning min for invalid range                              |
| `loopUnchecked`        | KEEP    | Unchecked variant for hot loops; precondition documented                  |
| `pingPong`             | KEEP    | Bounce-back wrapping; strict variant; all three triality variants present |
| `pingPongSafe`         | KEEP    | Safe variant                                                              |
| `pingPongUnchecked`    | KEEP    | Unchecked variant                                                         |
| `step`                 | KEEP    | GLSL-style Heaviside function; NaN behavior documented (returns 1)        |
| `mod`                  | KEEP    | Always-positive modulo; strict variant; triality complete                 |
| `modSafe`              | KEEP    | Returns 0 for invalid divisor                                             |
| `modUnchecked`         | KEEP    | Hot-path unchecked variant                                                |
| `floorDivide`          | KEEP    | Grid-cell floor division; strict variant; triality complete               |
| `floorDivideSafe`      | KEEP    | Returns 0 for zero divisor                                                |
| `floorDivideUnchecked` | KEEP    | Hot-path unchecked variant                                                |

## comparison.ts

| Export           | Verdict | Rationale                                                                                                             |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------ |
| `nearEquals`     | KEEP    | Absolute epsilon comparison; NaN handled correctly (always false); fast path for identical values including ±Infinity |
| `isNearZero`     | KEEP    | Specialized zero test; used extensively by core types for zero-guard checks                                           |
| `isNearOne`      | KEEP    | Normalization test; used for unit-length verification                                                                 |
| `relativeEquals` | KEEP    | Combined absolute+relative tolerance (Ericson pattern); correctly handles infinities and NaN                          |
| `lessThan`       | KEEP    | Epsilon-tolerant less-than; `a < b - epsilon` semantics are correct and documented                                    |
| `greaterThan`    | KEEP    | Epsilon-tolerant greater-than                                                                                         |
| `inRange`        | KEEP    | Epsilon-tolerant range test; distinct from `isInRange` (which is exact); cross-linked correctly                       |
| `compare`        | KEEP    | Three-way comparison returning `-1                                                                                    | 0   | 1`; NaN sorting convention documented (NaN sorts last) |

## interpolation.ts

| Export                 | Verdict | Rationale                                                                                     |
| ---------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `lerp`                 | KEEP    | Unclamped linear interpolation; allows extrapolation; fast early-exit for t=0/1               |
| `lerpClamped`          | KEEP    | Clamped variant; explicit early-exit for t>=1 and t<=0 avoids saturate call                   |
| `inverseLerp`          | KEEP    | Strict inverse lerp; triality complete                                                        |
| `inverseLerpSafe`      | KEEP    | Returns 0 for degenerate range                                                                |
| `inverseLerpUnchecked` | KEEP    | Hot-path variant                                                                              |
| `smoothStep`           | KEEP    | Cubic Hermite; degenerate-range step fallback documented; correct `3t²-2t³` formula           |
| `smootherStep`         | KEEP    | Quintic Hermite (Ken Perlin); correct `6t⁵-15t⁴+10t³` formula; degenerate-range step fallback |
