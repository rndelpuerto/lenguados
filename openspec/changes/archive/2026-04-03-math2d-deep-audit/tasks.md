## 1. P1 — Performance / Hot-Path Fixes

- [x] 1.1 Add private `setDirect(cos, sin)` to Rotation2 with dev-mode assertion `|cos²+sin²-1| < EPSILON` in `core/rotation2.ts`
- [x] 1.2 Refactor Rotation2 static `multiply` to use `setDirect` instead of `set` in `core/rotation2.ts:736`
- [x] 1.3 Refactor Rotation2 static `inverse` to use `setDirect` instead of `set` in `core/rotation2.ts:755`
- [x] 1.4 Refactor Rotation2 static `negate` to use `setDirect` instead of `set` in `core/rotation2.ts:774`
- [x] 1.5 Refactor Rotation2 static `conjugate` to use `setDirect` instead of `set` in `core/rotation2.ts:812`
- [x] 1.6 Refactor Rotation2 static `relative` to use `setDirect` instead of `set` in `core/rotation2.ts:788`
- [x] 1.7 Inline Rotation2 instance `normalize()` to avoid intermediate allocation from `normalizeComponents` in `core/rotation2.ts:1199`
- [x] 1.8 Replace `Complex.sqrt` `pow(0.5)` with direct algebraic formula WITH mandatory branch-cut special cases (C99 Annex G: z=0, imag=0&&real>=0, imag=0&&real<0, general case) in `core/complex.ts:1375`
- [x] 1.9 Replace `Complex.reciprocal` `hypot+squaring` with direct `magnitudeSq` computation in `core/complex.ts:1285-1342`
- [x] 1.10 Inline rotation inverse in Transform2 instance `inverse()`/`inverseUnchecked()` to avoid Rotation2 allocation in `core/transform2.ts:1995,2048`
- [x] 1.11 Fix Transform2 `fromComponents` to copy cos/sin directly when given Rotation2Like (avoid atan2→sinCos roundtrip) in `core/transform2.ts:349`

## 2. P2 — Correctness Fixes (IEEE/Standard Compliance)

- [x] 2.1 Fix `powSafe` NaN^0: swap `exponent === 0` check before NaN check, add comment noting IEEE 754 pow vs powr distinction in `auxiliary/numeric/safety.ts:210-212`

## 3. P2 — DRY Violations

- [x] 3.1 Refactor 9 Matrix2 instance comparison methods to delegate to static counterparts in `core/matrix2.ts`
- [x] 3.2 Merge duplicate imports (`hypot` and `atan2` on lines 27-28) in `core/matrix2.ts`
- [x] 3.3 Refactor 9 Matrix3 instance comparison methods to delegate to static counterparts in `core/matrix3.ts`
- [x] 3.4 Refactor Transform2 static `inverse()` and `inverseSafe()` to delegate to `inverseUnchecked()` after guards in `core/transform2.ts:592-704`
- [x] 3.5 Refactor Transform2 instance `isIdentity()` to delegate to static in `core/transform2.ts:2157`
- [x] 3.6 Refactor `unwrapAngles` and `unwrapAnglesInPlace` to share iteration logic via private helper in `auxiliary/angle/unwrapping.ts`
- [x] 3.7 Have `Vector2.angleTo` delegate to `angleFromVectors` to eliminate duplicated cross/dot/atan2 in `core/vector2.ts:1396`
- [x] 3.8 Refactor Rotation2 `toString` to use `radiansToDegrees` instead of inline `180 / PI` in `core/rotation2.ts:1873`
- [x] 3.9 Make Rotation2 `fromValues` delegate to `fromCS` internally (keep both public per completeness principle) in `core/rotation2.ts:345,547`

## 4. P2 — Static/Instance Symmetry Gaps

- [x] 4.1 Add `Vector2.directionToUnchecked()` instance method in `core/vector2.ts`
- [x] 4.2 Add `Interval.divideSafe(scalar)` instance method in `core/interval.ts`
- [x] 4.3 Add `Interval.divideUnchecked(scalar)` instance method in `core/interval.ts`
- [x] 4.4 Add `Transform2.inverseTransformPointSafe()` instance method in `core/transform2.ts`
- [x] 4.5 Add `Transform2.inverseTransformVectorSafe()` instance method in `core/transform2.ts`

## 5. P3 — Documentation Fixes (Adversarially Validated)

