## 1. Auxiliary Layer — Naming & Consolidation

- [x] 1.1 Rename `safeDivide` to `divideSafe` in `src/auxiliary/numeric/safety.ts`, add deprecated re-export with old name
- [x] 1.2 Rename `safeReciprocal` to `reciprocalSafe` in `src/auxiliary/numeric/safety.ts`, add deprecated re-export
- [x] 1.3 Rename `safeLog` to `logSafe` in `src/auxiliary/numeric/safety.ts`, add deprecated re-export
- [x] 1.4 Rename `safePow` to `powSafe` in `src/auxiliary/numeric/safety.ts`, add deprecated re-export
- [x] 1.5 Rename `safeLerp` to `lerpSafe` in `src/auxiliary/numeric/safety.ts`, add deprecated re-export
- [x] 1.6 Update all internal call sites that use the old `safe*` prefix names to use new `*Safe` suffix names
- [x] 1.7 Remove `normalizeRadiansAround` from `src/auxiliary/angle/normalization.ts`
- [x] 1.8 Remove `wrapAngle` from `src/auxiliary/angle/normalization.ts`
- [x] 1.9 Update barrel files (`src/auxiliary/angle/index.ts`) to remove exports of deleted functions
- [x] 1.10 Add `out` parameter to `sinCosNormalized` in `src/auxiliary/angle/operations.ts`
- [x] 1.11 Fix `remap()` strict variant to throw when `inMin === inMax` (currently returns midpoint)
- [x] 1.12 Update tests for renamed functions in `test/auxiliary/numeric/safety.node.spec.ts`
- [x] 1.13 Update tests for removed angle normalization functions in `test/auxiliary/angle/normalization.node.spec.ts`
- [x] 1.14 Update tests for `sinCosNormalized` out parameter in `test/auxiliary/angle/operations.node.spec.ts`
- [x] 1.15 Update tests for `remap` strict behavior in `test/auxiliary/scalar/arithmetic.node.spec.ts`
- [x] 1.16 Run `npm run test:unit` and verify all auxiliary tests pass

## 2. Validation Layer — Complete Assertions

- [x] 2.1 Add `assertComplex(real, imag, name?)` to `src/validation/assert.ts`
- [x] 2.2 Add `assertInterval(min, max, name?)` to `src/validation/assert.ts` (validates finite + min <= max)
- [x] 2.3 Add `assertTransform2(px, py, cos, sin, sx, sy, name?)` to `src/validation/assert.ts`
- [x] 2.4 Add `assertMatrix3Like(value, name?)` shape assertion to `src/validation/assert.ts` (currently missing)
- [x] 2.5 Verify and fix `assertTransform2Like` — check property names match Transform2Like interface (known potential bug)
- [x] 2.6 Export new assertions from `src/index.ts`
- [x] 2.7 Add tests for `assertComplex` in `test/validation/assert.node.spec.ts`
- [x] 2.8 Add tests for `assertInterval` in `test/validation/assert.node.spec.ts`
- [x] 2.9 Add tests for `assertTransform2` in `test/validation/assert.node.spec.ts`
- [x] 2.10 Add tests for `assertMatrix3Like` in `test/validation/assert.node.spec.ts`
- [x] 2.11 Run `npm run test:unit` and verify all validation tests pass

## 3. Core Types — New Methods

- [x] 3.1 Verify `Matrix2.transformVector` exists as both static and instance (already implemented — verification only)
- [x] 3.2 Verify `Rotation2.toVector2(out?)` and `Rotation2.toComplex(out?)` exist (already implemented — verification only)
- [x] 3.3 Add `toMatrix2(out?)` instance method to Rotation2 in `src/core/rotation2.ts` **(NEW)**
- [x] 3.4 Add `toVector2(out?)` instance method to Complex in `src/core/complex.ts` **(NEW)**
- [x] 3.5 Verify all Complex instance mutation methods return `this` (fix any that don't)
- [x] 3.6 Verify `Interval.union` exists as both static and instance (already implemented — verification only)
- [x] 3.7 Verify `Interval.intersect` exists and returns `Interval | undefined` for disjoint sets (already implemented — verification only)
- [x] 3.8 Add `static expand(interval, delta, out?)` and instance `expand(delta)` to Interval in `src/core/interval.ts` **(NEW)**
- [x] 3.9 Add `static shrink(interval, delta, out?)` and instance `shrink(delta)` to Interval **(NEW)**
- [x] 3.10 Add `static fromPose(x, y, angle, out?)` to Transform2 in `src/core/transform2.ts` **(NEW)**
- [x] 3.11 Add tests for Rotation2.toMatrix2 in `test/core/rotation2.node.spec.ts`
- [x] 3.12 Add tests for Complex.toVector2 in `test/core/complex.node.spec.ts`
- [x] 3.13 Add tests for Interval expand/shrink in `test/core/interval.node.spec.ts`
- [x] 3.14 Add tests for Transform2.fromPose in `test/core/transform2.node.spec.ts`
- [x] 3.15 Run `npm run test:unit` and verify all core tests pass

## 4. Index & Documentation Cleanup

- [x] 4.1 Remove stale JSDoc references to PrecisionMath and RoundingControl in `src/index.ts`
- [x] 4.2 Export new validation assertions (`assertComplex`, `assertInterval`, `assertTransform2`, `assertMatrix3Like`) from `src/index.ts`
- [x] 4.3 Add TSDoc `@remarks Uses deterministic math` to `roundToPowerOfTwo`, `logSafe`, `powSafe` and other functions that use deterministic kernels without documenting it
- [x] 4.4 Update ARCHITECTURE.md to reflect consolidated angle normalization and naming changes
- [x] 4.5 Update CONTRIBUTING.md with definitive API convention rules from `api-conventions` spec

## 5. Integration & Final Verification

- [x] 5.1 Run full `npm run test:unit` — all tests must pass
- [x] 5.2 Run `npm run lint` — no lint errors
- [x] 5.3 Run `npm run build` — build succeeds with no type errors
- [x] 5.4 Verify coverage thresholds are still met (90% lines/statements, 85% functions, 50% branches)
- [x] 5.5 Verify no circular dependencies introduced (layer constraints: deterministic -> auxiliary -> core)

## 6. Post-Audit Verification & Cleanup

- [x] 6.1 Generate complete inventory of all 42+ deleted functions, 5 renames, 2 deleted files
- [x] 6.2 Contrast every deletion against 8 industry-standard libraries (gl-matrix, three.js, Unity, Box2D, GLM, Eigen, nalgebra, GLSL)
- [x] 6.3 Verify all deletions justified: 0/42 functions are standard in target libraries
- [x] 6.4 Remove all deprecated re-exports (`safeDivide`, `safeReciprocal`, `safeLog`, `safePow`, `safeLerp`) — no legacy aliases
- [x] 6.5 Remove deprecated alias tests from `test/auxiliary/numeric/safety.node.spec.ts`
- [x] 6.6 Verify new docs in `math2d/docs/` subdirectories are current and consistent with code
- [x] 6.7 Fix existing `assertTransform2Like` test (was passing `rotation: 0` instead of `rotation: { cos: 1, sin: 0 }`)
- [x] 6.8 Final test suite pass (2838 tests), lint clean, build succeeds
