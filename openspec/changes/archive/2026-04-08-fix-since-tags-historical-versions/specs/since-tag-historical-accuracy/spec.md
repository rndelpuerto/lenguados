## ADDED Requirements

### Requirement: Vector2 inherited symbols SHALL have @since 0.6.0

Every public method, constant, and property in `packages/math2d/src/core/vector2.ts` that existed in the v0.6.0 release (under the same name or a documented rename) MUST have `@since 0.6.0`. Both static and instance variants of the same method SHALL be corrected.

The following symbols are **genuinely new in 0.7.0** and MUST NOT be changed — they SHALL remain `@since 0.7.0`:
`ELEMENT_COUNT`, `applyComplex`, `applyMatrix`, `applyMatrix2`, `applyMatrix3`, `applyRotation`, `applyRotation2`, `applyTransform`, `applyTransform2`, `chebyshevDistance`, `chebyshevDistanceTo`, `chebyshevLength`, `directionSafe`, `directionToSafe`, `directionToUnchecked`, `directionUnchecked`, `divideScalarUnchecked`, `divideUnchecked`, `fma`, `fromComplex`, `getLengthAndNormalize`, `hasInfinity`, `hasNaN`, `inverseUnchecked`, `normalizeUnchecked`, `projectUnchecked`, `reflectUnchecked`, `rejectOnUnit`, `rejectSafe`, `rejectUnchecked`, `setFromAngle`, `setFromArray`, `setFromComplex`, `setMagnitudeUnchecked`, `sign`, `slerp`, `slerpClamped`, `smoothStep`, `step`, `toComplexLike`, `trunc`, `maxScalar`, `minScalar`.

Any `@since 0.7.0` tag on a symbol NOT in the above list SHALL be changed to `@since 0.6.0`.

#### Scenario: Same-name method (e.g., add)

- **WHEN** `Vector2.add` (static and instance) has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because `add` existed in v0.6.0 with the same name

#### Scenario: Renamed constant (e.g., ZERO)

- **WHEN** `Vector2.ZERO` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because it was `ZERO_VECTOR` in v0.6.0

#### Scenario: Renamed method (e.g., magnitude)

- **WHEN** `Vector2.magnitude` (static and instance) has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because it was `length` in v0.6.0

#### Scenario: Genuinely new method preserved (e.g., chebyshevLength)

- **WHEN** `Vector2.chebyshevLength` has `@since 0.7.0`
- **THEN** the tag SHALL remain `@since 0.7.0` because it has no v0.6.0 equivalent

#### Scenario: Post-fix verification for Vector2

- **WHEN** all edits are complete
- **THEN** every `@since 0.7.0` remaining in `vector2.ts` SHALL correspond to a symbol in the genuinely-new allowlist above

### Requirement: Matrix2 inherited symbols SHALL have @since 0.6.0

Every public method, constant, and property in `packages/math2d/src/core/matrix2.ts` that existed in the v0.6.0 `Mat2` class (under the same name or a documented rename) MUST have `@since 0.6.0`. Both static and instance variants SHALL be corrected.

The following symbols are **genuinely new in 0.7.0** and MUST NOT be changed:
`ELEMENT_COUNT`, `FLIP_X`, `FLIP_Y`, `FLIP_XY`, `addScalar`, `subtractScalar`, `clamp`, `clampScalar`, `compose`, `decompose`, `divideScalar`, `divideScalarSafe`, `divideScalarUnchecked`, `eigendecompose`, `eigenvalues`, `fma`, `fromAngleScale`, `fromDiagonal`, `fromMatrix`, `fromReflection`, `getScale`, `hasInfinity`, `hasNaN`, `inverseUnchecked`, `isDiagonal`, `isNearZero`, `isSkewSymmetric`, `isSymmetric`, `isZero`, `lerp`, `lerpClamped`, `max`, `min`, `mod`, `modScalar`, `negate`, `setFromArray`, `sign`, `smoothStep`, `solveLinearSystemUnchecked`, `toMatrix`, `trunc`.

