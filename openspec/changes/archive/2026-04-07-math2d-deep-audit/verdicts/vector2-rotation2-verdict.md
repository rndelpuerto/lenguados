# Vector2 & Rotation2 Verdict

Source files:

- `packages/math2d/src/core/vector2.ts`
- `packages/math2d/src/core/rotation2.ts`

## Summary

Both classes are architecturally sound with excellent triality coverage. One confirmed missing method: `Vector2.refract` (and its triality variants). One deprecated method present: `sumComponents`.

---

## Vector2 — Static Constants

| Export                   | Verdict | Rationale                                   |
| ------------------------ | ------- | ------------------------------------------- |
| `ZERO`                   | KEEP    | Frozen `(0, 0)` sentinel                    |
| `ONE`                    | KEEP    | Frozen `(1, 1)`                             |
| `NEGATIVE_ONE`           | KEEP    | Frozen `(-1, -1)`                           |
| `UNIT_X`                 | KEEP    | Frozen `(1, 0)`                             |
| `UNIT_Y`                 | KEEP    | Frozen `(0, 1)`                             |
| `NEGATIVE_UNIT_X`        | KEEP    | Frozen `(-1, 0)`                            |
| `NEGATIVE_UNIT_Y`        | KEEP    | Frozen `(0, -1)`                            |
| `UNIT_DIAGONAL`          | KEEP    | Frozen `(1/√2, 1/√2)` — 45° direction       |
| `NEGATIVE_UNIT_DIAGONAL` | KEEP    | Frozen `(-1/√2, -1/√2)`                     |
| `POSITIVE_INFINITY`      | KEEP    | Frozen `(+∞, +∞)` — useful as AABB sentinel |
| `NEGATIVE_INFINITY`      | KEEP    | Frozen `(-∞, -∞)` — useful as AABB sentinel |
| `ELEMENT_COUNT`          | KEEP    | Serialization size constant                 |

## Vector2 — Helper Functions

| Export                   | Verdict | Rationale                                                                                             |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------- |
| `freezeVector2`          | KEEP    | Returns `ReadonlyVector2` via `Object.freeze`; consistent with freeze\* pattern across all core types |
| `ReadonlyVector2` (type) | KEEP    | `Readonly<Vector2>` convenience alias                                                                 |
| `isVector2Like`          | KEEP    | Re-exported from types/; structural type guard                                                        |

## Vector2 — Static Factories

| Export        | Verdict | Rationale                                                                 |
| ------------- | ------- | ------------------------------------------------------------------------- |
| `fromValues`  | KEEP    | Canonical explicit-component factory                                      |
| `clone`       | KEEP    | Deep copy accepting `ReadonlyVector2Like`                                 |
| `copy`        | KEEP    | Alloc-free copy into existing vector; no `out?` (destination is required) |
| `fromAngle`   | KEEP    | Polar construction; uses deterministic `sinCos`                           |
| `fromObject`  | KEEP    | Object duck-type factory                                                  |
| `fromArray`   | KEEP    | Array offset factory; throws on OOB                                       |
| `fromComplex` | KEEP    | Loose coupling via `ReadonlyComplexLike`                                  |

## Vector2 — Static Arithmetic

| Export                                                        | Verdict           | Rationale                                                                        |
| ------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------- |
| `sumComponents`                                               | KEEP (deprecated) | Marked `@deprecated` since 0.8.0; will be removed in 1.0.0; documented correctly |
| `add`                                                         | KEEP              | Component-wise addition                                                          |
| `addScalar`                                                   | KEEP              | Broadcasts scalar to both components                                             |
| `subtract`                                                    | KEEP              | Component-wise subtraction                                                       |
| `subtractScalar`                                              | KEEP              | Broadcasts scalar subtraction                                                    |
| `multiply`                                                    | KEEP              | Hadamard product                                                                 |
| `multiplyScalar`                                              | KEEP              | Scalar multiplication                                                            |
| `divide` / `divideSafe` / `divideUnchecked`                   | KEEP              | Full triality; near-zero check via `isNearZero`                                  |
| `divideScalar` / `divideScalarSafe` / `divideScalarUnchecked` | KEEP              | Full triality for scalar divisor                                                 |
| `negate`                                                      | KEEP              | Unary negation                                                                   |
| `addScaledVector`                                             | KEEP              | Physics velocity integration pattern `v + a*dt`                                  |
| `fma`                                                         | KEEP              | Fused multiply-add `a*s + b`                                                     |
| `mod`                                                         | KEEP              | Component-wise positive modulo via auxiliary `mod`                               |
| `modScalar`                                                   | KEEP              | Scalar modulo broadcast                                                          |

