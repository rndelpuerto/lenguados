## ADDED Requirements

### Requirement: Complex.slerp instance zero-magnitude guard

The instance method `Complex.slerp(other, t)` SHALL fall back to component-wise `lerp()` when either `this` or `other` has near-zero magnitude (using `isNearZero()`), matching the behavior of the static `Complex.slerp(a, b, t, out?)` method.

#### Scenario: Instance slerp with zero-magnitude this

- **WHEN** `this` has magnitude < EPSILON and `other` is `(3, 4)`
- **THEN** `slerp(other, 0.5)` SHALL produce the same result as `this.lerp(other, 0.5)`

#### Scenario: Instance slerp with zero-magnitude other

- **WHEN** `this` is `(3, 4)` and `other` has magnitude < EPSILON
- **THEN** `slerp(other, 0.5)` SHALL produce the same result as `this.lerp(other, 0.5)`

#### Scenario: Instance slerp with both non-zero

- **WHEN** both `this` and `other` have magnitude > EPSILON
- **THEN** `slerp(other, t)` SHALL compute spherical interpolation of magnitude and angle

#### Scenario: Static and instance slerp parity

- **WHEN** `Complex.slerp(a, b, t)` and `a.clone().slerp(b, t)` are called with identical inputs
- **THEN** both SHALL produce results within EPSILON of each other for all inputs including zero-magnitude

### Requirement: Complex.pow instance zero-to-negative validation

The instance method `Complex.pow(exponent)` SHALL throw `RangeError` when `this` has zero magnitude and `exponent` is negative, matching the static `Complex.pow(complex, exponent)` behavior.

#### Scenario: Instance pow zero base negative exponent

- **WHEN** `this` is `(0, 0)` and `pow(-1)` is called
- **THEN** a `RangeError` SHALL be thrown with message matching the static variant

#### Scenario: Instance pow zero base positive exponent

- **WHEN** `this` is `(0, 0)` and `pow(2)` is called
- **THEN** the result SHALL be `(0, 0)` without throwing

### Requirement: Matrix3 static decomposition getters

Matrix3 SHALL provide static methods `getRotation()`, `getScale()`, and `getTranslation()` that accept `ReadonlyMatrix3Like` input, enabling allocation-free decomposition without constructing a Matrix3 instance.

#### Scenario: Static getRotation extracts angle

- **WHEN** a Matrix3 is composed from `fromRotation(PI / 4)` (45-degree rotation)
- **THEN** `Matrix3.getRotation(matrix)` SHALL return a value within EPSILON of `PI / 4`

#### Scenario: Static getRotation with near-zero scale

- **WHEN** a Matrix3 has near-zero scale (columns near zero magnitude)
- **THEN** `Matrix3.getRotation(matrix)` SHALL return `0`

#### Scenario: Static getScale extracts scale vector

- **WHEN** a Matrix3 is composed from `fromScaling(new Vector2(2, 3))`
- **THEN** `Matrix3.getScale(matrix)` SHALL return a Vector2 within EPSILON of `(2, 3)`
- **AND** `Matrix3.getScale(matrix, out)` SHALL write to `out` and return it

#### Scenario: Static getTranslation extracts position

- **WHEN** a Matrix3 is composed from `fromTranslation(new Vector2(10, 20))`
- **THEN** `Matrix3.getTranslation(matrix)` SHALL return a Vector2 within EPSILON of `(10, 20)`
- **AND** `Matrix3.getTranslation(matrix, out)` SHALL write to `out` and return it

#### Scenario: Static/instance getter parity

- **WHEN** `Matrix3.getRotation(m)` and `m.getRotation()` are called on the same matrix
- **THEN** both SHALL return identical results
- **AND** same for `getScale()` and `getTranslation()`

### Requirement: Transform2.multiply instance allocation-free

The instance method `Transform2.multiply(other)` SHALL compute rotation composition inline without allocating intermediate objects, while producing bit-identical results to the current implementation.

#### Scenario: Multiply produces same result after optimization

- **WHEN** `Transform2.multiply(a, b)` (static) and `a.clone().multiply(b)` (instance) are called with identical inputs
- **THEN** both SHALL produce bit-identical results for position, rotation (cos, sin), and scale

#### Scenario: Multiply with identity transform

- **WHEN** `transform.multiply(Transform2.IDENTITY)` is called
- **THEN** the transform SHALL remain unchanged

### Requirement: Rotation2 constructor normalization documentation

The Rotation2 constructor JSDoc SHALL include an explicit `@remarks` warning that the constructor does NOT normalize the `(cos, sin)` input, and SHALL reference `fromAngle()` and `normalize()` as safe alternatives.

#### Scenario: Constructor JSDoc contains normalization warning

- **WHEN** a developer reads the Rotation2 constructor JSDoc
- **THEN** a `@remarks` block SHALL be present warning about non-normalization
- **AND** it SHALL reference `fromAngle()` as the recommended factory for angle-based construction
