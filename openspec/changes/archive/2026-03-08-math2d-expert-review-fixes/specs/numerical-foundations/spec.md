## ADDED Requirements

### Requirement: inverseLerp/inverseLerpSafe division guard uses correct tolerance tier

The `inverseLerp` and `inverseLerpSafe` functions SHALL use division-safety thresholds, not geometric-comparison thresholds, for their zero-denominator guards. The current implementation uses `isNearZero(denominator)` with `EPSILON = 1e-10`, which is a geometric near-equality tolerance inappropriate for division safety. This rejects valid computations where the denominator is small but the quotient is perfectly representable. The fix SHALL apply the tolerance classification established in this codebase: geometric tolerance (`EPSILON`) for spatial comparisons, numerical safety tolerance (`Number.EPSILON` or `MIN_SAFE_DIVISOR`) for division guards.

**Source:** `packages/math2d/src/auxiliary/scalar/interpolation.ts:89-111`

**Reference:** Design decision D8 (inverseLerp Threshold); Goldberg (1991) Section 2 on relative error bounds; IEEE 754-2019 Section 5.4.1 on division semantics.

#### Scenario: Strict inverseLerp rejects only exact zero denominator

- **GIVEN** `a = 0`, `b = 1e-10`, `value = 5e-11`
- **WHEN** `inverseLerp(a, b, value)` is called
- **THEN** the result SHALL be `0.5` (the quotient `5e-11 / 1e-10` is exactly representable)
- **AND** the function SHALL NOT throw, because the denominator `1e-10` is non-zero and the division produces a finite, meaningful result

#### Scenario: Strict inverseLerp throws on exact zero

- **GIVEN** `a = 5`, `b = 5`, `value = 5`
- **WHEN** `inverseLerp(a, b, value)` is called
- **THEN** the function SHALL throw a `RangeError`, because `denominator === 0`

#### Scenario: Safe inverseLerpSafe uses Number.EPSILON threshold

- **GIVEN** `a = 0`, `b = 1e-16`, `value = 5e-17`
- **WHEN** `inverseLerpSafe(a, b, value)` is called
- **THEN** the result SHALL be `0` (safe fallback), because `|denominator| < Number.EPSILON` (~2.2e-16) means the quotient loses all significant digits

#### Scenario: Safe inverseLerpSafe computes valid small-denominator results

- **GIVEN** `a = 0`, `b = 1e-12`, `value = 3e-13`
- **WHEN** `inverseLerpSafe(a, b, value)` is called
- **THEN** the result SHALL be `0.3`, because the denominator `1e-12` is well above `Number.EPSILON` and the quotient retains full precision

---

### Requirement: lerp endpoint exactness

`lerp(a, b, t)` SHALL guarantee endpoint exactness at `t === 1`: `lerp(a, b, 1)` returns exactly `b`, regardless of the magnitudes of `a` and `b`. The formula `a + (b - a) * t` does not satisfy this guarantee because IEEE 754 rounding in `(b - a) * 1.0` and subsequent addition can produce a result differing from `b` by 1 ULP.

**For `lerp` (supports extrapolation):** Add only `if (t === 1) return b;` (strict equality). The `t === 0` case needs NO guard because `a + (b - a) * 0` is naturally exact: IEEE 754 §6.3 guarantees `x * 0 = 0` for finite x, and `a + 0 = a`. Using `t <= 0` or `t >= 1` would break extrapolation.

**For `lerpClamped` (no extrapolation):** Add `if (t >= 1) return b; if (t <= 0) return a;` to both guarantee endpoints and enforce clamping.

**Source:** `packages/math2d/src/auxiliary/scalar/interpolation.ts:35-65`

**Reference:** C++20 `std::lerp` (P0811R3, N4860 §26.8.4) mandates endpoint exactness using `if (t == 1) return b;` (strict equality); Luau (Roblox) uses the same approach; Fabian Giesen's analysis confirms `t === 0` guard is unnecessary.

#### Scenario: lerp at t=1 returns exact endpoint b

- **GIVEN** `a = 1e15` and `b = 1e15 + 1`
- **WHEN** `lerp(a, b, 1)` is called
- **THEN** the result SHALL be exactly `b` (i.e., `1e15 + 1`), not `a + (b - a) * 1.0` which may differ by 1 ULP

#### Scenario: lerp at t=0 is naturally exact (no guard needed)

- **GIVEN** `a = 1.0000000000000002` (1 + 2\*Number.EPSILON) and `b = 1e20`
- **WHEN** `lerp(a, b, 0)` is called
- **THEN** the result SHALL be exactly `a` via the natural formula: `a + (b - a) * 0 = a + 0 = a` (IEEE 754 guarantees this)

