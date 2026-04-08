## 1. Scalar exports — @since 0.7.0 → @since 0.5.0

These 13 exports existed in the v0.5.0 scalar module. Change their `@since 0.7.0` to `@since 0.5.0`. Leave all other exports in these files as `@since 0.7.0`.

- [x] 1.1 In `packages/math2d/src/auxiliary/scalar/constants.ts`: change `@since` to `0.5.0` for `PI`, `HALF_PI`, `TAU`, `EPSILON`, `DEG_TO_RAD`, `RAD_TO_DEG`
- [x] 1.2 In `packages/math2d/src/auxiliary/scalar/arithmetic.ts`: change `@since` to `0.5.0` for `clamp`, `sign`, `saturate`
- [x] 1.3 In `packages/math2d/src/auxiliary/scalar/interpolation.ts`: change `@since` to `0.5.0` for `lerp`, `smoothStep`
- [x] 1.4 In `packages/math2d/src/auxiliary/scalar/comparison.ts`: change `@since` to `0.5.0` for `nearEquals`, `relativeEquals`

## 2. Matrix2 — @since 0.7.0 → @since 0.6.0

File: `packages/math2d/src/core/matrix2.ts`

Change `@since 0.7.0` to `@since 0.6.0` for all symbols that existed in v0.6.0's `Mat2` class. DO NOT touch symbols in the genuinely-new allowlist (ELEMENT_COUNT, FLIP_X, FLIP_Y, FLIP_XY, addScalar, subtractScalar, clamp, clampScalar, compose, decompose, divideScalar, divideScalarSafe, divideScalarUnchecked, eigendecompose, eigenvalues, fma, fromAngleScale, fromDiagonal, fromMatrix, fromReflection, getScale, hasInfinity, hasNaN, inverseUnchecked, isDiagonal, isNearZero, isSkewSymmetric, isSymmetric, isZero, lerp, lerpClamped, max, min, mod, modScalar, negate, setFromArray, sign, smoothStep, solveLinearSystemUnchecked, toMatrix, trunc).

**Same-name methods (static + instance):**

- [x] 2.1 Constants and properties: `m00`, `m01`, `m10`, `m11`, constructor
- [x] 2.2 Factories: `clone`, `copy`, `fromValues`, `fromArray`, `fromColumns`, `fromRows`, `fromRotation`, `fromShear`
- [x] 2.3 Arithmetic: `add`, `multiply`, `multiplyScalar`, `transpose`, `adjugate`
- [x] 2.4 Computed: `determinant`, `trace`, `frobeniusNorm`
- [x] 2.5 Transform: `inverse`, `inverseSafe`, `transformVector`, `rotate`, `rotateCS`, `premultiply`
- [x] 2.6 Comparison: `nearEquals`, `isFinite`, `isIdentity`
- [x] 2.7 Accessors/conversion: `getColumn`, `getRow`, `setColumn`, `setRow`, `set`, `identity`, `zero`, `toArray`, `toJSON`, `toObject`, `toString`
- [x] 2.8 Component-wise: `abs`, `ceil`, `floor`, `round`

**Renamed methods (also → @since 0.6.0):**

- [x] 2.9 Constants: `IDENTITY` (was IDENTITY_MATRIX), `ZERO` (was ZERO_MATRIX), `ROTATE_90` (was ROT90_CCW_MATRIX), `ROTATE_180` (was ROT180_MATRIX), `ROTATE_270` (was ROT90_CW_MATRIX)
- [x] 2.10 `exactEquals` (was `equals`), `subtract` (was `sub`), `fromScale` (was `fromScaling`), `scaleBy` (was `scale`)
- [x] 2.11 `solveLinearSystem`, `solveLinearSystemSafe` (was `solve`, `solveSafe`)
- [x] 2.12 `getRotation` (was `angleOfRotation`/`angle`), `isInvertible` (was `isSingular`), `isOrthogonal` (was `isRotation`)

## 3. Vector2 — @since 0.7.0 → @since 0.6.0

File: `packages/math2d/src/core/vector2.ts`

Change `@since 0.7.0` to `@since 0.6.0` for all symbols that existed in v0.6.0. DO NOT touch symbols in the genuinely-new allowlist (ELEMENT_COUNT, applyComplex, applyMatrix, applyMatrix2, applyMatrix3, applyRotation, applyRotation2, applyTransform, applyTransform2, chebyshevDistance, chebyshevDistanceTo, chebyshevLength, directionSafe, directionToSafe, directionToUnchecked, directionUnchecked, divideScalarUnchecked, divideUnchecked, fma, fromComplex, getLengthAndNormalize, hasInfinity, hasNaN, inverseUnchecked, normalizeUnchecked, projectUnchecked, reflectUnchecked, rejectOnUnit, rejectSafe, rejectUnchecked, setFromAngle, setFromArray, setFromComplex, setMagnitudeUnchecked, sign, slerp, slerpClamped, smoothStep, step, toComplexLike, trunc, maxScalar, minScalar).

**Same-name methods — static:**

