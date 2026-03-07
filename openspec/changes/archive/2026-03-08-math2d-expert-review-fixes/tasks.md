## 1. Deterministic Kernel Fixes (P0 — Critical/High)

- [x] 1.1 Fix `pow2` subnormal handling: add two-step scaling for exponents ≤ -1022 (`pow2(-1022) * pow2(n + 1022)`) in `deterministic-kernels.ts:179-185`
- [x] 1.2 Write tests for `pow2` at boundaries: n = -1022 (smallest normal), n = -1023 (first subnormal), n = -1074 (smallest subnormal 5e-324), n = 1023 (largest)
- [x] 1.3 Fix `atan2` signed-zero handling: add `Object.is` detection for `-0` in BOTH `y` and `x` parameters (`deterministic-kernels.ts:576-578`), covering all 8 IEEE 754 Table 9.1 signed-zero cases. Note: `-0 >= 0` is `true` in JS, so `x=-0` also needs explicit detection.
- [x] 1.4 Write tests for all 8 signed-zero combinations: `atan2(+0, +0)→+0`, `atan2(+0, -0)→+PI`, `atan2(-0, +0)→-0`, `atan2(-0, -0)→-PI`, `atan2(+0, x>0)→+0`, `atan2(-0, x>0)→-0`, `atan2(+0, x<0)→+PI`, `atan2(-0, x<0)→-PI`
- [x] 1.5 Add `log` sqrt(2) boundary adjustment: when `1+f < sqrt(2)/2`, multiply `f` by 2 and decrement `k` per fdlibm `e_log.c` (`deterministic-kernels.ts:700-708`)
- [x] 1.6 Write precision tests for `log` near powers of 2 and near sqrt(2) boundary, comparing against known values
- [x] 1.7 Document `sinCos` range reduction precision boundary at `|x| > 2^20·PI` with `@remarks` JSDoc tag
- [x] 1.8 Rename shared `sqrtBuffer`/`sqrtView` to `ieeeBuffer`/`ieeeView` and add non-reentrancy `@internal` doc
- [x] 1.9 Rename kernel-level `logSafe` to `logKernelSafe` to eliminate naming collision with `auxiliary/numeric/safety.ts:logSafe`
- [x] 1.10 Add `config` to the named exports in `src/index.ts` and to the `DeterministicKernels` namespace object
- [x] 1.11 Fix `hypot` JSDoc to remove false claim about "uses non-deterministic sin/cos internally"
- [x] 1.12 Add explicit `if (x !== x) return NaN` guard at top of `acos` and `asin` functions
- [x] 1.13 Run full deterministic kernel test suite and verify all existing tests pass with the new changes

## 2. Angle Computation Accuracy (P0/P1 — Critical/High)

- [x] 2.1 Fix `lerpAngle`: change `return normalizeRadians(diff * t) + from` to `return from + angleDifference(from, to) * t` in `interpolation.ts:34-37`
- [x] 2.2 Write tests: `lerpAngle(0, PI/2, 0.5)` SHALL return `PI/4`, `lerpAngle(0, -PI/2, 0.5)` SHALL return `-PI/4`. Note: `lerpAngle(0, PI, 0.5)` returns `-PI/2` (NOT `PI/2`) — this is inherent to the `[-PI, PI)` convention and is correct behavior
- [x] 2.3 Write extrapolation tests: `lerpAngle(0, PI/2, 2)` SHALL return `PI` (not wrapped), `lerpAngle(0, PI/2, -1)` SHALL return `-PI/2`
- [x] 2.4 Update `lerpAngle` JSDoc to accurately describe extrapolation behavior and remove "Output is normalized" remark
- [x] 2.5 Document `angleDifference` anti-symmetry limitation at PI boundary with `@remarks` noting `angleDifference(0, PI) = -PI` and `angleDifference(PI, 0) = -PI` (both return same value due to half-open [-PI, PI) range)
- [x] 2.6 Fix `smoothStepAngle`: remove redundant `saturate(t)` call, pass `t` directly to `smoothStep(0, 1, t)` which clamps internally
- [x] 2.7 Update `Rotation2.lerp` JSDoc: change "allows extrapolation" to accurately describe that extrapolation is linear in angle space and may wrap for large `|t|`
- [x] 2.8 Document `isAngleBetween` zero-arc semantics: add `@remarks` explaining that `start === end` represents a zero-arc (point), not a full circle
- [x] 2.9 Document `clampAngle` return range: add `@returns` tag specifying output is in `[-PI, PI)` range
- [x] 2.10 Document `AngleUnwrapper` precision drift: add `@remarks` warning about precision degradation for long sequences (>100K samples) and recommend periodic re-anchoring
- [x] 2.11 Add `AngleUnwrapper.initialized` boolean getter to distinguish uninitialized state from "initialized at 0"
- [x] 2.12 Document `normalizeRadians` precision loss for very large angles (>1e6 radians) with `@remarks`
- [x] 2.13 Optimize `angleFromVectors`: replace two-`atan2` formulation with single `atan2(x1*y2 - y1*x2, x1*x2 + y1*y2)` cross/dot formula
- [x] 2.14 Run angle module test suite and verify all existing tests pass

