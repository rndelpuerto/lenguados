# Numeric Layer Verdict

Source files:

- `packages/math2d/src/auxiliary/numeric/safety.ts`
- `packages/math2d/src/auxiliary/numeric/wrapping.ts`
- `packages/math2d/src/auxiliary/numeric/guards.ts`
- `packages/math2d/src/auxiliary/numeric/rounding.ts` (discovered via glob)

## Summary

The numeric layer is well-designed. `MIN_SAFE_DIVISOR`, `acosSafe`/`asinSafe` placement, and `robustSum`/`neumaierSum` are all intentional and well-documented. No issues found.

## safety.ts

| Export               | Verdict | Rationale                                                                                                                                                             |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MIN_SAFE_DIVISOR`   | KEEP    | Independently defined at 1e-10; distinct purpose from `EPSILON` (division safety vs comparison tolerance); documented with references to Unreal Engine, Ogre3D, Box2D |
| `divideSafe`         | KEEP    | Core safe-division primitive; used by all core types for `normalizeSafe`, `inverseSafe`; always-active (not dev-only)                                                 |
| `reciprocalSafe`     | KEEP    | Specialized `divideSafe(1, value)`; cleaner API for frequent inversion use case                                                                                       |
| `sqrtSafe`           | KEEP    | IEEE 754 `Math.sqrt` (deterministic); clamps negative inputs to 0; simpler than `Math.sqrt(Math.max(0, x))`                                                           |
| `acosSafe`           | KEEP    | Re-exported from deterministic-kernels; correct placement in `safety.ts` as it has safe semantics; separate from `auxiliary/numeric/safety` but logically consistent  |
| `asinSafe`           | KEEP    | Same rationale as `acosSafe`                                                                                                                                          |
| `logSafe`            | KEEP    | Adds custom-base support on top of `logKernelSafe`; returns 0 for invalid base; consistent with Safe contract                                                         |
| `powSafe`            | KEEP    | Documented Safe exception: negative-base-with-fractional-exponent returns NaN (mathematically undefined in ℝ); matches IEEE 754 §9.2 and all major libraries          |
| `robustSum`          | KEEP    | Kahan summation with non-finite sanitization; documented use case (large number of small values)                                                                      |
| `neumaierSum`        | KEEP    | Improved Kahan for mixed magnitudes; correct cross-linking with `robustSum`                                                                                           |
| `compensatedProduct` | KEEP    | Veltkamp splitting for error-free multiplication; overflow edge case documented (values > ~1.34e300)                                                                  |
| `lerpSafe`           | KEEP    | Distributive form avoids overflow for large opposite-sign values; monotonicity trade-off documented                                                                   |
| `sanitizeNumber`     | KEEP    | Combines finite check + clamp; fallback-itself-clamped behavior documented                                                                                            |
| `ensureFinite`       | KEEP    | Simpler than `sanitizeNumber`; non-finite fallback replaced with 0; used for scalar outputs                                                                           |

## wrapping.ts

| Export                | Verdict | Rationale                                                                                                                                                                   |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flooredMod`          | KEEP    | Python-style floored modulo (result sign matches divisor); distinct from `mod` in arithmetic.ts (which always returns positive) — different semantics for negative divisors |
| `flooredModSafe`      | KEEP    | Safe variant with near-zero check via `isNearZero`                                                                                                                          |
| `flooredModUnchecked` | KEEP    | Hot-path unchecked variant; precondition documented                                                                                                                         |

## guards.ts

| Export               | Verdict | Rationale                                                                                                          |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `isPositiveInfinity` | KEEP    | `=== Infinity` check; not available as `Number.isPositiveInfinity`; fills standard library gap                     |
| `isNegativeInfinity` | KEEP    | `=== -Infinity` check; same rationale                                                                              |
| `isInfinity`         | KEEP    | Combines both; simpler than `!Number.isFinite(x) && !Number.isNaN(x)`                                              |
| `isDenormal`         | KEEP    | Uses `SMALLEST_NORMAL` threshold; needed for physics loops that produce denormal intermediates                     |
| `flushDenormal`      | KEEP    | Returns 0 for denormals; avoids 10-100x CPU penalties on x86 without FTZ/DAZ; documented performance rationale     |
| `isInRange`          | KEEP    | Exact (non-tolerant) range test; correctly cross-linked with `inRange` (epsilon-tolerant variant in comparison.ts) |

## rounding.ts

| Export              | Verdict | Rationale                                                                                                                 |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `roundToInt`        | KEEP    | Banker's rounding (round-half-to-even); bias reduction documented; throws for non-finite (correct: integer semantics)     |
| `roundToPlaces`     | KEEP    | Standard multiply-round-divide; IEEE 754 binary limitation documented (e.g., 1.005 case)                                  |
| `roundToMultiple`   | KEEP    | Grid snapping without offset; cross-linked with `snapToGrid`                                                              |
| `roundToPowerOfTwo` | KEEP    | Uses deterministic `log`; correct lower/upper comparison                                                                  |
| `ceilPowerOfTwo`    | KEEP    | Exact power detection via `Math.round` + tolerance check avoids floating-point ceiling errors (e.g., log2(8) = 2.9999...) |
| `floorPowerOfTwo`   | KEEP    | Complement of `ceilPowerOfTwo`; correct floor of `log2(value)`                                                            |
| `snapToGrid`        | KEEP    | Grid snapping with offset; correctly handles zero grid size (returns value unchanged)                                     |
| `fract`             | KEEP    | Fractional part via `value - Math.floor(value)`; always positive; NaN/Infinity behavior documented                        |