- [x] 3.1 Factories: `clone`, `copy`, `fromValues`, `fromArray`, `fromObject`, `fromAngle`
- [x] 3.2 Arithmetic: `add`, `addScalar`, `addScaledVector`, `multiply`, `multiplyScalar`, `divide`, `divideScalar`, `divideSafe`, `divideScalarSafe`, `mod`, `modScalar`, `negate`, `sumComponents`
- [x] 3.3 Computed: `dot`, `cross`, `cross3`, `angle`, `angleTo`, `angleBetween`, `distance`, `manhattanDistance`, `manhattanLength`
- [x] 3.4 Transform: `direction`, `normalize`, `normalizeSafe`, `setAngle` (group with renamed), `rotate`, `rotateCS`, `rotateAround`, `rotateAroundCS`, `perpendicular`
- [x] 3.5 Projection/reflection: `project`, `projectOnUnit`, `projectSafe`, `reflect`, `reflectSafe`, `reject`, `crossScalarRight`, `crossScalarLeft`
- [x] 3.6 Constraint: `clamp`, `clampScalar`, `limit`, `min`, `max`, `swap`
- [x] 3.7 Comparison: `nearEquals`, `isZero`, `isUnit`, `isFinite`, `isParallel`, `isPerpendicular`
- [x] 3.8 Component-wise: `abs`, `ceil`, `floor`, `round`, `inverse`, `inverseSafe`
- [x] 3.9 Interpolation: `lerp`, `lerpClamped`, `midpoint` (if present)

**Same-name methods — instance:**

- [x] 3.10 Properties and constructor: `x`, `y`, `set`, `setX`, `setY`, `setScalar`, `setComponent`, `getComponent`, `clone`, `copy`, `zero`
- [x] 3.11 Arithmetic: `add`, `addScalar`, `addScaledVector`, `multiply`, `multiplyScalar`, `divide`, `divideScalar`, `divideSafe`, `divideScalarSafe`, `mod`, `modScalar`, `negate`, `sumComponents`
- [x] 3.12 Computed: `dot`, `cross`, `cross3`, `angleTo`, `angleBetween`, `distanceTo`, `manhattanDistanceTo`, `manhattanLength`
- [x] 3.13 Transform: `directionTo`, `normalize`, `normalizeSafe`, `rotate`, `rotateCS`, `rotateAround`, `rotateAroundCS`, `perpendicular`
- [x] 3.14 Projection/reflection: `project`, `projectOnUnit`, `projectSafe`, `reflect`, `reflectSafe`, `reject`, `crossScalarRight`, `crossScalarLeft`
- [x] 3.15 Constraint: `clamp`, `clampScalar`, `limit`, `min`, `max`, `swap`
- [x] 3.16 Comparison: `nearEquals`, `isZero`, `isUnit`, `isFinite`, `isParallelTo`, `isPerpendicularTo`
- [x] 3.17 Component-wise: `abs`, `ceil`, `floor`, `round`, `inverse`, `inverseSafe`
- [x] 3.18 Interpolation/conversion: `lerp`, `lerpClamped`, `toArray`, `toJSON`, `toObject`, `toString`

**Renamed methods (also → @since 0.6.0) — static + instance:**

- [x] 3.19 Constants: `ZERO`, `ONE`, `NEGATIVE_ONE`, `POSITIVE_INFINITY`, `NEGATIVE_INFINITY`, `UNIT_X`, `UNIT_Y`, `NEGATIVE_UNIT_X`, `NEGATIVE_UNIT_Y`, `UNIT_DIAGONAL`, `NEGATIVE_UNIT_DIAGONAL`
- [x] 3.20 `magnitude` / `magnitudeSq` (was `length` / `lengthSq`)
- [x] 3.21 `distanceSquared` / `distanceSquaredTo` (was `distanceSq` / `distanceToSq`)
- [x] 3.22 `subtract` / `subtractScalar` (was `sub` / `subScalar`)
- [x] 3.23 `clampMagnitude` (was `clampLength`)
- [x] 3.24 `setAngle` (was `setHeading`) — static + instance
- [x] 3.25 `setMagnitude` / `setMagnitudeSafe` (was `setLength` / `setLengthSafe`)
- [x] 3.26 `isNearZero` (was `nearZero`)
- [x] 3.27 `exactEquals` (was `equals`)

**Getter/setter accessors converted from methods:**

- [x] 3.28 `get angle` / `set angle` accessor pair (was `angle()` instance method) — the instance accessor should be `@since 0.6.0`

## 4. Verification and regeneration

- [x] 4.1 Verify: count remaining `@since 0.7.0` in `vector2.ts` — must equal the number of genuinely-new methods in the allowlist
- [x] 4.2 Verify: count remaining `@since 0.7.0` in `matrix2.ts` — must equal the number of genuinely-new methods in the allowlist
- [x] 4.3 Verify: no `@since 0.7.0` remains in the 4 scalar files for the 13 inherited exports
- [x] 4.4 Verify: files NOT in scope (complex, interval, matrix3, rotation2, transform2, deterministic, types, validation, auxiliary/numeric, auxiliary/angle) have zero changes
- [x] 4.5 Run `npm run build` — confirm no build regressions
- [x] 4.6 Run `npm run test:unit` — confirm no test regressions
- [x] 4.7 Regenerate API docs (`npm run docs`)
- [x] 4.8 Final review: spot-check 5 genuinely-new methods still have `@since 0.7.0` and 5 inherited methods now have `@since 0.6.0` or `@since 0.5.0`
