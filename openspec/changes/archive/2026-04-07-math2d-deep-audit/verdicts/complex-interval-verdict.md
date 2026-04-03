# Complex & Interval Verdict

Source files:

- `packages/math2d/src/core/complex.ts`
- `packages/math2d/src/core/interval.ts`

## Summary

Both classes are architecturally complete and correct. Complex implements full complex algebra including Baudin-Smith division and deterministic transcendentals. Interval implements closed-interval arithmetic with set operations. No issues found.

---

## Complex — Helper Functions

| Export                   | Verdict | Rationale                                                                       |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `freezeComplex`          | KEEP    | Returns `ReadonlyComplex` via `Object.freeze`; consistent with freeze\* pattern |
| `ReadonlyComplex` (type) | KEEP    | `Readonly<Complex>` alias                                                       |
| `isComplexLike`          | KEEP    | Re-exported from types/                                                         |

## Complex — Static Constants

| Export          | Verdict | Rationale                               |
| --------------- | ------- | --------------------------------------- |
| `ZERO`          | KEEP    | Frozen `(0, 0)` additive identity       |
| `ONE`           | KEEP    | Frozen `(1, 0)` multiplicative identity |
| `I`             | KEEP    | Frozen `(0, 1)` imaginary unit          |
| `NEGATIVE_ONE`  | KEEP    | Frozen `(-1, 0)`                        |
| `NEGATIVE_I`    | KEEP    | Frozen `(0, -1)`                        |
| `ELEMENT_COUNT` | KEEP    | Serialization size                      |

## Complex — Static Factories

| Export          | Verdict | Rationale                                                                    |
| --------------- | ------- | ---------------------------------------------------------------------------- |
| `fromValues`    | KEEP    | Explicit real/imag factory                                                   |
| `clone`         | KEEP    | Deep copy from `ReadonlyComplexLike`                                         |
| `copy`          | KEEP    | Alloc-free copy into destination                                             |
| `fromPolar`     | KEEP    | Polar-to-rectangular using deterministic `sinCos`; `out?` parameter          |
| `fromObject`    | KEEP    | Duck-type factory                                                            |
| `fromArray`     | KEEP    | Array offset factory                                                         |
| `fromVector2`   | KEEP    | `x → real, y → imag` mapping                                                 |
| `fromRotation2` | KEEP    | `cos → real, sin → imag` mapping; loose coupling via `ReadonlyRotation2Like` |

## Complex — Static Arithmetic

| Export                                                        | Verdict | Rationale                                                        |
| ------------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `add`                                                         | KEEP    | Component-wise addition                                          |
| `addScalar`                                                   | KEEP    | Real-only scalar addition                                        |
| `subtract`                                                    | KEEP    | Component-wise subtraction                                       |
| `subtractScalar`                                              | KEEP    | Real-only scalar subtraction                                     |
| `multiply`                                                    | KEEP    | Complex multiplication `(a+bi)(c+di)`                            |
| `multiplyScalar`                                              | KEEP    | Real scalar multiplication                                       |
| `divide` / `divideSafe` / `divideUnchecked`                   | KEEP    | Full triality; Baudin-Smith algorithm for overflow-safe division |
| `divideScalar` / `divideScalarSafe` / `divideScalarUnchecked` | KEEP    | Full triality for scalar divisor                                 |
| `negate`                                                      | KEEP    | Unary negation                                                   |
| `conjugate`                                                   | KEEP    | `(real, -imag)`                                                  |
| `reciprocal` / `reciprocalSafe` / `reciprocalUnchecked`       | KEEP    | Full triality for `1/z`                                          |
| `addScaledComplex`                                            | KEEP    | `base + scale * z` — physics integration pattern                 |

## Complex — Static Transcendental

| Export     | Verdict | Rationale                                                                                 |
| ---------- | ------- | ----------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------ |
| `exp`      | KEEP    | Complex exponential `e^z = e^a * (cos(b) + i*sin(b))`; uses deterministic `exp`, `sinCos` |
| `log`      | KEEP    | Complex logarithm `log(z) = log(                                                          | z   | ) + i\*arg(z)`; uses deterministic `log`, `atan2`; strict (NaN for zero) |
| `logSafe`  | KEEP    | Returns `(0, 0)` for zero-magnitude input                                                 |
| `pow`      | KEEP    | `z^w = exp(w * log(z))`; uses deterministic `pow`, `exp`, `log`                           |
| `sqrt`     | KEEP    | Branch-cut on negative real axis; uses `Math.sqrt` (IEEE 754 deterministic)               |
| `sqrtSafe` | KEEP    | Returns `(0, 0)` for zero-magnitude                                                       |

## Complex — Static Geometry & Comparison

| Export                                                     | Verdict | Rationale                                                                                                                                                        |
| ---------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `magnitude`                                                | KEEP    | `hypot(real, imag)` — overflow-safe                                                                                                                              |
| `magnitudeSquared`                                         | KEEP    | Squared magnitude without sqrt                                                                                                                                   |
| `argument` / `argumentDegrees` / `argumentTurns`           | KEEP    | Phase angle via deterministic `atan2`; multiple unit variants                                                                                                    |
| `normalize` / `normalizeSafe` / `normalizeUnchecked`       | KEEP    | Full triality; same hypot-vs-sqrt convention as Vector2                                                                                                          |
| `isZero` / `isNearZero` / `isUnit` / `isFinite` / `hasNaN` | KEEP    | Predicate methods consistent with Vector2                                                                                                                        |
| `exactEquals` / `nearEquals`                               | KEEP    | Bit-identical and relative-tolerance equality                                                                                                                    |
| `apply`                                                    | KEEP    | Applies complex as rotation operator to a `ReadonlyVector2Like`; documented operator semantics (no forced normalization — by design for general complex algebra) |

