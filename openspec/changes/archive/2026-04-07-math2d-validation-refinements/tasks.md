## 1. Fix `assertNonZero` NaN pass-through

- [x] 1.1 Fix `assertNonZero` in `packages/math2d/src/validation/assert.ts`: Change `if (value === 0)` to `if (value !== value || value === 0)`. Same fix applied to `assertPositive`/`assertNonNegative` in audit task 1.3.
- [x] 1.2 Add test in `packages/math2d/test/validation/assert.node.spec.ts`: Verify `assertNonZero(NaN)` throws in dev mode. Verify `assertNonZero(0.001)` does NOT throw.

## 2. Fix `Transform2` constructor purity violation

- [x] 2.1 Remove `assertFinite(rotation, 'Transform2.constructor:rotation')` from `Transform2` constructor in `packages/math2d/src/core/transform2.ts` (line ~234). Add canonical comment: `// Pure math: no assertions — Infinity/NaN are valid IEEE 754 values`.
- [x] 2.2 Remove the `assertFinite` import from `transform2.ts` if it is no longer referenced anywhere in the file after the removal (grep for remaining usages before removing).
- [x] 2.3 Add test in `packages/math2d/test/core/transform2.node.spec.ts`: Verify `new Transform2(position, NaN)` does NOT throw. Verify `new Transform2(position, Infinity)` does NOT throw.

## 3. Fix `Rotation2.fromVector2` and `fromVectors2` double-normalization

- [x] 3.1 In `packages/math2d/src/core/rotation2.ts`, fix `Rotation2.fromVector2` static method: Replace `this.ensureOut(out).set(x * inv, y * inv)` with `this.ensureOut(out).setDirect(x * inv, y * inv)`. Verify the `setDirect` call is inside the already-validated code path (after length check), not before.
- [x] 3.2 Fix `Rotation2.fromVectors2` (or equivalent static): Apply the same `set → setDirect` replacement.
- [x] 3.3 Run existing `Rotation2` tests to verify no regressions: `npx jest --testPathPattern="rotation2" --no-coverage`.

## 4. Fix `Transform2` double-normalization in static methods

- [x] 4.1 In `packages/math2d/src/core/transform2.ts`, fix `Transform2.multiply` static (line ~569): Replace `result.rotation.set(cos, sin)` with `result.rotation.cos = cos; result.rotation.sin = sin;`.
- [x] 4.2 Fix `Transform2.inverseUnchecked` static (line ~675): Same replacement.
- [x] 4.3 Fix `Transform2.fromComponents` static (line ~357): Same replacement.
- [x] 4.4 Fix `Transform2.premultiply` instance (line ~1992): Same replacement.
- [x] 4.5 Run existing `Transform2` tests to verify no regressions: `npx jest --testPathPattern="transform2" --no-coverage`.

## 5. Complete GIGO and edge-case tests for eigenvalues and solveLinearSystem

- [x] 5.1 Add to `packages/math2d/test/core/matrix2.node.spec.ts`:
  - `Matrix2.eigenvalues` zero matrix: both eigenvalues SHALL be 0 (real case).
  - `Matrix2.eigenvalues` Jordan block `[[2,1],[0,2]]` (discriminant = 0): repeated eigenvalue `lambda1 = lambda2 = 2`.
  - `Matrix2.eigenvalues` negative diagonal `[[-1,0],[0,-2]]`: real case, `lambda1 = -1, lambda2 = -2` (or vice versa by descending order).
  - `Matrix2.solveLinearSystemUnchecked` singular matrix: result SHALL contain NaN or Infinity (not throw). Verify with `toBeNaN()` or `toBe(Infinity)`.
- [x] 5.2 Add to `packages/math2d/test/core/matrix3.node.spec.ts`:
  - `Matrix3.solveLinearSystemUnchecked` singular matrix: result SHALL contain NaN or Infinity (not throw).
- [x] 5.3 Run `npx jest --testPathPattern="matrix2|matrix3" --no-coverage` to verify all new tests pass.

## 6. Final verification

- [x] 6.1 Run full test suite: `npm run test:unit`. Verify no regressions.
- [x] 6.2 Run lint: `npm run lint`. Verify code style compliance.