## 3. Transform2 Inverse Fix (P0 — Critical)

- [x] 3.1 Fix `Transform2.inverse` (static, `transform2.ts:487-509`): change position computation order from `R⁻¹ · S⁻¹ · t` to `S⁻¹ · R⁻¹ · t` — apply inverse rotation first, then inverse scale
- [x] 3.2 Fix `Transform2.inverse` instance method (`transform2.ts:1635-1656`) with same order correction
- [x] 3.3 Write test: Transform with `pos=(2,0)`, `rot=90°`, `scale=(2,1)` — verify `inverse(t).position` equals `(0,2)` (corrected formula) not `(0,1)` (old broken formula). Note: full point recovery via `transformPoint(inverse(t), q)` is approximate for non-uniform scale; use `inverseTransformPoint` for exact recovery.
- [x] 3.4 Write property-based test with fast-check: for random uniform-scale transforms, `inverse(transform).transformPoint(transform.transformPoint(p)) ≈ p`
- [x] 3.5 Add prominent `@remarks` to `inverse`, `inverseSafe`, and `inverseUnchecked` documenting: (a) inversion is an APPROXIMATION for non-uniform scale (both translation and linear part), (b) recommend `inverseTransformPoint` for exact point transformation, (c) recommend `Matrix3.inverse` via `toMatrix3` for exact full inverse. Reference the common SRT limitation pattern documented by engines such as DigitalRune.
- [x] 3.6 Update existing inverse tests that may assert the old (incorrect) behavior

## 4. Complex Division Robustness (P1 — High)

- [x] 4.1 Implement Smith's algorithm as a private helper function `complexDivideSmith(aRe, aIm, bRe, bIm)` in `complex.ts`, branching on `|bIm| <= |bRe|` vs `|bIm| > |bRe|`
- [x] 4.2 Add Baudin-Smith pre-scaling guard: when either component is below `Number.MIN_VALUE * 2`, pre-scale by a power of 2 before division
- [x] 4.3 Refactor `Complex.divide` (strict) to use `complexDivideSmith`, preserving the existing `isNearZero(magnitudeSq)` guard
- [x] 4.4 Refactor `Complex.divideSafe` to use `complexDivideSmith` with safe fallback
- [x] 4.5 Refactor `Complex.divideUnchecked` to use `complexDivideSmith` without guards
- [x] 4.6 Refactor all 3 instance division methods to delegate to their static counterparts
- [x] 4.7 Fix `Complex.reciprocal` threshold: change `isNearZero(magSq)` to `isNearZero(magnitude)` — check linear magnitude against EPSILON, not squared magnitude
- [x] 4.8 Fix `Complex.reciprocalSafe` with same threshold correction
- [x] 4.9 Align `Complex.reciprocated` getter to delegate to `Complex.reciprocalSafe(this)` for consistency
- [x] 4.10 Write overflow tests: `Complex(1,0).divide(Complex(1e200, 1e200))` SHALL return `~Complex(5e-201, -5e-201)`
- [x] 4.11 Write underflow tests: `Complex(1,1).divide(Complex(1e-200, 1e-200))` SHALL return `~Complex(1e200, 0)`
- [x] 4.12 Write normal-range regression tests to ensure identical results for typical inputs
- [x] 4.13 Write determinism test with fast-check: verify bit-identical results for 10,000 random complex pairs
- [x] 4.14 Write reciprocal threshold test: `Complex.reciprocal(Complex(1e-5, 0))` SHALL return `Complex(1e5, 0)` (not throw)

## 5. Safe Function Contract Enforcement (P1 — High)

