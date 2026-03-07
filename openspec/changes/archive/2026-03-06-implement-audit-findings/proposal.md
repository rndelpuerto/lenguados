## Why

The `audit-math2d-foundations` audit (163 tasks, archived 2026-03-06) identified concrete bugs, naming inconsistencies, unnecessary code, and missing type safety across `@lenguados/math2d`. The highest-priority findings — a mutable freeze bug in Transform2 constants, naming violations, redundant API surface, and an unnecessary 6x-slower custom sqrt — need to be resolved before the next release. These are P1-P4 items from the prioritized checklist; P5-P7 (new operations, quality improvements, documentation) are deferred to a follow-up change.

## What Changes

### P1 — Bug Fix

- **Deep freeze Transform2.IDENTITY, FLIP_X, FLIP_Y**: Currently `Object.freeze()` only freezes the outer object; nested `position` (Vector2), `rotation` (Rotation2), and `scale` (Vector2) remain mutable. `Transform2.IDENTITY.position.x = 99` silently succeeds. Fix by calling `freezeVector2`/`freezeRotation2` on nested objects.

### P2 — Naming/Consistency (BREAKING)

- **BREAKING**: Rename `Vector2.magnitudeSquared` → `magnitudeSq` (consistency with Complex.magnitudeSq)
- **BREAKING**: Rename `Rotation2.negate()` → `conjugate()` (current implementation does conjugate, not negation)
- **BREAKING**: Remove `Rotation2.angleValue` (duplicate of `angle` getter)
- **BREAKING**: Remove `Rotation2.slerp` (identical to `lerp` in 2D; document equivalence in lerp's TSDoc)
- **BREAKING**: Remove `Interval.NORMALIZED` (duplicate of `Interval.UNIT`)
- Add `ReadonlyRotation2` type alias (6/7 core types have it; Rotation2 is the missing one)

### P3 — Deterministic Module

- **BREAKING**: Remove custom `sqrt` from deterministic/ (Math.sqrt is IEEE 754 required, correctly rounded; custom is 6x slower AND less accurate per benchmark)
- Move `sqrtSafe` from deterministic/ to numeric/safety (with re-export for compatibility)
- Add `out` parameter to `deterministic/sinCos` for allocation-free hot paths
- Fix `angle/sinCos` to delegate to `deterministic/sinCos` (currently calls sin+cos separately, causing double range reduction)

### P4 — Constants Cleanup (BREAKING)

- **BREAKING**: Remove `ANGLE_EPSILON` (zero consumers in codebase; causes confusion about which epsilon to use)
- **BREAKING**: Remove `GOLDEN_RATIO` (zero consumers; `GOLDEN_RATIO_CONJUGATE` suffices — `phi = 1 + conjugate`)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `core-types-api`: Removing `Rotation2.slerp`, `Rotation2.angleValue`, `Interval.NORMALIZED`; renaming `Vector2.magnitudeSquared` → `magnitudeSq`, `Rotation2.negate` → `conjugate`; adding `ReadonlyRotation2`; fixing Transform2 deep freeze
- `auxiliary-api`: Removing `ANGLE_EPSILON` and `GOLDEN_RATIO` constants; moving `sqrtSafe` to numeric/safety
- `determinism-guarantees`: Removing custom `sqrt`; adding `out` parameter to `sinCos`
- `support-layers-api`: Fixing `angle/sinCos` delegation to use `deterministic/sinCos`

## Impact

- **Affected layers**: deterministic/, auxiliary/ (scalar, angle, numeric), core/ (Vector2, Rotation2, Interval, Transform2), types/
- **Breaking changes**: 8 breaking changes (removals + renames). These are API surface reductions of zero-consumer or duplicate entities. Downstream impact is minimal.
- **Bundle size**: Slight reduction (removing dead code: sqrt kernel, unused constants, duplicate methods)
- **Tree-shaking**: No impact; `sideEffects: false` preserved
- **Determinism**: Improved — removing custom sqrt eliminates a 6x slower, less accurate implementation. All other deterministic guarantees preserved.
- **Rollback plan**: All breaking changes are in the public API surface. If any downstream consumer relies on removed entities, re-introduce as deprecated re-exports pointing to the canonical replacement.
- **Tests**: All affected test files need updates for renames/removals. New tests needed for deep freeze fix, sinCos delegation, and ReadonlyRotation2.
