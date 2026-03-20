## Why

An exhaustive 12-agent audit reviewed all 29,000 lines of @lenguados/math2d line by line, verifying mathematical correctness, determinism, API consistency, numerical stability, and test coverage. The audit confirmed the library is production-quality (Grade A overall), but identified 1 confirmed bug, 3 API inconsistencies, 1 performance opportunity, and 6 test coverage gaps that should be addressed before the library serves as foundation for downstream physics packages.

## What Changes

### Bug Fix (P0)

- **Complex.slerp() instance**: Add zero-magnitude guard matching the static version to prevent numerically unstable results when interpolating near-zero complex numbers

### API Consistency (P1)

- **Rotation2 constructor**: Add explicit JSDoc warning that constructor does NOT normalize (while `set()` does) — documentation only, no code change
- **Matrix3 static getters**: Add `getRotation()`, `getScale()`, `getTranslation()` static methods accepting `ReadonlyMatrix3Like` for allocation-free API symmetry with instance versions
- **Complex.pow() instance**: Add explicit `0^(-n)` validation matching the static variant's RangeError

### Performance (P2)

- **Transform2.multiply() instance**: Eliminate temporary Rotation2 allocation by computing cos/sin inline — must produce bit-identical results

### Test Coverage (P2)

- Add tests for Matrix2/Matrix3 Safe/Unchecked triality variants
- Add tests for Complex.hasNaN(), hasInfinity(), and instance predicates
- Add tests for Transform2 batch operations (transformPoints/transformVectors)
- Add test for Rotation2.fromCS() factory

## Capabilities

### New Capabilities

None — all changes are fixes and improvements to existing capabilities.

### Modified Capabilities

- `api-consistency-triality`: New static getter methods on Matrix3 extend the static/instance symmetry contract; Complex.pow() instance validation aligns with static variant
- `core-types-api`: Complex.slerp() instance guard change, Transform2.multiply() optimization, Matrix3 new static methods

## Impact

- **Affected layers**: core/ only (complex.ts, matrix3.ts, rotation2.ts, transform2.ts)
- **Test files**: test/core/ (new tests for coverage gaps)
- **API surface**: 3 new public static methods on Matrix3 (additive, non-breaking)
- **Bundle size**: Negligible increase (~20 lines of new code, ~5 lines of removed allocation)
- **Determinism**: Not affected — no changes to deterministic kernels or transcendental functions
- **Tree-shaking**: Not affected — no new entry points or conditional exports
- **Rollback**: All changes are isolated to individual methods; any can be reverted independently without affecting other changes