- [x] 5.1 Fix `powSafe`: change `if (base === 0) return 0` to `if (base === 0) return exponent >= 0 ? 0 : 0` (return safe fallback 0 for all zero-base cases, but fix the NaN propagation issue separately)
- [x] 5.2 Fix `powSafe` NaN propagation: add `if (base !== base) return NaN` before the `base === 0` check
- [x] 5.3 Fix `lerpSafe`: change formula from `a + (b - a) * t` to `a * (1 - t) + b * t` (distributive form preventing overflow)
- [x] 5.4 Fix `logSafe`: add base validation — `if (base <= 0 || base === 1 || !Number.isFinite(base)) return 0`
- [x] 5.5 Fix `expSafe`: change NaN handling — `if (x !== x) return NaN` instead of returning 1 (the "neutral element")
- [x] 5.6 Fix `sanitizeNumber`: apply `clamp(fallback, min, max)` to the fallback value when value is non-finite
- [x] 5.7 Fix `ensureFinite`: validate that fallback is finite — `if (!Number.isFinite(fallback)) fallback = 0`
- [x] 5.8 Fix `divideSafe` JSDoc: change example from `divideSafe(10, 0.0000000001) // 0` to `divideSafe(10, 1e-11) // 0`
- [x] 5.9 Fix `reciprocalSafe` JSDoc: change example from `reciprocalSafe(0.00001) // 0` to `reciprocalSafe(1e-11) // 0`
- [x] 5.10 Fix `Interval.reciprocal`: replace `divideSafe(1, interval.min)` with direct `1 / interval.min` after zero-containment guard
- [x] 5.11 Write tests for all fixed functions with finite inputs verifying finite outputs
- [x] 5.12 Write tests for NaN propagation: `powSafe(NaN, 2)` → NaN, `expSafe(NaN)` → NaN
- [x] 5.13 Write overflow test: `lerpSafe(-1e308, 1e308, 0.3)` → `~-4e307` (not Infinity)

## 6. Core Types API Corrections (P1–P2)

- [x] 6.1 Fix `Complex.pow`: add zero-magnitude guard — `if (mag === 0 && exponent < 0) throw RangeError` in strict, return `Complex(0, 0)` in safe
- [x] 6.2 Fix `Complex.slerp`: add zero-magnitude guards matching `Vector2.slerp` — if either input has near-zero magnitude, fall back to component-wise lerp
- [x] 6.3 Fix `Complex.lerp` JSDoc: change `@param t - Interpolation factor [0, 1], clamped` to `@param t - Interpolation factor (not clamped, allows extrapolation)`
- [x] 6.4 Fix `Rotation2.fromComplex` JSDoc: remove `@throws {RangeError}` tag, add remark that zero-magnitude input produces identity rotation
- [x] 6.5 Fix Matrix2 doc header column membership: change "Column 0: m00, m10" to "Column 0: m00, m01" (and Column 1 accordingly)
- [x] 6.6 Fix Matrix3 doc header column membership: same correction as Matrix2
- [x] 6.7 Add `Matrix3.ortho` zero-guard: add `if (isNearZero(width) || isNearZero(height)) throw RangeError` to strict variant
- [x] 6.8 Add `Matrix3.orthoSafe` that returns identity for degenerate bounds
- [x] 6.9 Document `Matrix3.isOrthogonal` scope: add `@remarks` clarifying it checks full 3x3 orthogonality, and that affine matrices with translation will fail; suggest checking the 2x2 linear part directly for affine use cases
- [x] 6.10 Fix `getScale()` in Matrix2 and Matrix3: adjust sy by determinant sign to match `decompose()` convention, OR rename to `getColumnLengths()` and document always-positive behavior
- [x] 6.11 Fix multiply example comments in Matrix2 (`matrix2.ts:446`) and Matrix3 (`matrix3.ts:729`): reverse transformation order description
- [x] 6.12 Document `Transform2.inverse` non-uniform scale limitation with `@remarks` (after Task 3.5 fix)
- [x] 6.13 Document `applyMatrix3` perspective division: add `@remarks` noting that `w ≈ 0` collapses point to origin via `divideSafe`
- [x] 6.14 Document `Rotation2` constructor: add `@remarks` stating it does NOT normalize — use `Rotation2.fromAngle()` or call `.normalize()` if needed
- [x] 6.15 Document `Rotation2.multiply` drift: add `@remarks` recommending periodic `.normalize()` calls in physics loops (e.g., every N frames)
- [x] 6.16 Fix `Vector2.instance.limit`: add `&& lengthSq > 0` guard matching the static method
- [x] 6.17 Remove orphaned JSDoc blocks: Matrix2 lines ~1169-1176 and ~2780-2785, Matrix3 lines ~1374 and ~3747-3756
- [x] 6.18 Document Matrix lerp: add `@remarks` to Matrix2.lerp and Matrix3.lerp noting that component-wise lerp between rotation matrices does not produce valid rotation matrices
- [x] 6.19 Fix `Transform2.toObject()`: change `rotation: this.rotation` to `rotation: this.rotation.toObject()` for consistency with position and scale
- [x] 6.20 Document `Rotation2.NEGATIVE_QUARTER` and `THREE_QUARTER_TURN` as aliases in their JSDoc with `@see` cross-references
- [x] 6.21 Write tests for all code changes in this section