#### Scenario: lerp supports extrapolation (no clamping guards)

- **GIVEN** `a = 0` and `b = 10` and `t = 2.0`
- **WHEN** `lerp(a, b, t)` is called
- **THEN** the result SHALL be `20.0` (extrapolated, NOT clamped to 10)

#### Scenario: lerpClamped at t>=1 returns exact endpoint b

- **GIVEN** `a = -1e308` and `b = 1e308`
- **WHEN** `lerpClamped(a, b, 1)` is called
- **THEN** the result SHALL be exactly `b` (i.e., `1e308`)

#### Scenario: lerpClamped at t<=0 returns exact endpoint a

- **GIVEN** `a = -1e308` and `b = 1e308`
- **WHEN** `lerpClamped(a, b, -0.5)` is called
- **THEN** the result SHALL be exactly `a` (i.e., `-1e308`)

#### Scenario: lerp intermediate values are unchanged

- **GIVEN** `a = 0` and `b = 10` and `t = 0.3`
- **WHEN** `lerp(a, b, t)` is called
- **THEN** the result SHALL be `3.0` (intermediate values are computed via the standard formula, preserving determinism for existing code with `0 < t < 1`)

---

### Requirement: Interval.divide EPSILON threshold matches tolerance classification

`Interval.divide` (strict variant) SHALL use `scalar === 0` as its zero check, and `Interval.divideSafe` SHALL use `Math.abs(scalar) < Number.EPSILON` (~2.2e-16), consistent with the tolerance classification applied to `inverseLerp`/`inverseLerpSafe`. The current implementation uses `isNearZero(scalar)` with `EPSILON = 1e-10`, which rejects valid small but non-zero divisors such as `1e-10`.

**Source:** `packages/math2d/src/core/interval.ts:423-451`

**Reference:** Same tolerance classification as inverseLerp (Design decision D8); IEEE 754-2019 Section 7.3 on division by zero.

#### Scenario: Strict Interval.divide accepts small non-zero scalar

- **GIVEN** `interval = Interval(2, 10)` and `scalar = 1e-10`
- **WHEN** `Interval.divide(interval, scalar)` is called
- **THEN** the result SHALL be `Interval(2e10, 1e11)` (valid division)
- **AND** the function SHALL NOT throw

#### Scenario: Strict Interval.divide throws on exact zero

- **GIVEN** `interval = Interval(1, 5)` and `scalar = 0`
- **WHEN** `Interval.divide(interval, scalar)` is called
- **THEN** the function SHALL throw a `RangeError`

#### Scenario: Safe Interval.divideSafe returns fallback for sub-epsilon scalar

- **GIVEN** `interval = Interval(1, 5)` and `scalar = 1e-17`
- **WHEN** `Interval.divideSafe(interval, scalar)` is called
- **THEN** the result SHALL be `Interval(0, 0)` (safe fallback), because `|scalar| < Number.EPSILON`

#### Scenario: Safe Interval.divideSafe computes valid result for small scalar

- **GIVEN** `interval = Interval(1, 5)` and `scalar = 1e-10`
- **WHEN** `Interval.divideSafe(interval, scalar)` is called
- **THEN** the result SHALL be `Interval(1e10, 5e10)` (valid division, not the zero fallback)

---

### Requirement: compensatedProduct documents valid input range due to Veltkamp splitting overflow

`compensatedProduct` SHALL document in its JSDoc `@remarks` that the Veltkamp splitting step overflows for operands with `|a| > ~1.34e300` or `|b| > ~1.34e300`. The splitting constant is `2^27 + 1 = 134217729`, and `split * a` exceeds `Number.MAX_VALUE` (~1.7976931348623157e+308) when `|a| > MAX_VALUE / 134217729 ≈ 1.34e300` (since 10^(308−8) = 10^300). When overflow occurs, the split values become `Infinity` and the error term becomes `NaN`, silently corrupting the result.

**Source:** `packages/math2d/src/auxiliary/numeric/safety.ts:295-321`

**Reference:** Veltkamp (1968) splitting algorithm; Dekker (1971) "A floating-point technique for extending the available precision," Section 3; Goldberg (1991) Theorem 12.

#### Scenario: compensatedProduct within valid range returns accurate error

- **GIVEN** `a = 1.23456789` and `b = 9.87654321`
- **WHEN** `compensatedProduct(a, b)` is called
- **THEN** `result.product + result.error` SHALL equal the mathematically exact product to within 1 ULP of double precision
- **AND** `result.error` SHALL be finite (not NaN, not Infinity)

#### Scenario: compensatedProduct near overflow boundary produces NaN error