- [x] 5.1 Add `@remarks` to Rotation2 static `clone()` explaining WHY normalization occurs (protects Rotation2Like invariant) in `core/rotation2.ts:595`
- [x] 5.2 Add `@remarks` to Rotation2 `relativeTo` clarifying: "Computes the rotation FROM this TO other, equivalent to Rotation2.relative(this, other)" in `core/rotation2.ts:1442`
- [x] 5.3 Add `@remarks` to Transform2 `transformDirectionCS`/`inverseTransformDirectionCS` explaining the parameter order difference: "Only uses rotation, not position/scale — transform parameter omitted per ISP" in `core/transform2.ts:897,950`
- [x] 5.4 Fix Rotation2 `negated` getter docstring: change `{@link inversed}` to `{@link inverted}` in `core/rotation2.ts:1646`
- [x] 5.5 Fix `clampAngle` JSDoc: change "shortest arc" to "CCW arc from min to max" in `auxiliary/angle/operations.ts:228`
- [x] 5.6 Fix `Vector2.fromObject` JSDoc: remove spurious `@throws` annotation in `core/vector2.ts:317`
- [x] 5.7 Fix Matrix2 `frobeniusNorm` `@remarks`: "Uses Math.sqrt (IEEE 754 deterministic)" in `core/matrix2.ts:1630,2110`
- [x] 5.8 Fix Transform2 static `lerp` `@param t`: "not clamped, allows extrapolation" in `core/transform2.ts:1193`
- [x] 5.9 Fix Rotation2 `fromMatrix2` docstring: remove incorrect "via atan2" claim in `core/rotation2.ts:485-498`
- [x] 5.10 Fix Rotation2 `nearEquals` docstring: clarify angleDifference computed inline in `core/rotation2.ts:995`
- [x] 5.11 Add `@remarks` to `Interval.mod` documenting component-wise semantics in `core/interval.ts:904`
- [x] 5.12 Document `powSafe` 0^negative behavior in `auxiliary/numeric/safety.ts:213`
- [x] 5.13 Document `roundToPlaces` overflow for extreme places in `auxiliary/numeric/rounding.ts:73`
- [x] 5.14 Document `sanitizeNumber` NaN fallback behavior in `auxiliary/numeric/safety.ts:415`
- [x] 5.15 Document `ieeeBuffer` call-graph invariant (non-reentrancy) in `deterministic/deterministic-kernels.ts:183`
- [x] 5.16 Document `expSafe` overflow return semantics in `deterministic/deterministic-kernels.ts:892`
- [x] 5.17 Add sign-loss warning to `Transform2.fromMatrix3` JSDoc in `core/transform2.ts:301`
- [x] 5.18 Add `isAngleBetween` JSDoc note about full-circle case in `auxiliary/angle/operations.ts:180`
- [x] 5.19 Add `@see snapToGrid` to `roundToMultiple` documenting equivalence in `auxiliary/numeric/rounding.ts:96`

## 6. P3 — Minor Code Quality

- [x] 6.1 Fix Matrix2 `inverted` getter: replace `divideSafe(1, det)` with `1 / det` after guard in `core/matrix2.ts:2238`
- [x] 6.2 Move Matrix2 `trunc()` instance method next to `floor/ceil/round` in `core/matrix2.ts`
- [x] 6.3 Move Matrix2 `multiplyScalar` instance method to Arithmetic section in `core/matrix2.ts`
- [x] 6.4 Fix Complex `fromObject` parameter type from `ComplexLike` to `ReadonlyComplexLike` in `core/complex.ts:378`
- [x] 6.5 Add `assertFinite(angle)` to Complex `setFromPolar` in `core/complex.ts:1562`
- [x] 6.6 Fix Complex duplicate section header at `core/complex.ts:2340,2377`
- [x] 6.7 Remove unused `label` parameter from Transform2 `extractVector` in `core/transform2.ts:165`
- [x] 6.8 Add `remapSafe` boundary early-returns matching `remap` in `auxiliary/scalar/arithmetic.ts:161`

## 7. P4 — New Operations (Auxiliary Layer)

- [x] 7.1 Add `flushDenormal(value)` to `auxiliary/numeric/guards.ts`
- [x] 7.2 Add `ceilPowerOfTwo(value)` to `auxiliary/numeric/rounding.ts`
- [x] 7.3 Add `floorPowerOfTwo(value)` to `auxiliary/numeric/rounding.ts`

## 8. P4 — New Operations (Core Types)

