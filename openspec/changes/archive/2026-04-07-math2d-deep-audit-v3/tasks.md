## 1. Fix Transform2.toMatrix3() lossy roundtrip

- [x] 1.1 Replace line 1575 in `packages/math2d/src/core/transform2.ts`:
  - FROM: `return Matrix3.fromTransform2(this.position, Rotation2.angle(this.rotation), this.scale, out);`
  - TO: `return Matrix3.fromTransform2Like(this, out);`
- [x] 1.2 Verify `Matrix3.fromTransform2Like` accepts Transform2 (it implements ReadonlyTransform2Like).
- [x] 1.3 Run existing Transform2 and Matrix3 tests to verify no regressions.

## 2. Fix Complex instance reciprocal/reciprocalSafe hypot overhead

- [x] 2.1 In `packages/math2d/src/core/complex.ts`, update instance `reciprocal()` (~line 2351):
  - Replace `const mag = this.magnitude(); ... const magSq = mag * mag;` with `const magSq = this.magnitudeSq();`
  - Update threshold from `isNearZero(mag)` to `isNearZero(magSq, EPSILON * EPSILON)`
- [x] 2.2 Apply same fix to instance `reciprocalSafe()` (~line 2378).
- [x] 2.3 Run existing Complex tests to verify no regressions (results must be bit-identical).

## 3. Fix Interval.fromArray/fromObject order validation

- [x] 3.1 In `packages/math2d/src/core/interval.ts`, add `this.assertOrder(minValue, maxValue, 'Interval.fromArray')` to `fromArray()` between sanitize and setDirect (after line 335).
- [x] 3.2 Add `this.assertOrder(minValue, maxValue, 'Interval.fromObject')` to `fromObject()` (after line 357).
- [x] 3.3 Add tests verifying `fromArray([5, 2])` throws RangeError.
- [x] 3.4 Add tests verifying `fromObject({ min: 5, max: 2 })` throws RangeError.
- [x] 3.5 Document BREAKING change in CHANGELOG: migration path is `Interval.fromUnsorted()`.

## 4. Document Rotation2.normalize() triality deviation

- [x] 4.1 Add `@remarks` to instance `Rotation2.normalize()` documenting the intentional deviation: "Unlike other strict-tier operations, this method does not throw for zero-magnitude input. Instead, it returns the identity rotation (cos=1, sin=0), matching the behavior of normalizeSafe(). This is an intentional exception: for rotations, identity is always a mathematically valid fallback."
- [x] 4.2 Add `@see` note: "Functionally identical to {@link normalizeSafe} for zero-magnitude input."
- [x] 4.3 Apply same documentation to static `Rotation2.normalize()`.

## 5. Final Verification

- [x] 5.1 Run full test suite: `npm run test:unit`. Verify all tests pass.
- [x] 5.2 Run build: `npm run build` to verify no TypeScript errors.
- [x] 5.3 Run lint: `npm run lint` to verify code style compliance.