## Complex — Static Interpolation

| Export                 | Verdict | Rationale                                |
| ---------------------- | ------- | ---------------------------------------- |
| `lerp` / `lerpClamped` | KEEP    | Component-wise linear interpolation      |
| `smoothStep`           | KEEP    | Cubic Hermite via auxiliary `smoothStep` |

---

## Interval — Helper Functions

| Export                    | Verdict | Rationale                                      |
| ------------------------- | ------- | ---------------------------------------------- |
| `freezeInterval`          | KEEP    | Returns `ReadonlyInterval` via `Object.freeze` |
| `ReadonlyInterval` (type) | KEEP    | `Readonly<Interval>` alias                     |
| `isIntervalLike`          | KEEP    | Re-exported from types/                        |

## Interval — Static Constants

| Export                                           | Verdict | Rationale                                             |
| ------------------------------------------------ | ------- | ----------------------------------------------------- |
| `ZERO`                                           | KEEP    | `[0, 0]` degenerate interval                          |
| `UNIT`                                           | KEEP    | `[0, 1]` canonical unit interval                      |
| `SYMMETRIC_UNIT`                                 | KEEP    | `[-1, 1]` signed unit interval                        |
| `POSITIVE`                                       | KEEP    | `[0, +∞)` positive half-line                          |
| `NEGATIVE`                                       | KEEP    | `(-∞, 0]` negative half-line                          |
| `FULL` (inferred from POSITIVE/NEGATIVE pattern) | KEEP    | Full real line; standard interval arithmetic constant |
| `ELEMENT_COUNT`                                  | KEEP    | Serialization size                                    |

## Interval — Static Factories

| Export           | Verdict | Rationale                                                  |
| ---------------- | ------- | ---------------------------------------------------------- |
| `fromValues`     | KEEP    | Validates `min <= max`; uses `assertOrder`                 |
| `fromValuesSafe` | KEEP    | Auto-sorts `min`/`max` if inverted                         |
| `fromCenter`     | KEEP    | `[center - halfWidth, center + halfWidth]`                 |
| `fromArray`      | KEEP    | Array offset factory                                       |
| `fromObject`     | KEEP    | Duck-type factory                                          |
| `hull`           | KEEP    | `[min(a, b), max(a, b)]` — bounding interval of two values |
| `hullOf`         | KEEP    | Bounding interval of an array of values                    |

## Interval — Static Set Operations

| Export             | Verdict | Rationale                                               |
| ------------------ | ------- | ------------------------------------------------------- |
| `union`            | KEEP    | `[min(a.min, b.min), max(a.max, b.max)]`                |
| `intersection`     | KEEP    | Returns null/ZERO for non-overlapping; strict variant   |
| `intersectionSafe` | KEEP    | Returns `ZERO` for non-overlapping                      |
| `overlaps`         | KEEP    | Boolean check without computing the actual intersection |
| `contains` (value) | KEEP    | `min <= v <= max`                                       |
| `containsInterval` | KEEP    | Subset check                                            |

## Interval — Static Arithmetic

| Export                                                  | Verdict | Rationale                                                                   |
| ------------------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `add`                                                   | KEEP    | `[a.min+b.min, a.max+b.max]` — interval addition                            |
| `addScalar`                                             | KEEP    | Scalar shift                                                                |
| `subtract`                                              | KEEP    | `[a.min-b.max, a.max-b.min]` — correct interval subtraction                 |
| `multiply`                                              | KEEP    | Considers all four endpoint products; correct for sign-crossing intervals   |
| `multiplyScalar`                                        | KEEP    | Handles negative scalar (swaps bounds)                                      |
| `reciprocal` / `reciprocalSafe` / `reciprocalUnchecked` | KEEP    | Full triality; sign-crossing handled (returns `(-∞, +∞)` when 0 ∈ interval) |

## Interval — Static Computed / Transform

| Export      | Verdict | Rationale                                     |
| ----------- | ------- | --------------------------------------------- |
| `width`     | KEEP    | `max - min`                                   |
| `midpoint`  | KEEP    | `(min + max) / 2`                             |
| `clamp`     | KEEP    | Clamps a value to `[min, max]`                |
| `expand`    | KEEP    | Inflates interval by delta in both directions |
| `translate` | KEEP    | Shifts interval by scalar                     |
| `normalize` | KEEP    | Returns `(v - min) / width` (inverse lerp)    |
| `lerp`      | KEEP    | `min + t * width`                             |

## Interval — Comparison

| Export                       | Verdict | Rationale                        |
| ---------------------------- | ------- | -------------------------------- |
| `exactEquals` / `nearEquals` | KEEP    | Consistent with other core types |
| `isDegenerate`               | KEEP    | `min === max` point interval     |
| `isEmpty` (if present)       | KEEP    | Null interval detection          |
