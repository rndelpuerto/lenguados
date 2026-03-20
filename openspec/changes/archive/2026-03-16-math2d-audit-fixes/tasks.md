## 1. Bug Fix — Complex.slerp instance (P0)

- [x] 1.1 In `complex.ts` instance `slerp()` (~L2207), add zero-magnitude guard: `if (isNearZero(mag1) || isNearZero(mag2)) { return this.lerp(other, t); }` after computing mag1 and mag2, before computing angles
- [x] 1.2 Add test in `test/core/complex.node.spec.ts`: instance slerp with zero-magnitude `this` falls back to lerp
- [x] 1.3 Add test: instance slerp with zero-magnitude `other` falls back to lerp
- [x] 1.4 Add test: static and instance slerp produce matching results for both normal and zero-magnitude inputs
- [x] 1.5 Run `npm run test:unit` — verify all tests pass

## 2. API Fix — Complex.pow instance validation (P1)

- [x] 2.1 In `complex.ts` instance `pow()` (~L1858), add check: `if (isNearZero(mag) && exponent < 0) { throw new RangeError('Complex.pow: cannot raise zero to negative exponent'); }` after computing magnitude, before computing angle
- [x] 2.2 Add test: instance `pow(-1)` on zero complex throws RangeError
- [x] 2.3 Add test: instance `pow(2)` on zero complex returns `(0, 0)` without throwing
- [x] 2.4 Run `npm run test:unit` — verify all tests pass

## 3. API Addition — Matrix3 static getters (P1)

- [x] 3.1 Add `Matrix3.getTranslation(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2` static method — extract (m20, m21) into Vector2, use `out?` pattern
- [x] 3.2 Add `Matrix3.getScale(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2` static method — compute column magnitudes via `hypot(m00, m01)` and `hypot(m10, m11)`, use `out?` pattern
- [x] 3.3 Add `Matrix3.getRotation(matrix: ReadonlyMatrix3Like): number` static method — compute `atan2(m01 / scaleX, m00 / scaleX)`, return 0 for near-zero scaleX
- [x] 3.4 Add JSDoc with `@param`, `@returns`, `@example`, `@category Computed`, `@since 0.7.0` to all three methods
- [x] 3.5 Add tests: static getTranslation extracts correct translation, with and without `out` param
- [x] 3.6 Add tests: static getScale extracts correct scale from rotated+scaled matrix
- [x] 3.7 Add tests: static getRotation extracts correct angle, handles near-zero scale
- [x] 3.8 Add test: static and instance getters produce identical results for same matrix
- [x] 3.9 Run `npm run test:unit` — verify all tests pass
- [x] 3.10 Run `npx eslint packages/math2d/src/core/matrix3.ts` — verify 0 violations

## 4. Documentation — Rotation2 constructor warning (P1)

- [x] 4.1 In `rotation2.ts` constructor JSDoc (~L160-178), add `@remarks` block: "**Warning:** This constructor does NOT normalize the (cos, sin) input. A pair like `(2, 0)` will create a degenerate rotation that scales instead of rotating. Use {@link fromAngle} for angle-based construction or call {@link normalize} after construction if the input may not be unit-length."
- [x] 4.2 Run `npx eslint packages/math2d/src/core/rotation2.ts` — verify 0 violations

## 5. Performance — Transform2.multiply inline rotation (P2)

- [x] 5.1 In `transform2.ts` instance `multiply()` (~L1731-1747), replace `Rotation2.multiply()` call with inline computation: compute `newCos` and `newSin` directly from `this.rotation.cos/sin * other.rotation.cos/sin`, then assign to `this.rotation.cos` and `this.rotation.sin`
- [x] 5.2 Run `npm run test:unit` — verify all 3225+ tests still pass (bit-identical validation)

## 6. Test Coverage — Matrix2 Safe/Unchecked variants

- [x] 6.1 Add tests in `test/core/matrix2.node.spec.ts`: `inverseSafe` returns identity for singular matrix (det ≈ 0)
- [x] 6.2 Add test: `inverseUnchecked` produces correct inverse for invertible matrix
- [x] 6.3 Add test: `divideScalarSafe` returns zero matrix for near-zero scalar
- [x] 6.4 Add test: `divideScalarUnchecked` produces correct result for valid scalar
- [x] 6.5 Add tests for instance variants of all four methods
- [x] 6.6 Run `npm run test:unit` — verify all tests pass

## 7. Test Coverage — Matrix3 Safe/Unchecked variants

- [x] 7.1 Add tests in `test/core/matrix3.node.spec.ts`: `inverseSafe` returns identity for singular matrix
- [x] 7.2 Add test: `inverseUnchecked` produces correct inverse for invertible matrix
- [x] 7.3 Add test: `divideScalarSafe` returns zero matrix for near-zero scalar
- [x] 7.4 Add test: `divideScalarUnchecked` produces correct result for valid scalar
- [x] 7.5 Add tests for instance variants of all four methods
- [x] 7.6 Run `npm run test:unit` — verify all tests pass

## 8. Test Coverage — Complex predicates

- [x] 8.1 Add tests in `test/core/complex.node.spec.ts`: `Complex.hasNaN()` detects NaN in real, imaginary, both, and returns false for finite
- [x] 8.2 Add test: `Complex.hasInfinity()` detects Infinity in real, imaginary, both, and returns false for finite
- [x] 8.3 Add tests: instance `isZero()`, `isNearZero()`, `isReal()`, `isImaginary()` with positive and negative cases
- [x] 8.4 Run `npm run test:unit` — verify all tests pass

## 9. Test Coverage — Transform2 batch + Rotation2.fromCS

- [x] 9.1 Add tests in `test/core/transform2.node.spec.ts`: `transformPoints()` batch matches individual `transformPoint()` calls for 3+ points
- [x] 9.2 Add test: `transformVectors()` batch matches individual `transformVector()` calls for 2+ vectors
- [x] 9.3 Add test in `test/core/rotation2.node.spec.ts`: `Rotation2.fromCS(cos, sin)` with unit input produces correct rotation
- [x] 9.4 Add test: `Rotation2.fromCS(2, 0)` with non-unit input normalizes to `(1, 0)`
- [x] 9.5 Run `npm run test:unit` — verify all tests pass

## 10. Final Validation

- [x] 10.1 Run `npm run test:unit` — confirm all tests pass (3225+ original + new tests)
- [x] 10.2 Run `npx eslint packages/math2d/src/` — confirm 0 violations
