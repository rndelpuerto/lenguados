## Why

The 2026-03-22 adversarial audit (5 agents, 30+ authoritative sources) identified 5 important (P1) and 7 nice-to-have (P2) items in `@lenguados/math2d`. The P1 items include one precision improvement (`Rotation2.fromMatrix2` unnecessarily round-trips through `atan2`), and four unused constants that inflate the API surface without serving any 2D physics computation. The P2 items address completeness gaps (missing `moveTowards`, `fromAngleScale`) and documentation clarity. Implementing these now closes all open audit findings.

## What Changes

### P1: Important

- **Fix `Rotation2.fromMatrix2` precision** — Replace `atan2(m01, m00)` → `fromAngle` round-trip with direct column extraction `(cos=m00, sin=m01)` + normalize. Avoids unnecessary trig round-trip that compounds floating-point error. Affects `core/rotation2.ts`.
- **BREAKING: Remove `ITERATIVE_TOLERANCE`** — Unused constant with zero consumers. Affects `auxiliary/scalar/constants.ts`.
- **BREAKING: Remove `MAX_SAFE_INTEGER_F64`** — Pure alias for `Number.MAX_SAFE_INTEGER` with no added value. Affects `auxiliary/scalar/constants.ts`.
- **BREAKING: Remove `E`** — Alias for `Math.E` with zero consumers in codebase. Not relevant for 2D physics. Affects `auxiliary/scalar/constants.ts`.
- **BREAKING: Remove `GOLDEN_RATIO` / `GOLDEN_RATIO_CONJUGATE`** — Zero consumers, not geometrically relevant for 2D physics. Resolves contradiction between prior audits. Affects `auxiliary/scalar/constants.ts`.

### P2: Nice-to-Have

- **Add `Vector2.moveTowards`** — Standard in Unity/Godot. Clamps displacement to maxDelta. Static + instance + `out` param pattern. Affects `core/vector2.ts`.
- **Deprecate `Vector2.sumComponents`** — No geometric meaning, no consumers. Mark with `@deprecated`.
- **Add `Matrix2.fromAngleScale`** — Combined rotation + non-uniform scale factory. Affects `core/matrix2.ts`.
- **Cross-documentation improvements** — Add `@see` references between `neumaierSum`/`robustSum`, clarify `inRange`/`isInRange` distinction, document `compensatedProduct` use cases, document parse round-trip limitations for non-finite values.

## Capabilities

### New Capabilities

- `audit-p1-fixes`: Precision fix for `Rotation2.fromMatrix2` and removal of 5 unused constants from the scalar constants module
- `audit-p2-additions`: New methods (`moveTowards`, `fromAngleScale`), deprecation of `sumComponents`, and documentation improvements

### Modified Capabilities

- `core-types-api`: Adding `moveTowards` to Vector2 and `fromAngleScale` to Matrix2 changes the public API surface
- `api-conventions`: `sumComponents` deprecation sets precedent for deprecation pattern

## Impact

- **Affected layers:** auxiliary (constants removal), core (Rotation2 fix, Vector2/Matrix2 additions)
- **Breaking changes:** 5 constant removals require semver-major or deprecation-first strategy
- **Bundle size:** Net reduction (removing 5 constants, SQRT5 helper)
- **Tree-shaking:** No impact — removed items had zero import consumers
- **Deterministic guarantees:** Not affected — `Rotation2.fromMatrix2` fix uses `hypot` (already deterministic) instead of `atan2+sin+cos`
- **Tests:** Update `constants` tests to remove expectations for deleted items. Add tests for `moveTowards`, `fromAngleScale`. Update `Rotation2.fromMatrix2` test for improved precision.
- **Rollback:** All changes are independent and can be reverted individually without affecting deterministic guarantees
