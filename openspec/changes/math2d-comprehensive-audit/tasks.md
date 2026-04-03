## 1. Bug Fixes (verified with real code execution)

- [x] 1.1 Fix `ceilPowerOfTwo` in `packages/math2d/src/auxiliary/numeric/rounding.ts`: Add snap-to-integer guard on log2 computation before `Math.ceil`. Only `ceilPowerOfTwo` is affected (`floorPowerOfTwo` and `roundToPowerOfTwo` verified NOT broken).
- [x] 1.2 Add tests for `ceilPowerOfTwo` in `packages/math2d/test/auxiliary/numeric/rounding.node.spec.ts`: Verify `ceilPowerOfTwo(2**n) === 2**n` for ALL integer exponents 1-52. Include the 5 known-failing exponents (29, 31, 39, 47, 51) as explicit test cases.
- [x] 1.3 Fix `assertPositive` and `assertNonNegative` in `packages/math2d/src/validation/assert.ts`: Add `value !== value` NaN check to the guard condition. Update tests to verify NaN is rejected.
- [x] 1.4 Fix `Rotation2` instance `multiply()` (line 1450) and `relativeTo()` (line 1521) in `packages/math2d/src/core/rotation2.ts`: Route both through `setDirect` or add equivalent dev-only unit-length assertion to match their static counterparts (`multiply` at line 772, `relative` at line 824). Note: `inverse()`, `negate()`, and `conjugate()` do NOT need this fix (they only negate components, preserving unit-length).
- [x] 1.5 Fix `compensatedProduct` TSDoc in `packages/math2d/src/auxiliary/numeric/safety.ts`: Change overflow threshold from `~1.34e291` to `~1.34e300`.

## 2. Architectural Fixes (verified against project rules and all core type constructors)

- [x] 2.1 Refactor `Interval` constructor in `packages/math2d/src/core/interval.ts`: Remove `sanitize()` and `assertOrder()` calls. Make it pure assignment with canonical comment, matching all other core types.
- [x] 2.2 Add private `_setDirect(min, max)` method to Interval: Direct assignment without validation. Keep public `set()` validated as user-facing safety net. Verified: `fromValues()` validates independently before calling `set()`, so it is not affected.
- [x] 2.3 Update all Interval static methods to use `_setDirect()` internally instead of `set()`, eliminating double-validation. Paths like `ensureOut(out)._setDirect(resultMin, resultMax)` replace `ensureOut(out).set(resultMin, resultMax)`.
- [x] 2.4 Update Interval tests: Move constructor-throws tests to `fromValues()`. Add tests verifying constructor does NOT throw for reversed or NaN inputs.
- [x] 2.5 Run full test suite (`npm run test:unit`) to verify no regressions.

## 3. sqrt/hypot Consistency (verified with exhaustive audit of all 52 usages)

- [x] 3.1 Document the `hypot` vs `Math.sqrt` convention in `.claude/rules/math2d-patterns.md`: Default/Safe = `hypot` (overflow-safe), Unchecked/hot-path = `Math.sqrt` (fast). Include examples from `normalize` vs `normalizeUnchecked`.
- [x] 3.2 Fix `Vector2.directionUnchecked()` at `vector2.ts:1401`: Replace `hypot(dx, dy)` with `Math.sqrt(dx*dx + dy*dy)`.
- [x] 3.3 Fix `Vector2.setMagnitudeUnchecked()` static at `vector2.ts:1809`: Replace `hypot(v.x, v.y)` with `Math.sqrt(v.x*v.x + v.y*v.y)`.
- [x] 3.4 Fix `Vector2.setMagnitudeUnchecked()` instance at `vector2.ts:3681`: Replace `hypot(this.x, this.y)` with `Math.sqrt(this.x*this.x + this.y*this.y)`.
- [x] 3.5 Fix `Rotation2.normalizeUnchecked()` static at `rotation2.ts:744`: Replace `hypot(rotation.cos, rotation.sin)` with `Math.sqrt(rotation.cos*rotation.cos + rotation.sin*rotation.sin)`.
- [x] 3.6 Fix `Rotation2.normalizeUnchecked()` instance at `rotation2.ts:1329`: Replace `hypot(this.cos, this.sin)` with `Math.sqrt(this.cos*this.cos + this.sin*this.sin)`.
- [x] 3.7 Run existing tests for Vector2 and Rotation2 to verify no regressions.