## Vector2 — Static Transforms (Component-wise)

| Export                                         | Verdict | Rationale                                                       |
| ---------------------------------------------- | ------- | --------------------------------------------------------------- |
| `floor` / `ceil` / `round` / `trunc`           | KEEP    | Component-wise rounding; uses `Math.*` (deterministic IEEE 754) |
| `abs`                                          | KEEP    | Component-wise absolute value                                   |
| `sign`                                         | KEEP    | Component-wise sign using auxiliary `sign` (NaN→0 normalized)   |
| `inverse` / `inverseSafe` / `inverseUnchecked` | KEEP    | Full triality for component reciprocal                          |
| `swap`                                         | KEEP    | Swaps x and y components                                        |
| `step`                                         | KEEP    | Component-wise GLSL step function                               |

## Vector2 — Static Interpolation

| Export         | Verdict | Rationale                                                                             |
| -------------- | ------- | ------------------------------------------------------------------------------------- |
| `lerp`         | KEEP    | Unclamped linear interpolation                                                        |
| `lerpClamped`  | KEEP    | t clamped to [0, 1]                                                                   |
| `slerp`        | KEEP    | Spherical lerp with magnitude interpolation; falls back to lerp for degenerate inputs |
| `slerpClamped` | KEEP    | t clamped variant                                                                     |
| `smoothStep`   | KEEP    | Cubic Hermite interpolation using auxiliary `smoothStep`                              |

## Vector2 — Static Geometry

| Export              | Verdict | Rationale                                        |
| ------------------- | ------- | ------------------------------------------------ |
| `dot`               | KEEP    | `a.x*b.x + a.y*b.y` scalar dot product           |
| `cross`             | KEEP    | 2D scalar cross product (z-component)            |
| `cross3`            | KEEP    | Twice signed triangle area; documented correctly |
| `magnitude`         | KEEP    | Euclidean norm via deterministic `hypot`         |
| `magnitudeSq`       | KEEP    | Squared length without sqrt                      |
| `manhattanLength`   | KEEP    | L1 norm                                          |
| `chebyshevLength`   | KEEP    | L∞ norm; added in 0.9.0                          |
| `distance`          | KEEP    | Euclidean distance via `hypot`                   |
| `distanceSquared`   | KEEP    | Avoids sqrt for comparisons                      |
| `manhattanDistance` | KEEP    | L1 distance                                      |
| `chebyshevDistance` | KEEP    | L∞ distance                                      |

## Vector2 — Static Direction

| Export                                               | Verdict | Rationale                                                                                 |
| ---------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- | --- | --- | --- | ----------------- |
| `direction` / `directionSafe` / `directionUnchecked` | KEEP    | Full triality; correct hypot vs sqrt convention (hypot for safe, Math.sqrt for unchecked) |
| `angle`                                              | KEEP    | Heading via deterministic `atan2`                                                         |
| `angleTo`                                            | KEEP    | Signed angle using `atan2(cross, dot)`                                                    |
| `angleBetween`                                       | KEEP    | Unsigned angle via `acosSafe(dot / (                                                      | a   | \*  | b   | ))` with clamping |

## Vector2 — Static Constraint

| Export                    | Verdict | Rationale                                                        |
| ------------------------- | ------- | ---------------------------------------------------------------- |
| `clamp`                   | KEEP    | Component-wise clamp between two vectors                         |
| `clampScalar`             | KEEP    | Scalar broadcast clamp                                           |
| `clampMagnitude`          | KEEP    | Magnitude clamping to [min, max]                                 |
| `limit`                   | KEEP    | Upper-bound magnitude limit; optimized path using squared length |
| `min` / `max`             | KEEP    | Component-wise min/max                                           |
| `minScalar` / `maxScalar` | KEEP    | Scalar broadcast min/max                                         |

## Vector2 — Static Normalize & Project