- **GIVEN** `a = 1e301` and `b = 2.0`
- **WHEN** `compensatedProduct(a, b)` is called
- **THEN** `result.product` SHALL be `2e301` (the main product is computed before splitting)
- **AND** `result.error` SHALL be `NaN` (because `split * a = 134217729 * 1e301 ≈ 1.34e309 > MAX_VALUE`, overflowing to `Infinity` and corrupting the Veltkamp decomposition)

#### Scenario: JSDoc documents the valid input range

- **GIVEN** the `compensatedProduct` JSDoc
- **WHEN** the documentation is reviewed
- **THEN** it SHALL contain a `@remarks` note stating that operands must satisfy `|a| < ~1.34e300` and `|b| < ~1.34e300` for the error term to be meaningful, and that outside this range the Veltkamp splitting overflows and the error term becomes `NaN`

---

### Requirement: remap documents precision loss for large magnitudes with catastrophic cancellation

`remap` SHALL document in its JSDoc `@remarks` that the formula `outMin + ((value - inMin) / inRange) * outRange` suffers from catastrophic cancellation when `value` is close to `inMin` and both have large magnitudes. When `value ~ inMin ~ 1e15`, the subtraction `value - inMin` loses approximately 15 significant digits, leaving the normalized ratio with near-zero precision. This is a known limitation of the single-pass linear remap formula.

**Source:** `packages/math2d/src/auxiliary/scalar/arithmetic.ts:110-123`

**Reference:** Goldberg (1991) Section 1.3.2 on catastrophic cancellation; Higham (2002) "Accuracy and Stability of Numerical Algorithms," Section 1.3.

#### Scenario: remap with large-magnitude close values loses precision

- **GIVEN** `value = 1e15 + 1`, `inMin = 1e15`, `inMax = 1e15 + 10`, `outMin = 0`, `outMax = 1`
- **WHEN** `remap(value, inMin, inMax, outMin, outMax)` is called
- **THEN** the result SHALL be approximately `0.1`
- **AND** the result MAY differ from the mathematically exact `0.1` due to cancellation in `value - inMin` when both operands have magnitude ~1e15

#### Scenario: remap with small-magnitude values retains full precision

- **GIVEN** `value = 5`, `inMin = 0`, `inMax = 10`, `outMin = 0`, `outMax = 100`
- **WHEN** `remap(value, inMin, inMax, outMin, outMax)` is called
- **THEN** the result SHALL be exactly `50`

#### Scenario: JSDoc documents the cancellation limitation

- **GIVEN** the `remap` JSDoc
- **WHEN** the documentation is reviewed
- **THEN** it SHALL contain a `@remarks` note describing the catastrophic cancellation risk when `value` is close to `inMin` at large magnitudes, and recommend that callers pre-shift inputs to a smaller range when high precision is needed

---

### Requirement: remap endpoint exactness

`remap(inMax, inMin, inMax, outMin, outMax)` SHALL return exactly `outMax`. The current formula computes `outMin + ((inMax - inMin) / (inMax - inMin)) * (outMax - outMin)` which simplifies to `outMin + 1.0 * (outMax - outMin)`. For large values of `outMin` and `outMax`, the expression `outMin + (outMax - outMin)` may not equal `outMax` due to IEEE 754 rounding, differing by 1 ULP. This is the same class of endpoint inexactness as `lerp(a, b, 1) !== b`.

**Source:** `packages/math2d/src/auxiliary/scalar/arithmetic.ts:110-123`

**Reference:** Same ULP analysis as lerp endpoint exactness (Design decision D9); C++20 `std::lerp` endpoint guarantee (N4860 Section 26.8.4) applied by analogy.

#### Scenario: remap at inMax returns exact outMax

- **GIVEN** `value = inMax = 100`, `inMin = 0`, `outMin = 1e15`, `outMax = 1e15 + 1`
- **WHEN** `remap(value, inMin, inMax, outMin, outMax)` is called
- **THEN** the result SHALL be exactly `outMax` (i.e., `1e15 + 1`), not `outMin + (outMax - outMin)` which may differ by 1 ULP

#### Scenario: remap at inMin returns exact outMin

- **GIVEN** `value = inMin = 0`, `inMax = 100`, `outMin = 1e15`, `outMax = 1e15 + 1`
- **WHEN** `remap(value, inMin, inMax, outMin, outMax)` is called
- **THEN** the result SHALL be exactly `outMin` (i.e., `1e15`)

#### Scenario: remap intermediate values are unchanged

- **GIVEN** `value = 50`, `inMin = 0`, `inMax = 100`, `outMin = 0`, `outMax = 10`
- **WHEN** `remap(value, inMin, inMax, outMin, outMax)` is called
- **THEN** the result SHALL be `5` (intermediate values use the standard formula, preserving determinism)