## 7. Numerical Foundations Refinement (P2)

- [x] 7.1 Fix `inverseLerp` strict variant: change `isNearZero(denominator)` to `denominator === 0`
- [x] 7.2 Fix `inverseLerpSafe`: change threshold from `isNearZero(denominator)` (EPSILON = 1e-10) to `Math.abs(denominator) < Number.EPSILON` (~2.2e-16)
- [x] 7.3 Fix `Interval.divide` strict: change to `scalar === 0` guard
- [x] 7.4 Fix `Interval.divideSafe`: change to `Math.abs(scalar) < Number.EPSILON` threshold
- [x] 7.5 Add `lerp` endpoint guard: `if (t === 1) return b;` only (strict equality). NO guard for `t===0` (naturally exact). NO `t<=0`/`t>=1` guards (would break extrapolation). Per C++20 P0811R3 and Luau.
- [x] 7.6 Add `lerpClamped` endpoint guards: `if (t >= 1) return b; if (t <= 0) return a;` (clamping variant, no extrapolation)
- [x] 7.7 Add `remap` endpoint guards: `if (value <= inMin) return outMin; if (value >= inMax) return outMax;`
- [x] 7.8 Document `compensatedProduct` valid input range: add `@remarks` noting Veltkamp splitting overflows for `|a| > ~1.34e300`
- [x] 7.9 Document `remap` precision loss for large-magnitude operands with `@remarks`
- [x] 7.10 Simplify `Matrix3.decompose` rotation extraction: change `atan2(m01/sx, m00/sx)` to `atan2(m01, m00)` (sx normalization is redundant since `atan2(ky, kx) = atan2(y, x)` for k > 0)
- [x] 7.11 Document `nearEquals` overflow: add `@remarks` noting `Math.abs(a - b)` overflows for opposite-sign large magnitudes but correctly returns false
- [x] 7.12 Write tests: `inverseLerp(0, 1e-10, 5e-11)` SHALL return `0.5` (not throw), `lerp(0.1, 0.3, 1.0)` SHALL return exactly `0.3`, `lerp(0, 10, 2.0)` SHALL return `20` (extrapolation preserved), `lerp(a, b, 0)` SHALL return exactly `a` (naturally exact, no guard)

## 8. Edge Case Coverage Expansion (P2)

- [x] 8.1 Add zero-vector guard to `isParallel` and `isPerpendicular`: return false if either vector is near-zero
- [x] 8.2 Write NaN behavior tests for scalar functions: `clamp(5, NaN, 10)`, `sign(NaN)`, `step(NaN, 5)`, `loop(Infinity, 0, 10)`, `flooredMod(NaN, 3)`
- [x] 8.3 Write NaN behavior tests for comparison functions: `lessThan(NaN, 5)`, `greaterThan(NaN, 5)`, `inRange(NaN, 0, 1)`, `anglesNearEqual(NaN, 0)`
- [x] 8.4 Write negative-zero tests: `sign(-0)`, `Complex.toString(Complex(1, -0))`, `Interval.scale([1,2], -0)`
- [x] 8.5 Write overflow/extreme value tests: `roundToPlaces(x, 400)`, `roundToPowerOfTwo(Infinity)`, `snapToGrid(5, NaN)`, `fract(NaN)`
- [x] 8.6 Write `Complex.exp` overflow test: `Complex.exp(Complex(710, 0))` behavior documented
- [x] 8.7 Write degenerate range tests: `smoothStep` with `edge0 === edge1`, `clamp` with `min > max`, `inRange` with `min > max`
- [x] 8.8 Write type guard NaN tests: `isVector2Like({x: NaN, y: NaN})` returns true (structural check only)
- [x] 8.9 Fix `assertRange` NaN: change condition to `if (value !== value || value < min || value > max)` to catch NaN
- [x] 8.10 Add `@remarks` documentation to ~15 functions documenting their NaN/Infinity behavior