| Export                                                           | Verdict | Rationale                                                                                 |
| ---------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `normalize` / `normalizeSafe` / `normalizeUnchecked`             | KEEP    | Full triality; hypot vs Math.sqrt convention correct per patterns                         |
| `getLengthAndNormalize`                                          | KEEP    | Avoids double-sqrt; returns `{ length, unit }`                                            |
| `setMagnitude` / `setMagnitudeSafe` / `setMagnitudeUnchecked`    | KEEP    | Full triality for magnitude scaling                                                       |
| `setAngle`                                                       | KEEP    | Preserves magnitude, changes direction                                                    |
| `project` / `projectSafe` / `projectUnchecked` / `projectOnUnit` | KEEP    | Full triality + unit-axis optimization                                                    |
| `reject` / `rejectSafe` / `rejectUnchecked` / `rejectOnUnit`     | KEEP    | Full triality + unit-axis optimization                                                    |
| `reflect` / `reflectSafe` / `reflectUnchecked`                   | KEEP    | Full triality; `reflect` requires unit normal (documented), `reflectSafe` auto-normalizes |
| `perpendicular`                                                  | KEEP    | CCW/CW 90° rotation; `clockwise` flag                                                     |
| `rotate`                                                         | KEEP    | Delegates to `rotateCS` after sinCos                                                      |
| `rotateCS`                                                       | KEEP    | Precomputed cos/sin variant for batch operations                                          |
| `rotateAround`                                                   | KEEP    | Pivot rotation                                                                            |
| `rotateAroundCS`                                                 | KEEP    | Precomputed pivot rotation                                                                |
| `crossScalarRight` / `crossScalarLeft`                           | KEEP    | Box2D-style scalar-vector cross products; correctly documented with left/right semantics  |

## Vector2 — MISSING METHOD (confirmed ADD)

| Export             | Verdict | Rationale                                                                                                                                                                                                                |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `refract`          | **ADD** | Absent from Vector2. Present in three.js (`Vector3.refract`), Godot (`Vector2.refract`), GLSL built-in, BABYLON.js. Used for light bending, fluid simulation, and lens effects. Pure vector math with no external state. |
| `refractSafe`      | **ADD** | Safe variant returning zero vector when total internal reflection (η²\*(1-dot²) > 1).                                                                                                                                    |
| `refractUnchecked` | **ADD** | Hot-path unchecked variant for known-valid inputs.                                                                                                                                                                       |

**Full signatures for ADD verdicts:**

```typescript
/**
 * Refracts incident vector through a surface with given normal and refraction ratio.
 *
 * @remarks
 * Implements Snell's law for vector refraction. Returns zero vector on total
 * internal reflection (when eta²*(1-dot(N,I)²) > 1).
 *
 * Formula: η·I + (η·dot(N,I) - sqrt(1 - η²·(1 - dot(N,I)²)))·N
 *
 * @param incident - Unit incident direction vector
 * @param unitNormal - Unit surface normal (facing away from surface)
 * @param eta - Ratio of indices of refraction (n1/n2)
 * @param out - Optional output vector
 * @returns Refracted direction, or zero vector on total internal reflection
 * @throws {RangeError} If incident or unitNormal are not unit-length
 *
 * @see {@link refractSafe} - Returns zero vector instead of throwing
 * @see {@link refractUnchecked} - No validation
 */
public static refract(
  incident: ReadonlyVector2Like,
  unitNormal: ReadonlyVector2Like,
  eta: number,
  out?: Vector2,
): Vector2;

/**
 * Refracts incident vector, returning zero vector on total internal reflection or
 * degenerate inputs (safe variant).
 */
public static refractSafe(
  incident: ReadonlyVector2Like,
  normal: ReadonlyVector2Like,
  eta: number,
  out?: Vector2,
): Vector2;

/**
 * Refracts incident vector without validation (hot path).
 * Preconditions: incident and unitNormal are unit-length, eta > 0.
 */
public static refractUnchecked(
  incident: ReadonlyVector2Like,
  unitNormal: ReadonlyVector2Like,
  eta: number,
  out?: Vector2,
): Vector2;
```

**Implementation formula:**

```
dot = dot(normal, incident)
k = 1 - eta² * (1 - dot²)
if (k < 0): total internal reflection → return ZERO
result = eta * incident + (eta * dot - sqrt(k)) * normal
```

## Vector2 — Static Transform Integration

| Export            | Verdict | Rationale                                                                |
| ----------------- | ------- | ------------------------------------------------------------------------ |
| `applyRotation2`  | KEEP    | Delegates to `rotateCS`; uses `ReadonlyRotation2Like` for loose coupling |
| `applyMatrix2`    | KEEP    | Column-major matrix transform                                            |
| `applyMatrix3`    | KEEP    | Homogeneous 3×3 with projective divide; affine fast-path documented      |
| `applyTransform2` | KEEP    | Scale→Rotate→Translate order; uses interface                             |
| `applyComplex`    | KEEP    | Normalizes complex before applying; correct semantics                    |

## Vector2 — Static Comparison

