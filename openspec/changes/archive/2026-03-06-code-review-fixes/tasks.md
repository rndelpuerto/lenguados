## 1. Spec Violations — Epsilon Consistency (H1)

- [x] 1.1 Change `Vector2.getLengthAndNormalize()` to use `isNearZero(lengthSq)` instead of `lengthSq < EPSILON * EPSILON`
- [x] 1.2 Add test verifying `getLengthAndNormalize` and `normalizeSafe` agree on zero-detection boundary (vector with magnitudeSq between 1e-20 and 1e-10)

## 2. Spec Violations — Missing GOLDEN_RATIO (M3)

- [x] 2.1 Add `GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2` export to `auxiliary/scalar/constants.ts` with JSDoc
- [x] 2.2 Add `GOLDEN_RATIO` to the `Constants` aggregated export object
- [x] 2.3 Add test for `GOLDEN_RATIO` verifying value and relationship to `GOLDEN_RATIO_CONJUGATE` (phi \* conjugate = 1)

## 3. Overflow-Safe Normalization (H3)

- [x] 3.1 Change `Vector2.normalize()` to use `hypot(v.x, v.y)` instead of `sqrtSafe(magnitudeSq)`
- [x] 3.2 Change `Vector2.normalizeSafe()` to use `hypot(v.x, v.y)` instead of `sqrtSafe(magnitudeSq)`
- [x] 3.3 Change `Complex.normalize()` to use `hypot(real, imag)` instead of `Math.sqrt(magnitudeSq)` (if not already) — already uses hypot via Complex.magnitude()
- [x] 3.4 Change `Complex.normalizeSafe()` to use `hypot(real, imag)` instead of `Math.sqrt(magnitudeSq)` — already uses hypot via Complex.magnitude()
- [x] 3.5 Verify `normalizeUnchecked()` on both types keeps `Math.sqrt` (per design D1) — confirmed both use Math.sqrt
- [x] 3.6 Add tests for Vector2.normalize with extreme values (1e200, 1e-200) verifying finite results
- [x] 3.7 Add tests for Complex.normalize with extreme values verifying finite results

## 4. Misleading Comment in Rotation2.set() (H2)

- [x] 4.1 Update `Rotation2.set()` comment from "Pure math: no assertions - direct assignment" to "Normalizes to maintain unit-length invariant"

## 5. Dev-Mode Assertion for projectOnUnit (M1)

- [x] 5.1 Add dev-mode assertion in `Vector2.projectOnUnit()` checking `isNearZero(magnitudeSq(unitAxis) - 1)` with descriptive error message
- [x] 5.2 Add test verifying assertion fires in dev mode when non-unit axis is passed

## 6. Double Normalization in Rotation2.fromComplex (M2)

- [x] 6.1 Refactor `Rotation2.fromComplex()` to directly assign cos/sin then call `normalize()` once, bypassing `set()` double normalization
- [x] 6.2 Add `@throws {RangeError}` JSDoc to `Rotation2.fromComplex()` documenting zero-magnitude rejection
- [x] 6.3 Verify existing tests still pass after refactor

## 7. Test Tolerance Unification (M4)

- [x] 7.1 Standardize `DIGITS = 10` in `test/core/vector2.node.spec.ts` and fix any failing assertions
- [x] 7.2 Standardize `DIGITS = 10` in `test/core/complex.node.spec.ts` and fix any failing assertions
- [x] 7.3 Standardize `DIGITS = 10` in `test/core/matrix2.node.spec.ts` and fix any failing assertions
- [x] 7.4 Standardize `DIGITS = 10` in `test/core/matrix3.node.spec.ts` and fix any failing assertions
- [x] 7.5 Standardize `DIGITS = 10` in `test/core/rotation2.node.spec.ts` and fix any failing assertions
- [x] 7.6 Standardize `DIGITS = 10` in `test/core/interval.node.spec.ts` and fix any failing assertions
- [x] 7.7 Standardize `DIGITS = 10` in `test/core/transform2.node.spec.ts` and fix any failing assertions
- [x] 7.8 Verify deterministic kernel tests keep `DIGITS = 14` (justified: fdlibm guarantees ~15 digits)
- [x] 7.9 Add comment in each test file explaining the DIGITS choice

## 8. Documentation Fixes (L1, L4)

- [x] 8.1 Add JSDoc `@remarks` to `Complex.apply()` documenting zero-magnitude behavior (returns unrotated vector)
- [x] 8.2 Change `Matrix3.transformPoint` w-check from `isNearZero(w - 1)` to `scalarNearEquals(w, 1)` for style consistency

## 9. Integration Verification

- [x] 9.1 Run full test suite (`npm run test:unit`) — all 2887 tests pass (41 suites)
- [x] 9.2 Run lint (`npm run lint`) — no new violations (35 pre-existing errors in archived openspec benchmark, unrelated)
- [x] 9.3 Build all packages (`npm run build`) — no errors
- [x] 9.4 Verify coverage thresholds still met (90% statements/lines/functions, 50% branches)
