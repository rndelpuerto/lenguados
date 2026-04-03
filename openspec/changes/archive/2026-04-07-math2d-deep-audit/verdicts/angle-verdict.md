# Angle Layer Verdict

Source files:

- `packages/math2d/src/auxiliary/angle/operations.ts`
- `packages/math2d/src/auxiliary/angle/normalization.ts`
- `packages/math2d/src/auxiliary/angle/unwrapping.ts`
- `packages/math2d/src/auxiliary/angle/conversion.ts` (discovered via glob)
- `packages/math2d/src/auxiliary/angle/interpolation.ts` (discovered via glob)

## Summary

The angle layer is well-designed and complete. No issues found. The `SinCos` type re-export in `operations.ts` is a deliberate convenience that avoids consumer importing from `types/` directly.

## operations.ts

| Export                    | Verdict | Rationale                                                                                                         |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `SinCos` (type re-export) | KEEP    | Convenience re-export from `types/`; documented with comment at line 14; avoids split imports                     |
| `sinCos`                  | KEEP    | Wraps deterministic kernel; `out?` parameter for allocation-free hot paths; canonical export point for main index |
| `sinCosNormalized`        | KEEP    | Pre-normalizes angle via `normalizeRadians` before computing; documented precision trade-off vs Payne-Hanek       |
| `angleDifference`         | KEEP    | Signed shortest-arc delta; CCW-positive; anti-symmetry at ±π boundary documented correctly                        |
| `angleDistance`           | KEEP    | Unsigned variant of `angleDifference`; always in [0, π]                                                           |
| `anglesNearEqual`         | KEEP    | Wraps `angleDistance` for epsilon tolerance; handles wrap-around correctly                                        |
| `angleBisector`           | KEEP    | Correct midpoint via `angleDifference`; ambiguity at π-apart documented                                           |
| `isAngleBetween`          | KEEP    | CCW arc test; inclusive/exclusive boundary via `inclusive` param; wrap-around case handled                        |
| `clampAngle`              | KEEP    | Nearest-boundary clamping on CCW arc; delegates to `isAngleBetween` and `angleDistance`                           |
| `angleFromVectors`        | KEEP    | `atan2(cross, dot)` — single deterministic call; correct signed direction                                         |

## normalization.ts

| Export                     | Verdict | Rationale                                                                                           |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `normalizeRadians`         | KEEP    | Normalizes to (-π, π]; uses `loop` + `-π → π` edge case; matches IEEE 754 `atan2` output convention |
| `normalizeRadiansPositive` | KEEP    | Normalizes to [0, τ); delegates to `loop`; useful for winding-number calculations                   |
| `normalizeDegrees`         | KEEP    | Degrees variant of `normalizeRadians`; (-180, 180] convention; consistent                           |
| `normalizeDegreesPositive` | KEEP    | Degrees variant of `normalizeRadiansPositive`; [0, 360)                                             |

## unwrapping.ts

| Export                | Verdict | Rationale                                                                                                                                   |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `unwrapAngles`        | KEEP    | Allocates new array; shortest-arc step accumulation; `reference` parameter for continuity anchoring                                         |
| `unwrapAnglesInPlace` | KEEP    | Memory-efficient in-place variant; correctly reuses the same array as input and output                                                      |
| `AngleUnwrapper`      | KEEP    | Streaming class for real-time angle feeds; `initialized` getter distinguishes uninitialized from "initialized at 0"; `reset()` clears state |

## conversion.ts (discovered)

| Export             | Verdict | Rationale                                            |
| ------------------ | ------- | ---------------------------------------------------- |
| `degreesToRadians` | KEEP    | Simple `× DEG_TO_RAD`; used by Rotation2 and Complex |
| `radiansToDegrees` | KEEP    | Simple `× RAD_TO_DEG`                                |
| `radiansToTurns`   | KEEP    | Simple `× RAD_TO_TURN`                               |
| `turnsToRadians`   | KEEP    | Simple `× TURN_TO_RAD`                               |

## interpolation.ts (discovered)

| Export      | Verdict | Rationale                                                                                                     |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `lerpAngle` | KEEP    | Angle-aware lerp using `angleDifference` to choose shortest path; handles wrap-around; used by Rotation2.lerp |
