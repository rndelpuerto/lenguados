## ADDED Requirements

### Requirement: TSDoc examples MUST match runtime behavior

Every `@example` block in TSDoc documentation SHALL produce the exact output stated in comments when executed. Documentation that contradicts runtime behavior erodes consumer trust and constitutes a defect.

#### Scenario: relativeEquals TSDoc documents Ericson combined tolerance

WHEN `relativeEquals(0.001, 0.002, 0.01)` is called
THEN the TSDoc example at `comparison.ts` SHALL document the return value as `true`
AND the explanation SHALL note that the `Math.max(1, |a|, |b|)` floor (Christer Ericson's combined tolerance pattern) causes the threshold to be `0.01 * 1 = 0.01`, making `|0.001 - 0.002| = 0.001 <= 0.01` true

#### Scenario: angleBisector TSDoc matches (-PI, PI] convention

WHEN `angleBisector(-Math.PI / 2, Math.PI / 2)` is called
THEN the TSDoc example at `operations.ts` SHALL document the return value as `0`
AND the explanation SHALL note that `angleDifference(-PI/2, PI/2)` returns `PI` with the `(-PI, PI]` convention, giving bisector at `-PI/2 + PI*0.5 = 0`

#### Scenario: angleBisector(0, PI) matches (-PI, PI] convention

WHEN `angleBisector(0, Math.PI)` is called
THEN the TSDoc SHALL document the return value as `Math.PI / 2`

#### Scenario: unwrapAngles uses non-ambiguous examples

WHEN reviewing the `unwrapAngles` TSDoc examples
THEN the `[0, Math.PI, 0]` example SHALL document `[0, Math.PI, 2 * Math.PI]` (continuous CCW)
AND the reference example SHALL use a value that demonstrates the feature (e.g., `-2 * Math.PI`)

#### Scenario: AngleUnwrapper uses non-ambiguous examples

WHEN reviewing the `AngleUnwrapper` class TSDoc
THEN the examples SHALL avoid the exact PI boundary and use values like `[0, 3, -3]` to demonstrate continuous unwrapping without ambiguity

### Requirement: PI-boundary behavior MUST be documented with (-PI, PI] convention

Any TSDoc or `@remarks` referencing the normalization range SHALL use `(-PI, PI]` (PI included, -PI excluded), matching the IEEE 754 atan2 convention, the mathematical principal argument Arg(z), and the library's CCW-positive convention.

#### Scenario: angleDifference PI boundary documentation

WHEN reviewing the TSDoc for `angleDifference`
THEN there SHALL be a remark explaining that `angleDifference(0, PI)` and `angleDifference(PI, 0)` both return `+PI` (anti-symmetry breaks at the PI boundary)
AND the documented range SHALL be `(-PI, PI]`

### Requirement: Rotation2.copy normalization asymmetry MUST be documented

The `Rotation2.copy` method SHALL include a `@remarks` note stating that unlike `clone()` and `set()`, it does NOT normalize the input components. Consumers copying from non-unit-length rotation-like objects MUST normalize separately.

#### Scenario: Rotation2.copy documentation includes normalization warning

WHEN reviewing the TSDoc for `Rotation2.copy`
THEN there SHALL be a `@remarks` section stating: "Unlike clone() and set(), copy() does NOT normalize. The source MUST already be unit-length. Use fromCS() or set() if normalization is needed."

### Requirement: isParallel and isPerpendicular scale-dependence MUST be documented

The `Vector2.isParallel` and `Vector2.isPerpendicular` static and instance methods SHALL include a `@remarks` note documenting that the epsilon comparison is applied to the raw cross/dot product (not normalized), making the functions scale-dependent.

#### Scenario: isParallel documentation includes scale-dependence warning

WHEN reviewing the TSDoc for `Vector2.isParallel`
THEN there SHALL be a `@remarks` noting the epsilon is applied to the raw cross product, not normalized by vector magnitudes. For scale-invariant comparison, normalize both vectors first.

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