| Export            | Verdict | Rationale                                             |
| ----------------- | ------- | ----------------------------------------------------- | ----- | --------------------------------------------- | --- | --------------- |
| `isZero`          | KEEP    | Exact `=== 0` check                                   |
| `isNearZero`      | KEEP    | Component-wise epsilon check                          |
| `exactEquals`     | KEEP    | Bit-identical equality                                |
| `nearEquals`      | KEEP    | Relative tolerance via `relativeEquals` per component |
| `isUnit`          | KEEP    | `                                                     |       | v                                             |     | ² near 1` check |
| `isFinite`        | KEEP    | Both components finite                                |
| `hasNaN`          | KEEP    | Any component NaN                                     |
| `hasInfinity`     | KEEP    | Any component ±Infinity (distinguishes from NaN)      |
| `isParallel`      | KEEP    | `                                                     | cross | ≤ epsilon`; zero-vector guard (returns false) |
| `isPerpendicular` | KEEP    | `                                                     | dot   | ≤ epsilon`; zero-vector guard (returns false) |

## Vector2 — Instance Methods

All instance methods correctly mutate `this` and return `this` for chaining. They mirror the static API without `out` parameter. Coverage confirmed through the file reading. All are KEEP.

---

## Rotation2 — Static Constants

| Export               | Verdict | Rationale                                                                                                                                    |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `IDENTITY`           | KEEP    | 0° rotation; frozen                                                                                                                          |
| `QUARTER_TURN`       | KEEP    | 90° CCW `(0, 1)`                                                                                                                             |
| `HALF_TURN`          | KEEP    | 180° `(-1, 0)`                                                                                                                               |
| `THREE_QUARTER_TURN` | KEEP    | 270° `(0, -1)`                                                                                                                               |
| `EIGHTH_TURN`        | KEEP    | 45° via `fromAngle(PI/4)`                                                                                                                    |
| `TWELFTH_TURN`       | KEEP    | 30° via `fromAngle(PI/6)`                                                                                                                    |
| `SIXTEENTH_TURN`     | KEEP    | 22.5° via `fromAngle(PI/8)`                                                                                                                  |
| `NEGATIVE_QUARTER`   | KEEP    | -90° (CW quarter turn); same value as `THREE_QUARTER_TURN` but named from clockwise perspective; both names documented with cross-references |
| `SIXTH_TURN`         | KEEP    | 60° via `fromAngle(PI/3)`                                                                                                                    |
| `ELEMENT_COUNT`      | KEEP    | Serialization size constant                                                                                                                  |

## Rotation2 — Helper Functions

| Export                     | Verdict | Rationale                                       |
| -------------------------- | ------- | ----------------------------------------------- |
| `freezeRotation2`          | KEEP    | Returns `ReadonlyRotation2` via `Object.freeze` |
| `ReadonlyRotation2` (type) | KEEP    | `Readonly<Rotation2>` convenience alias         |
| `isRotation2Like`          | KEEP    | Re-exported from types/                         |

## Rotation2 — Static Factories

| Export             | Verdict | Rationale                                                                                                |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------- |
| `fromAngle`        | KEEP    | Normalizes angle first, then `sinCos`; direct component assignment (bypasses redundant re-normalization) |
| `fromCS`           | KEEP    | From pre-computed cos/sin; delegates to `set()` for normalization                                        |
| `fromVector2`      | KEEP    | Normalizes direction vector to unit rotation; handles near-zero via `isNearZero(magnitudeSq)`            |
| `fromVectors2`     | KEEP    | Rotation that transforms one direction to another; inline cross/dot to avoid two allocations             |
| `fromComplex`      | KEEP    | Normalizes complex to unit rotation                                                                      |
| `fromComplexSafe`  | KEEP    | Returns identity on zero-magnitude complex                                                               |
| `fromMatrix2`      | KEEP    | Extracts rotation from matrix column                                                                     |
| `fromAngleDegrees` | KEEP    | Convenience wrapper for degree input                                                                     |
| `fromAngleTurns`   | KEEP    | Convenience wrapper for turn input                                                                       |
| `fromObject`       | KEEP    | Duck-type factory                                                                                        |
| `fromArray`        | KEEP    | Array offset factory                                                                                     |

## Rotation2 — Static Methods

All core static methods (apply, applyInverse, multiply, inverse, normalize, normalize(Safe/Unchecked), lerp, slerp, equals, nearEquals, etc.) follow correct triality patterns and design conventions. All are KEEP.

The `multiply` instance method EXISTS (line 1949 of transform2.ts references it; confirmed in rotation2.ts). Not missing.