## 9. Serialization & Parse Robustness (P2)

- [x] 9.1 Update `parseComplex` math notation regex to support scientific notation: change `[\d.]+` to `[\d.]+(?:[eE][+-]?\d+)?`
- [x] 9.2 Update `parseComplex` pure imaginary regex similarly
- [x] 9.3 Fix all `format*` functions JSON output for non-finite values: when `format === 'json'`, use `JSON.stringify` or substitute `null` for NaN/Infinity/-Infinity
- [x] 9.4 Fix `parseInterval` JSON branch: only catch `SyntaxError` from `JSON.parse`, re-throw validation errors (min > max)
- [x] 9.5 Tighten `parseComplex` decimal regex: reject multiple decimal points like "1.2.3"
- [x] 9.6 Fix `formatComplex` negative-zero detection: use `Object.is(c.imag, -0)` to show "-" sign for `-0` imaginary in math format
- [x] 9.7 Document parse bracket-matching flexibility: add `@remarks` noting that mismatched brackets (e.g., "(1,2]") are accepted
- [x] 9.8 Write tests for scientific notation parsing: `parseComplex("1e5+2e3i")`, `parseComplex("1e-5i")`
- [x] 9.9 Write tests for JSON validity: verify `JSON.parse(formatVector2({x: NaN, y: 0}, 'json'))` does not throw (after fix)
- [x] 9.10 Write round-trip tests for all fixed parse/format paths

## 10. Performance Optimizations (P3)

- [x] 10.1 Fix `unwrapAngles`: replace `new Array<number>(n)` with `new Float64Array(n)` or `Array.from({length: n}, () => 0)` to avoid V8 holey array
- [x] 10.2 Fix `Matrix3.inverseSafe`: inline cofactor computation and reuse determinant, eliminating the double computation with `Matrix3.determinant` + `Matrix3.inverseUnchecked`
- [x] 10.3 Fix `Matrix3.inverseSafe` instance method with same optimization
- [x] 10.4 Fix `Matrix3.fromArray`: read elements directly from source array, remove intermediate `new Array<number>(9)` allocation
- [x] 10.5 Fix `Rotation2.set()`: normalize inline without `normalizeComponents()` intermediate `{cos, sin}` object allocation
- [x] 10.6 Fix `Vector2.normalize` instance: use `this.scale(1 / length)` instead of `this.divideScalar(length)` to skip redundant isNearZero check
- [x] 10.7 Fix `Rotation2.fromVector2`: use `Math.sqrt(magnitudeSquared)` after the isNearZero guard instead of calling `hypot(x, y)` which recomputes the squared sum
- [x] 10.8 Fix `Rotation2.fromVectors2`: inline relative rotation computation using cross/dot products instead of allocating two temporary Rotation2 objects
- [x] 10.9 Fix `Complex.fromPolar`: remove redundant `normalizeRadians(angle)` call before `sinCos()` (sin/cos are periodic)
- [x] 10.10 Optimize `Rotation2.nearEquals` slow path: compute angle difference via cross/dot of rotation components instead of two `atan2` calls
- [x] 10.11 Fix `GOLDEN_RATIO` and `GOLDEN_RATIO_CONJUGATE`: compute `Math.sqrt(5)` once and share
- [x] 10.12 Fix `Vector2.smoothStep` and `Complex.smoothStep`: remove outer `saturate(t)` since `smoothStep(0, 1, t)` clamps internally
- [x] 10.13 Verify no performance regressions with benchmark suite for hot-path operations

## 11. API Consistency & Triality Completion (P3)

