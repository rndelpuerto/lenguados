## Why

The `@lenguados/math2d` package (~31,000 lines across 32 source files) has never undergone a systematic audit against reference libraries and established mathematical/software engineering standards. As this package forms the foundation for future physics engine packages, any bugs, inconsistencies, or architectural violations at this layer would propagate upward and become exponentially more costly to fix later.

A three-phase audit was conducted: (1) 8 domain-expert agents audited every line, (2) 5 verification agents cross-checked every claim with real code execution, (3) 2 additional deep-dive agents investigated design pattern consistency and API belonging criteria. Only changes that survived all three verification phases are included.

**Key finding**: The codebase is exceptionally well-designed. Out of ~31,000 lines: 1 actual bug, zero mathematical errors in any core type, and consistently applied API patterns. However, 1 method (`moveTowards`) was found to have been added despite a previous ratified audit rejecting it, 5 Unchecked methods violate the performance pattern, and the Interval constructor violates the project's own Constructor Purity rule.

## What Changes

### Bug Fixes (verified with real code execution)

- **Fix `ceilPowerOfTwo` bug**: Returns incorrect results for exact powers of 2 at exponents 29, 31, 39, 47, and 51. Verified by executing against all exponents 1-52. `floorPowerOfTwo` and `roundToPowerOfTwo` verified NOT affected.
- **Fix `compensatedProduct` documentation**: Overflow threshold `~1.34e291` is wrong; `Number.MAX_VALUE / 134217729` = `~1.34e300`.
- **Fix `assertPositive`/`assertNonNegative` NaN pass-through**: NaN silently passes both assertions per IEEE 754 comparison semantics.
- **Fix `Rotation2` instance `multiply()` missing assertion**: Static routes through `setDirect` (dev assertion); instance directly assigns.

### Architectural Fixes (verified against project rules and all 7 core type constructors)

- **Fix Interval constructor purity violation**: Constructor and `set()` validate, violating "Constructor Purity" rule. All 6 other core types follow the rule.
- **Eliminate redundant double-validation in Interval**: Static methods validate, then `ensureOut().set()` validates again. `assertOrder` is production-level `RangeError`.

### Design Pattern Consistency (verified with exhaustive grep of all 20 Math.sqrt + 32 hypot usages)

- **Document the `hypot` vs `Math.sqrt` convention**: Default/Safe methods use `hypot` (overflow-safe), Unchecked/hot-path use `Math.sqrt` (fast). Pattern established by precedent but never documented.
- **Fix 5 Unchecked methods using `hypot`**: `directionUnchecked`, `setMagnitudeUnchecked` (x2), `Rotation2.normalizeUnchecked` (x2) should use `Math.sqrt` for performance consistency.

### API Scope Correction (verified against 12 reference libraries + project's own ratified audit)

- **Remove `Vector2.moveTowards`**: 0/7 pure math libs, 0/5 applied math libs, only game engines have it. Composes trivially from `subtract` + `limit` + `add`. The project's own archived audit rejected it. Unreleased (0.8.0, package at 0.6.0). `maxDelta` parameter is frame-rate-dependent, making it a simulation concept.
- **Document non-addition of `moveTowardsAngle`, scalar `moveTowards`, `smoothDamp`**: Prevent future re-proposals without new evidence.

### Missing Operations (verified in 5/7 pure math reference libraries)

- **Add `Matrix2.eigenvalues` / `Matrix2.eigendecompose`**: Closed-form quadratic on characteristic polynomial. Present in Eigen, NumPy, Apache Commons Math, Boost, MathNet.
- **Add `Matrix3.solveLinearSystem`** with triality: Cramer's rule for 3x3. Natural extension of existing `Matrix2.solveLinearSystem`. Present in same 5/7 libs.

### Documentation Fixes (all 7 verified against current TSDoc)

- Fix `compensatedProduct` threshold (e291 -> e300)
- Add `Vector2.inverted` zero-component behavior
- Add `sinCosNormalized` use-case clarification
- Add `angleFromVectors` zero-vector behavior
- Add `lerpSafe` non-monotonicity trade-off
- Add `reduceAngle` precision boundary (~3.3M radians)
- Add `tan` singularity precision remark

### Proposals rejected during verification (with evidence)

- ~~`Vector2.moveTowards` hypot fix~~: `Math.sqrt` is deliberate in Unchecked/hot-path; but `moveTowards` itself is being removed.
- ~~`moveTowardsAngle`~~: 0/7 math libs, gameplay concept, trivially composable.
- ~~`Rotation2.nlerp`~~: Redundant in 2D (lerp IS slerp for SO(2)); nlerp strictly worse.
- ~~`Matrix3.compose`~~: Already exists as `Matrix3.fromTransform2`.
- ~~`Transform2.fromRotation/fromTranslation/fromScale`~~: Constructor handles defaults.
- ~~`Vector2.applyInverse*`~~: Already exist on Rotation2/Transform2.
- ~~Fix `floorPowerOfTwo`/`roundToPowerOfTwo`~~: Verified NOT affected.

## Capabilities

### New Capabilities

- `audit-bug-fixes`: Fix ceilPowerOfTwo bug, assertion NaN pass-through, Rotation2 multiply assertion gap, and doc inaccuracy.
- `audit-architectural-fixes`: Resolve Interval constructor purity violation and double-validation.
- `audit-sqrt-hypot-consistency`: Document the hypot/Math.sqrt convention and fix 5 Unchecked violations.
- `audit-movetowards-removal`: Remove `Vector2.moveTowards` and document non-addition policy for simulation operations.
- `audit-missing-operations`: Add Matrix2 eigenvalue decomposition and Matrix3 solveLinearSystem.
- `audit-documentation-fixes`: Fix all 7 documentation gaps.
- `audit-rejected-proposals`: Formalize 5 rejected proposals as "SHALL NOT" requirements with irrefutable evidence, preventing future re-proposals without new evidence (nlerp, Matrix3.compose, Transform2 factories, Vector2 inverse transforms, floorPowerOfTwo/roundToPowerOfTwo fix).

### Modified Capabilities

<!-- No existing specs are being modified -->

## Impact

- **Affected code**: `auxiliary/numeric/rounding.ts`, `auxiliary/numeric/safety.ts`, `validation/assert.ts`, `core/interval.ts`, `core/rotation2.ts`, `core/vector2.ts`, `core/matrix2.ts`, `core/matrix3.ts`, `deterministic/deterministic-kernels.ts`, `auxiliary/angle/operations.ts`, `.claude/rules/math2d-patterns.md`
- **APIs**: New methods (eigenvalues, solveLinearSystem) are additive. Interval constructor change is **BREAKING**. `moveTowards` removal is **BREAKING** but unreleased.
- **Dependencies**: No new external dependencies
- **Bundle size**: Net decrease (remove moveTowards) + small increase (eigenvalues + solveLinearSystem)
- **Deterministic guarantees**: Unchanged. New operations use existing deterministic primitives.
- **Rollback plan**: Each of the 7 capabilities is independent and can be reverted separately.
