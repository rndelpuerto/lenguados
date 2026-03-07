## Why

An exhaustive code review of `@lenguados/math2d` identified 10 actionable findings across the core, auxiliary, and validation layers. Two are violations of existing specs (`numerical-foundations`), one requires a new spec-level requirement, and seven are implementation-level fixes (comments, docs, double normalization, test tolerances). Fixing these now hardens the library before the next release and ensures spec compliance.

## What Changes

- **Fix epsilon inconsistency in `getLengthAndNormalize()`** — uses `EPSILON * EPSILON` (1e-20) while all other normalize paths use `isNearZero()` (1e-10). Violates `numerical-foundations` cross-cutting tolerance consistency requirement.
- **Add missing `GOLDEN_RATIO` constant** — `numerical-foundations` spec lists it as a required export but only `GOLDEN_RATIO_CONJUGATE` exists.
- **Use `hypot()` in `normalize()`/`normalizeSafe()`** for Vector2 and Complex — currently uses `sqrtSafe(x*x + y*y)` which overflows for components > 1e154, inconsistent with `magnitude()` which uses `hypot()`.
- **Fix misleading comment in `Rotation2.set()`** — says "direct assignment" but actually normalizes. Update to reflect normalization behavior.
- **Add dev-mode assertion to `projectOnUnit()`** — precondition (unit-length axis) is not validated even in strict mode.
- **Fix double normalization in `Rotation2.fromComplex()`** — `set()` normalizes, then `normalize()` normalizes again. Add missing `@throws` doc.
- **Unify test tolerance constants** — `DIGITS` varies between 8-14 across test files with no justification.
- **Document `Complex.apply()` zero-magnitude behavior** — returns unrotated vector silently, undocumented.
- **Align `Matrix3.transformPoint` w-check style** — uses `isNearZero(w - 1)` instead of `scalarNearEquals(w, 1)` used elsewhere.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `numerical-foundations`: Add requirement that normalization operations SHALL use overflow-safe magnitude computation (`hypot`) consistent with their corresponding `magnitude()` methods.

## Impact

- **Layers affected**: `core/` (vector2, complex, rotation2, matrix3), `auxiliary/scalar/constants`
- **Test files affected**: Multiple test files for tolerance constant unification
- **API surface**: No breaking changes. `GOLDEN_RATIO` is a new export. All other changes are internal fixes.
- **Bundle size**: Negligible — one new constant export, minor code changes
- **Determinism**: Not affected — `hypot` is already from deterministic-kernels, `Math.sqrt` is IEEE 754 deterministic
- **Rollback**: Safe — all changes are backward-compatible fixes with no public API signature changes
