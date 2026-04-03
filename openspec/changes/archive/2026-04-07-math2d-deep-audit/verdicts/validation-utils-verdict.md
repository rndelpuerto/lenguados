# Validation & Utils Verdict

Source files:

- `packages/math2d/src/validation/assert.ts`
- `packages/math2d/src/utils/random.ts`
- `packages/math2d/src/utils/performance.ts`
- `packages/math2d/src/utils/random-source.ts` (discovered via glob)
- `packages/math2d/src/utils/parse.ts` (discovered via glob)

## Summary

One confirmed issue: `utils/performance.ts` contains zero-math utilities that belong in a separate devtools package (a migration plan is documented in TSDoc). The rest of the module is correct and well-designed.

---

## validation/assert.ts

| Export                      | Verdict | Rationale                                                                           |
| --------------------------- | ------- | ----------------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------- | --- | -------------------------------------- |
| `setAssertionsEnabled`      | KEEP    | Runtime on/off toggle for dev assertions; production DCE eliminates the entire body |
| `areAssertionsEnabled`      | KEEP    | Reflects current runtime state; always returns `false` in production                |
| `assertFinite`              | KEEP    | Uses `Number.isFinite`; handles NaN and ±Infinity correctly                         |
| `assertNonZero`             | KEEP    | Uses `value !== value                                                               |     | value === 0`; correctly rejects NaN (NaN check first, per architecture rules) |
| `assertRange`               | KEEP    | Uses `value !== value                                                               |     | value < min                                                                   |     | value > max`; NaN check first; correct |
| `assertPositive`            | KEEP    | Uses `value !== value                                                               |     | value <= 0`; NaN check first; correct                                         |
| `assertNonNegative`         | KEEP    | Uses `value !== value                                                               |     | value < 0`; NaN check first; correct                                          |
| `assertSafeInteger`         | KEEP    | Uses `Number.isSafeInteger` which correctly rejects NaN and non-integers            |
| `assert`                    | KEEP    | Generic boolean assertion; base primitive for custom conditions                     |
| `assertVector2`             | KEEP    | Checks both components are finite; `name?` parameter for error messages             |
| `assertMatrix2`             | KEEP    | Checks all 4 components are finite                                                  |
| `assertMatrix3`             | KEEP    | Checks all 9 components are finite                                                  |
| `assertRotation2`           | KEEP    | Checks cos and sin are finite                                                       |
| `assertRotation2Normalized` | KEEP    | Checks `cos² + sin² ≈ 1`; useful after matrix decomposition                         |
| `assertComplex`             | KEEP    | Checks real and imag are finite                                                     |
| `assertInterval`            | KEEP    | Checks min and max are finite and ordered                                           |
| `assertTransform2`          | KEEP    | Composite check for position, rotation, scale                                       |
| `assertVector2Like`         | KEEP    | Structural check using `isVector2Like` type guard                                   |
| `assertRotation2Like`       | KEEP    | Structural check using `isRotation2Like` type guard                                 |
| `assertMatrix2Like`         | KEEP    | Structural check                                                                    |
| `assertMatrix3Like`         | KEEP    | Structural check                                                                    |
| `assertComplexLike`         | KEEP    | Structural check                                                                    |
| `assertIntervalLike`        | KEEP    | Structural check                                                                    |
| `assertTransform2Like`      | KEEP    | Structural check                                                                    |

---

## utils/performance.ts

