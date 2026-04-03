## 1. P1: Remove Unused Constants

- [x] 1.1 Remove `ITERATIVE_TOLERANCE` from `auxiliary/scalar/constants.ts` and its export from `Constants` object
- [x] 1.2 Remove `MAX_SAFE_INTEGER_F64` from `auxiliary/scalar/constants.ts` and its export from `Constants` object
- [x] 1.3 Remove `E` from `auxiliary/scalar/constants.ts` and its export from `Constants` object
- [x] 1.4 Remove `GOLDEN_RATIO` and `GOLDEN_RATIO_CONJUGATE` (and helper `SQRT5`) from `auxiliary/scalar/constants.ts` and their exports from `Constants` object
- [x] 1.5 Remove GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE test cases from `test/auxiliary/scalar/scalar.node.spec.ts` (lines 63-72, imports at lines 19-20)
- [x] 1.6 Verify barrel files (`auxiliary/scalar/index.ts` uses `export *` so no individual removal needed)

## 2. P1: Fix Rotation2.fromMatrix2 Precision

- [x] 2.1 Modify `Rotation2.fromMatrix2` (line 495-498) in `core/rotation2.ts`: replace `atan2(m01,m00)+fromAngle` with `Rotation2.ensureOut(out).set(matrix.m00, matrix.m01)` — `set()` already normalizes via `hypot`
- [x] 2.2 Update `Rotation2.fromMatrix2` tests in `test/core/rotation2.node.spec.ts` to verify improved precision
- [x] 2.3 Add property-based test: `fromMatrix2(fromRotation(angle))` round-trip preserves angle within EPSILON

## 3. P2: Add Vector2.moveTowards

- [x] 3.1 Add static `Vector2.moveTowards(current, target, maxDelta, out?)` method in `core/vector2.ts`
- [x] 3.2 Add instance `Vector2.prototype.moveTowards(target, maxDelta)` method that mutates `this` and returns `this`
- [x] 3.3 Add unit tests for `moveTowards` in `test/core/vector2.node.spec.ts`: basic movement, overshoot clamping, zero delta, same position, negative delta
- [x] 3.4 Export `moveTowards` from Vector2 (should be automatic as class method)

## 4. P2: Add Matrix2.fromAngleScale

- [x] 4.1 Add static `Matrix2.fromAngleScale(angle, scaleX, scaleY, out?)` factory in `core/matrix2.ts` computing `[cos*sx, -sin*sy; sin*sx, cos*sy]` in a single pass
- [x] 4.2 Add unit tests for `fromAngleScale` in `test/core/matrix2.node.spec.ts`: identity, pure rotation, pure scale, combined, decomposition round-trip

## 5. P2: Deprecate sumComponents and Documentation Improvements

- [x] 5.1 Add `@deprecated` JSDoc tag to `Vector2.sumComponents` static method (line 383) AND instance method (line 3340) in `core/vector2.ts`
- [x] 5.2 Add `@see neumaierSum` to `robustSum` JSDoc (line 224) and `@see robustSum` to `neumaierSum` JSDoc (line 256) in `auxiliary/numeric/safety.ts`
- [x] 5.3 Add `@example` to `compensatedProduct` JSDoc (line 294) showing high-precision dot product use case in `auxiliary/numeric/safety.ts`
- [x] ~~5.4 REMOVED — `inRange` and `isInRange` already have `@see` cross-references~~
- [x] 5.4 Add non-finite value limitation note to parse functions in `utils/parse.ts`

## 6. Verification

- [x] 6.1 Run full test suite (`npm run test:unit`) and verify all tests pass
- [x] 6.2 Run lint (`npm run lint`) and verify no new violations (0 errors, warnings are pre-existing)
- [x] 6.3 Verify build succeeds (`npm run build`)