- [x] 8.1 Add `Vector2.chebyshevLength(v)` static + `chebyshevLength()` instance to `core/vector2.ts` (completes L1/L2/L-inf norm family)
- [x] 8.2 Add `Vector2.chebyshevDistance(a, b)` static + `chebyshevDistanceTo(v)` instance to `core/vector2.ts`
- [x] 8.3 Add `Complex.fromRotation2(rotation, out?)` factory to `core/complex.ts`
- [x] 8.4 Add `Rotation2.angleBetween(a, b)` static method (allocation-free) to `core/rotation2.ts`
- [x] 8.5 Add `Matrix2.fromDiagonal(v)` factory to `core/matrix2.ts`
- [x] 8.6 Add `Matrix2.fromReflection(axis)` factory — Householder I-2nnᵀ (DEFINITIVE: Wikipedia, PlanetMath) to `core/matrix2.ts`
- [x] 8.7 Add `Matrix2.solveLinearSystem(matrix, b)` — Cramer's rule (DEFINITIVE: matches Box2D b2Solve22) to `core/matrix2.ts`
- [x] 8.8 Add `Interval.distance(a, b)` static + `distanceTo(other)` instance to `core/interval.ts`
- [x] 8.9 Add `Interval.enclosing(interval, value, out?)` static + `enclose(value)` instance to `core/interval.ts`
- [x] 8.10 Add `Matrix3.inverseAffine` / `inverseAffineSafe` / `inverseAffineUnchecked` optimized for 2D affine (exploits [0,0,1] bottom row) in `core/matrix3.ts`
- [x] 8.11 Add `Matrix3.fromTransform2Like(transform)` factory accepting `ReadonlyTransform2Like` in `core/matrix3.ts`
- [x] 8.12 Add `Matrix3.setTranslation(translation)` instance mutator in `core/matrix3.ts`

## 9. P4 — API Consistency

- [x] 9.1 Validate or document Interval `copy()` trust assumption in `core/interval.ts:1499`

## 10. P5 — Infrastructure Improvements (Optional)

- [x] 10.1 ~~Improve `acos`/`asin` precision~~ — **NEVER IMPLEMENT** (decision final, documented in design.md D10-acos-FINAL). The 1-x\*x cancellation is a red herring: inputs come from dot products that already lost the same precision. Improvement is 1.17× for realistic inputs, producing 0.016 nanopixel worst-case error. L0 determinism risk not justified.
- [x] 10.2 Add `ReadonlySinCos` interface to `types/index.ts` — completes the Readonly pattern (was the only value type without Readonly variant)
- [x] 10.3 ~~Add `utils/index.ts` barrel~~ — **NEVER IMPLEMENT** (decision final). Utils intentionally excluded from main barrel for tree-shaking. A barrel would encourage importing all ~2600 lines when only one module is needed, undermining the bundle-size design that was deliberately architected.
- [x] 10.4 Narrow `sign` return type to `-1 | 0 | 1` in `auxiliary/scalar/arithmetic.ts:52`

## 11. Testing & Validation

- [x] 11.1 Run full test suite after P1 performance refactors to verify behavioral equivalence
- [x] 11.2 Run full test suite after P2 fixes to verify no regressions
- [x] 11.3 Run full test suite after P3 DRY refactors to verify behavioral equivalence
- [x] 11.4 Add tests for all new P4 operations (chebyshev, fromDiagonal, fromReflection, solveLinearSystem, Interval.distance, Interval.enclosing, Matrix3.inverseAffine, etc.)
- [x] 11.5 Add property-based tests for Complex.sqrt: verify `sqrt(z)^2 ≈ z` including branch-cut cases (negative real axis, zero imaginary)
- [x] 11.6 Verify determinism is preserved: run cross-platform comparison tests after kernel changes
- [x] 11.7 Verify bundle size has not regressed significantly after all additions

## Deferred (Ratified Historical Decisions)

The following were evaluated and explicitly deferred per ratified prior specs:

- ~~`moveTowards(current, target, maxDelta)`~~ — "game engine convenience" (glm, nalgebra, Eigen lack it)
- ~~`moveTowardsAngle(current, target, maxDelta)`~~ — same rationale
- ~~`Rotation2.fromDegrees(degrees)`~~ — radians-only convention
- ~~`sinCosNormalized` removal~~ — contradicts completeness principle; zero cost, tree-shakeable
- ~~`Matrix2.transformVectorTranspose`~~ — trivially inlined for 2x2; constraint solving is downstream concern
- ~~Transform2 direction CS parameter change~~ — ISP violation; documentation fix instead
- ~~Rotation2 `relativeTo` rename~~ — ambiguous naming ≠ wrong math; documentation fix instead
- ~~Rotation2 static `clone()` behavior change~~ — normalization protects Rotation2Like invariant; documentation fix instead
