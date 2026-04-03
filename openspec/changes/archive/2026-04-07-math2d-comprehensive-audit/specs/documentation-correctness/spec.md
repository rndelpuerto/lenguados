## ADDED Requirements

### Requirement: TSDoc examples MUST match runtime behavior

Every `@example` block in TSDoc documentation SHALL produce the exact output stated in comments when executed. Documentation that contradicts runtime behavior erodes consumer trust and constitutes a defect.

#### Scenario: relativeEquals TSDoc correction

WHEN `relativeEquals(0.001, 0.002, 0.01)` is called
THEN the TSDoc example at `comparison.ts` SHALL document the return value as `true`
AND the explanation SHALL note that the `Math.max(1, |a|, |b|)` floor causes the threshold to be `0.01 * 1 = 0.01`, making `|0.001 - 0.002| = 0.001 <= 0.01` true

#### Scenario: angleBisector TSDoc correction

WHEN `angleBisector(-Math.PI / 2, Math.PI / 2)` is called
THEN the TSDoc example at `operations.ts` SHALL document the return value as `-Math.PI`
AND the explanation SHALL note that `angleDifference(-PI/2, PI/2)` returns `-PI` (not `+PI`) due to the half-open `[-PI, PI)` range, causing the bisector to land at `-PI/2 + (-PI/2) = -PI`

#### Scenario: AngleUnwrapper TSDoc correction

WHEN an `AngleUnwrapper` initialized with `next(0)` followed by `next(Math.PI)` is called
THEN the TSDoc example at `unwrapping.ts` SHALL document the return value as `-Math.PI`
AND the subsequent `next(0)` SHALL be documented as returning `-2 * Math.PI`
AND the `value` getter SHALL be documented as returning `-2 * Math.PI`

### Requirement: Ambiguous PI-boundary examples MUST include explanatory remarks

Any TSDoc example that involves the exact value `Math.PI` as input to `angleDifference`, `angleBisector`, or `AngleUnwrapper` SHALL include a `@remarks` note explaining the half-open range convention `[-PI, PI)` and that `PI` maps to `-PI`.

#### Scenario: angleDifference PI boundary documentation

WHEN reviewing the TSDoc for `angleDifference`
THEN there SHALL be a remark explaining that `angleDifference(0, PI) = -PI` because `normalizeRadians(PI) = -PI` in the half-open range `[-PI, PI)`
AND there SHALL be a note that this is mathematically correct but may be counterintuitive

### Requirement: Rotation2.copy normalization asymmetry MUST be documented

The `Rotation2.copy` method SHALL include a `@remarks` note stating that unlike `clone()` and `set()`, it does NOT normalize the input components. Consumers copying from non-unit-length rotation-like objects MUST normalize separately.

#### Scenario: Rotation2.copy documentation includes normalization warning

WHEN reviewing the TSDoc for `Rotation2.copy`
THEN there SHALL be a `@remarks` section stating: "Unlike clone() and set(), copy() does NOT normalize. The source MUST already be unit-length. Use fromCS() or set() if normalization is needed."

### Requirement: isParallel and isPerpendicular scale-dependence MUST be documented

The `Vector2.isParallel` and `Vector2.isPerpendicular` static and instance methods SHALL include a `@remarks` note documenting that the epsilon comparison is applied to the raw cross/dot product (not normalized), making the functions scale-dependent.

#### Scenario: isParallel documentation includes scale-dependence warning

WHEN reviewing the TSDoc for `Vector2.isParallel`
THEN there SHALL be a `@remarks` section stating: "The epsilon threshold is applied to the raw cross product, not normalized by vector magnitudes. For vectors with very large or very small magnitudes, consider normalizing first or using a scaled epsilon."

### Requirement: unwrapAngles PI-boundary example MUST be corrected

The `unwrapAngles` function TSDoc at line 72 of `unwrapping.ts` SHALL document the correct output for the `[0, Math.PI, 0]` input.

#### Scenario: unwrapAngles PI-boundary correction

WHEN `unwrapAngles([0, Math.PI, 0])` is called
THEN the TSDoc example SHALL document the return value as `[0, -Math.PI, -2 * Math.PI]` (not `[0, Math.PI, 0]`)
AND the explanation SHALL note that the sequence moves consistently in the negative direction because `angleDifference(0, PI) = -PI` due to the half-open `[-PI, PI)` range

### Requirement: sinCosNormalized equivalence comment MUST be corrected

The `sinCosNormalized` function TSDoc at line 61 of `operations.ts` SHALL accurately state the normalization result.

#### Scenario: sinCosNormalized comment correction

WHEN reviewing the TSDoc for `sinCosNormalized`
THEN the comment `// Equivalent to sinCos(Math.PI)` SHALL be changed to `// Equivalent to sinCos(-Math.PI)` (or `// Equivalent to sinCos(normalizeRadians(5 * Math.PI))`)
AND a note SHALL explain that `normalizeRadians(5 * Math.PI) = -Math.PI` due to the `[-PI, PI)` convention

### Requirement: AngleUnwrapper reset+next example MUST be corrected

The `AngleUnwrapper` class TSDoc at line 137 of `unwrapping.ts` SHALL document the correct output after reset.

#### Scenario: AngleUnwrapper reset example correction

WHEN an `AngleUnwrapper` calls `reset(0)` followed by `next(Math.PI)`
THEN the TSDoc SHALL document the return value as `-Math.PI` (not `Math.PI`)

### Requirement: Rotation2.angleTurns example MUST be corrected

The `Rotation2.angleTurns` getter TSDoc at line 1407 of `rotation2.ts` SHALL document the correct value for `fromAngle(Math.PI)`.

#### Scenario: Rotation2.angleTurns correction

WHEN `Rotation2.fromAngle(Math.PI).angleTurns` is computed
THEN the TSDoc SHALL document the return value as `-0.5` (not `0.5`)
AND the explanation SHALL note that `fromAngle(PI)` internally normalizes to `-PI` via the `[-PI, PI)` convention, causing `atan2(sin(-PI), cos(-PI)) = -PI` which yields `-0.5` turns

### Requirement: Matrix2 TSDoc examples MUST use correct fromScale signatures

All `@example` blocks in `matrix2.ts` that call `Matrix2.fromScale` with two numeric arguments SHALL be corrected to use the actual API signature `fromScale(scale: ReadonlyVector2Like | number, out?: Matrix2)`.

#### Scenario: Matrix2.fromScale uniform scale examples

WHEN a TSDoc example needs to create a uniform scale Matrix2 with factor 2
THEN the example SHALL use `Matrix2.fromScale(2)` (not `Matrix2.fromScale(2, 2)`)

#### Scenario: Matrix2.fromScale non-uniform scale examples

WHEN a TSDoc example needs to create a non-uniform scale Matrix2 with sx=2, sy=1
THEN the example SHALL use `Matrix2.fromScale({ x: 2, y: 1 })` (not `Matrix2.fromScale(2, 1)`)

### Requirement: Matrix3 TSDoc examples MUST use correct fromTranslation signatures

All `@example` blocks in `matrix3.ts` that call `Matrix3.fromTranslation` with two numeric arguments SHALL be corrected to use the actual API signature `fromTranslation(translation: ReadonlyVector2Like, out?: Matrix3)`.

#### Scenario: Matrix3.fromTranslation examples

WHEN a TSDoc example needs to create a translation Matrix3 for (10, 20)
THEN the example SHALL use `Matrix3.fromTranslation({ x: 10, y: 20 })` (not `Matrix3.fromTranslation(10, 20)`)