- [x] 11.1 Fix `compare` NaN handling: return `1` when `a` is NaN (sort NaN after everything), return `-1` when `b` is NaN, return `0` when both NaN
- [x] 11.2 Add `floorDivide` strict variant that throws RangeError for zero divisor
- [x] 11.3 Add `floorDivideSafe` that returns 0 for zero divisor
- [x] 11.4 Rename existing `floorDivide` to `floorDivideUnchecked` and add `floorDivide` as the strict variant
- [x] 11.5 Fix `Vector2.isUnit` vs `Complex.isUnit` inconsistency: standardize on squared-magnitude criterion `|magnitudeSq - 1| < epsilon` for both types (avoids sqrt in Vector2)
- [x] 11.6 Align `Complex.reciprocated` getter: add JSDoc documenting it behaves like `reciprocalSafe`, fix `-0` imaginary by using `this.imag === 0 ? 0 : -this.imag * invMagSq`
- [x] 11.7 Add epsilon non-negative validation to `nearEquals`, `isNearZero`, `isNearOne`, `lessThan`, `greaterThan`, `inRange`, `compare` matching `relativeEquals` pattern
- [x] 11.8 Fix `robustSum` and `neumaierSum` parameter type from `number[]` to `readonly number[]`
- [x] 11.9 Add cross-reference `@see` JSDoc between `Rotation2.NEGATIVE_QUARTER` and `Rotation2.THREE_QUARTER_TURN`
- [x] 11.10 Document `Interval.hull` overload: add `@remarks` clarifying dual-purpose `second` parameter behavior
- [x] 11.11 Add `Object.freeze(Constants)` for runtime immutability of the Constants namespace object
- [x] 11.12 Fix `wrapping.ts` module-level JSDoc: remove references to `truncatedMod`, `mirror`, `repeat` (functions don't exist)
- [x] 11.13 Fix `Vector2.fromAngle`: add `assertFinite(radius, 'radius')` to match existing `assertFinite(angle)` validation
- [x] 11.14 Add bounds checking to instance `setFromArray` methods across Vector2, Complex, Matrix2, Matrix3: validate `offset + ELEMENT_COUNT <= array.length`
- [x] 11.15 Write tests for all API consistency changes

## 12. Random Source Quality (P3)

- [x] 12.1 Implement xoshiro128++ algorithm as internal function using 32-bit integer operations only (4 × uint32 state)
- [x] 12.2 Implement SplitMix32 seed expansion function per Blackman & Vigna recommendation (for initializing 128-bit state from a single seed)
- [x] 12.3 Replace `SeededRandomSource.next()` LCG implementation with xoshiro128++ core
- [x] 12.4 Update `SeededRandomSource.seed()` to use SplitMix32 expansion for 128-bit state initialization
- [x] 12.5 Fix `nextInt` modulo bias: implement Lemire's rejection sampling — `reject = (2^32 % max)`, retry while raw < reject
- [x] 12.6 Add `nextInt` parameter validation: assert max is positive integer, throw TypeError for `max <= 0`, NaN, or non-integer
- [x] 12.7 Fix default seed collision: use `performance.now() * 1000 | 0` with `Date.now()` fallback for sub-millisecond uniqueness
- [x] 12.8 Fix `randomOnTriangle` degenerate: add `if (perimeter === 0) return out.set(a.x, a.y)` guard for zero-perimeter triangles
- [x] 12.9 Fix `randomTransform2`: add `out.scale.set(1, 1)` to explicitly reset scale to identity
- [x] 12.10 Add state serialization: `SeededRandomSource.getState()` → `[s0, s1, s2, s3]` and `restoreState(state)` for save/load
- [x] 12.11 Write statistical uniformity tests: chi-squared test for `nextInt(3)` and `nextInt(256)` over 100K samples
- [x] 12.12 Write determinism tests: two instances with same seed produce identical sequences of 10K values
- [x] 12.13 Write backward-compatibility test: `MathRandomSource` behavior unchanged

## 13. Final Verification & Release Preparation

- [x] 13.1 Run `npm run lint` — fix any lint errors introduced by changes
- [x] 13.2 Run `npm run test:unit` — verify all existing and new tests pass
- [x] 13.3 Run `npm run build` — verify production build succeeds
- [x] 13.4 Run `npm run dist` — verify distribution bundles generate correctly
- [x] 13.5 Verify tree-shaking: assertions are eliminated in production build, bundle size increase is < 2KB
- [x] 13.6 Update CHANGELOG.md with breaking changes: Transform2.inverse, compare(NaN), Complex division, powSafe(0, -n)
- [x] 13.7 Verify all 4 breaking changes are documented with migration guidance