---

### Requirement: Matrix3.decompose removes unnecessary normalization in atan2 call

`Matrix3.decompose` SHALL compute the rotation angle as `atan2(m01, m00)` instead of `atan2(m01 / sx, m00 / sx)`. Since `sx = hypot(m00, m01)`, dividing both arguments by `sx` does not change the angle (atan2 is scale-invariant: `atan2(k*y, k*x) === atan2(y, x)` for `k > 0`). The unnecessary division by `sx` adds computational cost and, more importantly, amplifies numerical error when `sx` is very small: dividing by a near-zero `sx` produces large intermediate values with reduced precision, whereas `atan2(m01, m00)` operates directly on the original matrix elements.

**Source:** `packages/math2d/src/core/matrix3.ts:1945`

**Reference:** IEEE 754-2019 Section 9.2.1 on atan2 semantics; the identity `atan2(k*y, k*x) = atan2(y, x)` for `k > 0` follows from the definition `atan2(y, x) = arg(x + iy)`.

#### Scenario: decompose produces correct rotation without normalization

- **GIVEN** a matrix constructed from `Matrix3.fromSRT(sx=2, sy=3, rotation=PI/4, tx=10, ty=20)`
- **WHEN** `Matrix3.decompose(matrix)` is called
- **THEN** the extracted rotation SHALL be `PI / 4` (equivalent result whether or not m01, m00 are divided by sx)

#### Scenario: decompose with very small scale avoids amplification

- **GIVEN** a matrix with `m00 = 1e-15`, `m01 = 1e-15` (implying `sx = hypot(1e-15, 1e-15) ~ 1.414e-15`)
- **WHEN** `Matrix3.decompose(matrix)` is called
- **THEN** the rotation SHALL be computed as `atan2(1e-15, 1e-15) = PI/4`
- **AND** the function SHALL NOT compute `atan2(1e-15 / 1.414e-15, 1e-15 / 1.414e-15)` which, while giving the same angle, amplifies any error in `sx` into the atan2 arguments

#### Scenario: zero-scale guard remains unchanged

- **GIVEN** a matrix with `m00 = 0`, `m01 = 0` (implying `sx = 0`)
- **WHEN** `Matrix3.decompose(matrix)` is called
- **THEN** the rotation SHALL be `0` (the `isNearZero(sx)` guard fires before atan2 is reached, so the atan2 formula change has no effect on this branch)

---

### Requirement: nearEquals documents overflow in subtraction for extreme opposite-sign magnitudes

`nearEquals(a, b)` SHALL document that `Math.abs(a - b)` overflows to `Infinity` when `a` and `b` have opposite signs and magnitudes such that `|a - b| > Number.MAX_VALUE` (~1.7976931348623157e+308). In this case the function returns `false` (correct behavior, since values differing by more than `MAX_VALUE` are certainly not near-equal), but via the overflow path (`Infinity <= epsilon` is false) rather than an actual distance computation. This SHALL be documented as a known benign overflow.

**Source:** `packages/math2d/src/auxiliary/scalar/comparison.ts:30-36`

**Reference:** IEEE 754-2019 Section 7.4 on overflow; Goldberg (1991) Section 1.3.1.

#### Scenario: nearEquals with opposite-sign large magnitudes returns false via overflow

- **GIVEN** `a = 1e308` and `b = -1e308`
- **WHEN** `nearEquals(a, b)` is called
- **THEN** the result SHALL be `false`
- **AND** the intermediate `Math.abs(a - b)` SHALL be `Infinity` (overflow), which correctly fails the `<= epsilon` comparison

#### Scenario: nearEquals with same-sign large magnitudes does not overflow

- **GIVEN** `a = 1e308` and `b = 1e308 - 1e290`
- **WHEN** `nearEquals(a, b)` is called
- **THEN** the intermediate `Math.abs(a - b)` SHALL be `1e290` (no overflow), and the result SHALL be `false` (since `1e290 > EPSILON`)

#### Scenario: nearEquals with identical infinities returns true via fast path

- **GIVEN** `a = Infinity` and `b = Infinity`
- **WHEN** `nearEquals(a, b)` is called
- **THEN** the result SHALL be `true` (the `a === b` fast path fires before subtraction is attempted)

#### Scenario: JSDoc documents the overflow behavior

- **GIVEN** the `nearEquals` JSDoc
- **WHEN** the documentation is reviewed
- **THEN** it SHALL contain a `@remarks` note stating that for `|a - b| > Number.MAX_VALUE` (possible when `a` and `b` have opposite signs), `Math.abs(a - b)` overflows to `Infinity` and the function returns `false` — this is the correct result via a benign overflow path