## 4. moveTowards Removal (verified against 12 reference libs + project's archived audit)

- [x] 4.1 Remove `Vector2.moveTowards` static method from `packages/math2d/src/core/vector2.ts` (around line 1065).
- [x] 4.2 Remove `Vector2.moveTowards` instance method from same file (around line 4257).
- [x] 4.3 Remove `moveTowards` tests from `packages/math2d/test/core/vector2.node.spec.ts` (lines 3084-3137).
- [x] 4.4 Remove any `moveTowards` entries from barrel exports if explicitly listed.
- [x] 4.5 Verify no internal consumers of `moveTowards` exist (confirmed: none found during audit).

## 5. Missing Operations -- Matrix2 Eigenvalue Decomposition (5/7 math libraries)

- [x] 5.1 Add `Matrix2.eigenvalues(matrix)` to `packages/math2d/src/core/matrix2.ts`: Closed-form quadratic on characteristic polynomial. Return discriminated union: `{ type: 'real', lambda1, lambda2 }` or `{ type: 'complex', realPart, imaginaryPart }`.
- [x] 5.2 Add `Matrix2.eigendecompose(matrix)` to same file: Returns eigenvalues + eigenvectors for real case. For complex eigenvalues, returns only eigenvalues.
- [x] 5.3 Add eigenvalue result types to `packages/math2d/src/types/index.ts` if needed.
- [x] 5.4 Add tests in `packages/math2d/test/core/matrix2.node.spec.ts`: diagonal, symmetric, rotation (complex eigenvalues), identity (repeated), eigenvalue-trace-determinant consistency.

## 6. Missing Operations -- Matrix3 solveLinearSystem (5/7 math libraries)

- [x] 6.1 Add `Matrix3.solveLinearSystem` / `solveLinearSystemSafe` / `solveLinearSystemUnchecked` to `packages/math2d/src/core/matrix3.ts`: Cramer's rule using existing cofactor/determinant infrastructure. Follow `Matrix2.solveLinearSystem` pattern.
- [x] 6.2 Add tests in `packages/math2d/test/core/matrix3.node.spec.ts`: identity system, general invertible with roundtrip, singular (strict throws, safe returns zero), unchecked variant.

## 7. Documentation Fixes (all 7 verified against current TSDoc)

- [x] 7.1 Fix `compensatedProduct` `@remarks` in `packages/math2d/src/auxiliary/numeric/safety.ts`: `~1.34e291` -> `~1.34e300`.
- [x] 7.2 Add `@remarks` to `Vector2.inverted` getter in `packages/math2d/src/core/vector2.ts`: Document zero-component -> Infinity behavior, reference `inverse()`/`inverseSafe()`.
- [x] 7.3 Add use-case `@remarks` to `sinCosNormalized` in `packages/math2d/src/auxiliary/angle/operations.ts`: When to prefer over `sinCos` (accumulated angles > ~1e6 radians).
- [x] 7.4 Add zero-vector `@remarks` to `angleFromVectors` in same file: Returns 0 via `atan2(0,0)`.
- [x] 7.5 Add non-monotonicity `@remarks` to `lerpSafe` in `packages/math2d/src/auxiliary/numeric/safety.ts`: Distributive form trade-off, reference standard `lerp`.
- [x] 7.6 Add precision boundary `@remarks` to `reduceAngle` in `packages/math2d/src/deterministic/deterministic-kernels.ts`: ~2^20\*PI safe range.
- [x] 7.7 Add singularity `@remarks` to `tan` in same file: sin/cos division, reduced precision near PI/2.

## 8. Final Verification

- [x] 8.1 Run full test suite with coverage: `npm test`. Verify coverage thresholds (90% lines/statements/functions, 50% branches) are met.
- [x] 8.2 Run build: `npm run build` to verify no TypeScript errors.
- [x] 8.3 Run lint: `npm run lint` to verify code style compliance.