| Export                              | Verdict         | Rationale                                                                                                                                               |
| ----------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timestamp`                         | **RESTRUCTURE** | Generic devtools utility (no math imports); documented in TSDoc `@migration` for move to `@lenguados/devtools` in v2.0; zero-math, zero-physics purpose |
| `Measurement<T>`                    | **RESTRUCTURE** | Generic measurement type; no math dependency; belongs with `timestamp` and `measure`                                                                    |
| `measure`                           | **RESTRUCTURE** | Synchronous profiler; no math imports; same migration target                                                                                            |
| `measureAsync`                      | **RESTRUCTURE** | Async profiler; no math imports; same migration target                                                                                                  |
| `recordMeasurement`                 | **RESTRUCTURE** | Accumulates measurements into a Map; no math imports; same migration target                                                                             |
| `MeasurementCollector` (type/class) | **RESTRUCTURE** | Collector type for measurement data; no math imports; same migration target                                                                             |

**Current location**: `packages/math2d/src/utils/performance.ts`
**Target location**: `@lenguados/devtools` package (documented in TSDoc, not yet created)
**Migration priority**: P3 (nice-to-have; breaking change deferred to v2.0)
**Note**: The TSDoc `@migration` block already contains the full migration guide. The code is correct; only its package membership is misaligned.

---

## utils/random.ts

| Export              | Verdict | Rationale                                                            |
| ------------------- | ------- | -------------------------------------------------------------------- |
| `randomVector2`     | KEEP    | Uniform components in [min, max); uses `RandomSource` interface      |
| `randomUnitVector2` | KEEP    | Uniform direction via angle sampling; uses deterministic `sin`/`cos` |
| `randomInCircle`    | KEEP    | Uniform point in disk using `sqrt(r)` radial distribution            |
| `randomOnCircle`    | KEEP    | Uniform point on circle perimeter                                    |
| `randomInAnnulus`   | KEEP    | Uniform in annular region; uses `assertNonNegative`                  |
| `randomRotation2`   | KEEP    | Uniform rotation via `fromAngle(θ)` where θ ∈ [0, τ)                 |
| `randomInterval`    | KEEP    | Random interval with ordered bounds                                  |
| `randomMatrix2`     | KEEP    | Random matrix with components in range                               |
| `randomTransform2`  | KEEP    | Random SRT transform; scale constrained to avoid degenerate          |
| `randomComplex`     | KEEP    | Random complex number                                                |
| `randomGaussian`    | KEEP    | Box-Muller transform using deterministic `log`/`cos`/`sin`           |

---

## utils/random-source.ts

| Export                     | Verdict | Rationale                                                                  |
| -------------------------- | ------- | -------------------------------------------------------------------------- |
| `RandomSource` (interface) | KEEP    | `{ next(): number }` abstraction for injectable random sources             |
| `SeededRandomSource`       | KEEP    | Deterministic PRNG (xorshift or similar); reproducible sequences for tests |
| `getDefaultRandomSource`   | KEEP    | Returns the global `Math.random`-backed source                             |
| `setDefaultRandomSource`   | KEEP    | Allows injection of SeededRandomSource for reproducible generation         |

---

## utils/parse.ts

| Export                            | Verdict | Rationale                                                                           |
| --------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `parseVector2`                    | KEEP    | Parses `{ x, y }` from JSON/plain objects; uses `@lenguados/common` `parseJSONData` |
| `parseMatrix2`                    | KEEP    | Parses 2×2 matrix                                                                   |
| `parseMatrix3`                    | KEEP    | Parses 3×3 matrix                                                                   |
| `parseRotation2`                  | KEEP    | Parses cos/sin rotation                                                             |
| `parseComplex`                    | KEEP    | Parses complex number                                                               |
| `parseInterval`                   | KEEP    | Parses interval bounds                                                              |
| `parseTransform2`                 | KEEP    | Parses composite SRT transform                                                      |
| `formatVector2`                   | KEEP    | Serializes to `{ x, y }` string                                                     |
| `formatMatrix2` / `formatMatrix3` | KEEP    | Matrix serialization                                                                |
| `formatRotation2`                 | KEEP    | Rotation serialization                                                              |
| `formatComplex`                   | KEEP    | Complex serialization                                                               |
| `formatInterval`                  | KEEP    | Interval serialization                                                              |
| `formatTransform2`                | KEEP    | Transform serialization                                                             |