Any `@since 0.7.0` tag on a symbol NOT in the above list SHALL be changed to `@since 0.6.0`.

#### Scenario: Same-name method (e.g., determinant)

- **WHEN** `Matrix2.determinant` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because `determinant` existed in v0.6.0's `Mat2`

#### Scenario: Renamed constant (e.g., IDENTITY)

- **WHEN** `Matrix2.IDENTITY` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because it was `IDENTITY_MATRIX` in v0.6.0

#### Scenario: Renamed method with semantic inversion (e.g., isInvertible)

- **WHEN** `Matrix2.isInvertible` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.6.0` because it was `isSingular` (inverted sense) in v0.6.0

#### Scenario: Genuinely new method preserved (e.g., eigenvalues)

- **WHEN** `Matrix2.eigenvalues` has `@since 0.7.0`
- **THEN** the tag SHALL remain `@since 0.7.0` because it has no v0.6.0 equivalent

#### Scenario: Post-fix verification for Matrix2

- **WHEN** all edits are complete
- **THEN** every `@since 0.7.0` remaining in `matrix2.ts` SHALL correspond to a symbol in the genuinely-new allowlist above

### Requirement: Scalar inherited exports SHALL have @since 0.5.0

The following 13 exports in `packages/math2d/src/auxiliary/scalar/` existed in the v0.5.0 scalar module (same name or documented rename) and MUST have `@since 0.5.0`:

**In `constants.ts`:** `PI`, `HALF_PI`, `TAU`, `EPSILON`, `DEG_TO_RAD` (was `DEG2RAD`), `RAD_TO_DEG` (was `RAD2DEG`)
**In `arithmetic.ts`:** `clamp`, `sign`, `saturate`
**In `interpolation.ts`:** `lerp`, `smoothStep`
**In `comparison.ts`:** `nearEquals` (was `epsilonEquals`), `relativeEquals`

All other exports in these files SHALL remain `@since 0.7.0`.

#### Scenario: Same-name scalar constant (e.g., PI)

- **WHEN** `PI` in `constants.ts` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.5.0`

#### Scenario: Renamed scalar constant (e.g., DEG_TO_RAD)

- **WHEN** `DEG_TO_RAD` in `constants.ts` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.5.0` because it was `DEG2RAD` in v0.5.0

#### Scenario: Renamed scalar function (e.g., nearEquals)

- **WHEN** `nearEquals` in `comparison.ts` has `@since 0.7.0`
- **THEN** the tag SHALL be changed to `@since 0.5.0` because it was `epsilonEquals` in v0.5.0

#### Scenario: New scalar export preserved (e.g., saturateSigned)

- **WHEN** `saturateSigned` in `arithmetic.ts` has `@since 0.7.0`
- **THEN** the tag SHALL remain `@since 0.7.0` because it has no v0.5.0 equivalent

### Requirement: API docs SHALL be regenerated after source fixes

The auto-generated TypeDoc output in `docs/docs/api/` SHALL be regenerated from corrected source. Manual editing of generated files is prohibited.

#### Scenario: Generated docs reflect corrected tags

- **WHEN** all source `@since` tags have been corrected
- **AND** TypeDoc generation is executed
- **THEN** generated `.md` files SHALL reflect the corrected `@since 0.6.0` and `@since 0.5.0` tags

### Requirement: Files entirely new in 0.7.0 SHALL NOT be modified

The following files are entirely new in v0.7.0 and SHALL NOT be touched by this change:
`core/complex.ts`, `core/interval.ts`, `core/matrix3.ts`, `core/rotation2.ts`, `core/transform2.ts`, `deterministic/deterministic-kernels.ts`, `types/index.ts`, `validation/assert.ts`, all files in `auxiliary/numeric/`, all files in `auxiliary/angle/`.

#### Scenario: New-in-0.7.0 file untouched

- **WHEN** this change is applied
- **THEN** `git diff` SHALL show zero changes in the files listed above
