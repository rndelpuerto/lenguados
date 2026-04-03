# API Coherence Verdict

Cross-cutting concerns: layer dependency violations, triality gaps, `out` param gaps, `*CS` variant gaps, naming convention issues, synergy gaps.

## Layer Dependency Analysis

| Direction                                       | Verdict                   | Evidence                                                                                                                                                                                    |
| ----------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deterministic/ → types/`                       | KEEP                      | `deterministic-kernels.ts` imports `SinCos` from `../types` — types/ has no other layer dependencies, so this is the lowest-layer upward dependency and is acceptable (types is standalone) |
| `auxiliary/ → deterministic/`                   | KEEP                      | Correct downward dependency; `angle/operations.ts` imports from `deterministic-kernels.ts`                                                                                                  |
| `core/ → auxiliary/` + `core/ → deterministic/` | KEEP                      | Correct downward dependencies; all core types import from both layers                                                                                                                       |
| `utils/ → core/`                                | KEEP                      | Correct; `random.ts` imports Vector2, Matrix2, etc.                                                                                                                                         |
| `validation/ → types/`                          | KEEP                      | Explicitly allowed cross-cutting; assertion functions use type guards from types/                                                                                                           |
| `auxiliary/ → core/`                            | KEEP (no violation found) | Checked all auxiliary files; none import from `core/`                                                                                                                                       |
| `core/ → utils/`                                | KEEP (no violation found) | Checked all core files; none import from `utils/`                                                                                                                                           |

**Finding**: No layer dependency violations detected.

## Triality Coverage Analysis (strict / safe / unchecked)

| Operation Family                             | Strict          | Safe | Unchecked | Verdict                                                                                      |
| -------------------------------------------- | --------------- | ---- | --------- | -------------------------------------------------------------------------------------------- |
| `Vector2.divide`                             | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.divideScalar`                       | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.normalize`                          | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.direction`                          | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.setMagnitude`                       | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.reflect`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.project`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.reject`                             | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.inverse`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `Vector2.refract`                            | NO              | NO   | NO        | **GAP** — confirmed ADD verdict                                                              |
| `Rotation2.normalize`                        | YES             | YES  | YES       | KEEP                                                                                         |
| `Rotation2.divide`                           | YES             | YES  | YES       | KEEP                                                                                         |
| `Complex.divide`                             | YES             | YES  | YES       | KEEP                                                                                         |
| `Complex.normalize`                          | YES             | YES  | YES       | KEEP                                                                                         |
| `Complex.reciprocal`                         | YES             | YES  | YES       | KEEP                                                                                         |
| `Interval.reciprocal`                        | YES             | YES  | YES       | KEEP                                                                                         |
| `Interval.intersection`                      | YES             | YES  | —         | KEEP (unchecked not applicable — intersection is always deterministic given valid intervals) |
| `Matrix2.inverse`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `Matrix3.inverse`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `scalar.remap`                               | YES             | YES  | —         | KEEP (retracted: remapUnchecked intentionally absent — range check IS the work)              |
| `scalar.mod`                                 | YES             | YES  | YES       | KEEP                                                                                         |
| `scalar.loop`                                | YES             | YES  | YES       | KEEP                                                                                         |
| `scalar.pingPong`                            | YES             | YES  | YES       | KEEP                                                                                         |
| `scalar.floorDivide`                         | YES             | YES  | YES       | KEEP                                                                                         |
| `scalar.inverseLerp`                         | YES             | YES  | YES       | KEEP                                                                                         |
| `numeric.flooredMod`                         | YES             | YES  | YES       | KEEP                                                                                         |
| `divideSafe` / `reciprocalSafe` / `sqrtSafe` | YES (safe-only) | —    | —         | KEEP (safe-only is correct for always-active fallbacks)                                      |

**Finding**: The only triality gap is `Vector2.refract` — confirmed ADD in the vector2-rotation2 verdict.

## `out` Parameter Coverage Analysis

All static methods that return a new math object accept an optional `out?` parameter as the last argument. Confirmed across:

- `Vector2` — all factory, arithmetic, transform, interpolation, direction, constraint static methods
- `Rotation2` — all factory and arithmetic static methods
- `Complex` — all factory and arithmetic static methods
- `Interval` — all static methods that return an Interval
- `Matrix2` / `Matrix3` — all factory and product methods
- `Transform2` — static factory and multiply methods

**Finding**: No `out` parameter gaps detected.

## `*CS` (Pre-computed cos/sin) Variant Coverage

| Method                                      | Has `*CS` variant                                                        | Verdict |
| ------------------------------------------- | ------------------------------------------------------------------------ | ------- |
| `Vector2.rotate`                            | YES: `rotateCS`                                                          | KEEP    |
| `Vector2.rotateAround`                      | YES: `rotateAroundCS`                                                    | KEEP    |
| `Rotation2.fromAngle`                       | YES: `fromCS`                                                            | KEEP    |
| `Rotation2.apply`                           | YES: delegates to `rotateCS` via `applyRotation2`                        | KEEP    |
| `Rotation2.multiply` (hot loop composition) | Uses direct component access in Transform2 (pattern documented in rules) | KEEP    |

**Finding**: No missing `*CS` variants. The pattern is applied where the performance benefit is meaningful (batch rotation of many vectors).

## Naming Convention Analysis

| Pattern                            | Check                                                                                                   | Verdict |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `apply` for operators on operands  | `Rotation2.apply`, `Complex.apply`, `Vector2.applyRotation2`                                            | KEEP    |
| `transform` for coordinate changes | `Matrix3.transformPoint`, `Matrix3.transformVector`, `Transform2.transformPoint`                        | KEEP    |
| `from*` for factories              | `fromAngle`, `fromArray`, `fromObject`, `fromCS`, `fromValues`                                          | KEEP    |
| `*Safe` for fallback variants      | Consistent throughout all core types                                                                    | KEEP    |
| `*Unchecked` for hot-path variants | Consistent throughout all core types                                                                    | KEEP    |
| `*CS` for pre-computed cos/sin     | `rotateCS`, `rotateAroundCS`, `fromCS`                                                                  | KEEP    |
| `freeze*` for immutability helpers | `freezeVector2`, `freezeRotation2`, `freezeComplex`, `freezeInterval`, `freezeMatrix2`, `freezeMatrix3` | KEEP    |
| kebab-case file names              | All source files use kebab-case                                                                         | KEEP    |
| No default exports                 | Verified: all modules use named exports                                                                 | KEEP    |

**Finding**: No naming violations detected.

## Synergy Gaps Analysis

Synergy gaps occur when an operation could cleanly delegate to an existing primitive but instead reimplements it.

| Potential Synergy                                                       | Verdict                                                               | Notes |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ----- |
| `Vector2.refract` → uses `dot`, `addScaledVector`, deterministic `sqrt` | **GAP** — method is absent; when added it should use these primitives |
| `Rotation2.fromAngle` → uses `sinCos`                                   | KEEP — correctly uses `sinCos`                                        |
| `Rotation2.fromVectors2` → uses `hypot`, `setDirect`                    | KEEP — correct delegation                                             |
| `Vector2.slerp` → uses `acosSafe`, `sin`, `lerp`                        | KEEP — correct delegation                                             |
| `roundToPowerOfTwo` → uses deterministic `log`                          | KEEP — correctly uses deterministic kernel                            |
| `logSafe` → uses kernel `log`                                           | KEEP — correct layering                                               |
| `compensatedProduct` → pure arithmetic, no delegation needed            | KEEP                                                                  |
| `Complex.exp` → uses deterministic `exp`, `sinCos`                      | KEEP — correct delegation                                             |
| `lerpAngle` → uses `angleDifference`                                    | KEEP — correct delegation                                             |

**Finding**: The only synergy gap is the absent `Vector2.refract` method.

## Summary of Cross-Cutting Issues

1. **Layer violations**: None found.
2. **Triality gaps**: One — `Vector2.refract` / `refractSafe` / `refractUnchecked`.
3. **`out` param gaps**: None found.
4. **`*CS` variant gaps**: None found.
5. **Naming violations**: None found.
6. **Synergy gaps**: One — tied to the absent `Vector2.refract`.
7. **Subpath export leakage**: `pow2` and `logKernelSafe` tagged `@internal` but accessible via `./deterministic` subpath (confirmed in deterministic-layer-verdict.md).
8. **Package-level misplacement**: `utils/performance.ts` is pure devtools with zero math imports (confirmed in validation-utils-verdict.md).
