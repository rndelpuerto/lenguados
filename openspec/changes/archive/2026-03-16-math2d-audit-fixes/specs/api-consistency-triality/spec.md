## ADDED Requirements

### Requirement: Matrix2 Safe/Unchecked test coverage

All Matrix2 Safe and Unchecked triality variants SHALL have explicit test cases verifying their contracts.

#### Scenario: inverseSafe returns identity for singular matrix

- **WHEN** `Matrix2.inverseSafe(singularMatrix)` is called where determinant is near-zero
- **THEN** the result SHALL be the identity matrix
- **AND** no exception SHALL be thrown

#### Scenario: inverseUnchecked skips validation

- **WHEN** `Matrix2.inverseUnchecked(matrix)` is called on an invertible matrix
- **THEN** the result SHALL be the correct inverse

#### Scenario: divideScalarSafe returns zero for near-zero scalar

- **WHEN** `Matrix2.divideScalarSafe(matrix, 0)` is called
- **THEN** the result SHALL be the zero matrix
- **AND** no exception SHALL be thrown

#### Scenario: divideScalarUnchecked skips validation

- **WHEN** `Matrix2.divideScalarUnchecked(matrix, 2)` is called
- **THEN** the result SHALL equal the matrix with all components halved

### Requirement: Matrix3 Safe/Unchecked test coverage

All Matrix3 Safe and Unchecked triality variants SHALL have explicit test cases verifying their contracts.

#### Scenario: inverseSafe returns identity for singular matrix

- **WHEN** `Matrix3.inverseSafe(singularMatrix)` is called where determinant is near-zero
- **THEN** the result SHALL be the identity matrix
- **AND** no exception SHALL be thrown

#### Scenario: inverseUnchecked on invertible matrix

- **WHEN** `Matrix3.inverseUnchecked(matrix)` is called on an invertible matrix
- **THEN** the result SHALL be the correct inverse

#### Scenario: divideScalarSafe returns zero for near-zero scalar

- **WHEN** `Matrix3.divideScalarSafe(matrix, 0)` is called
- **THEN** the result SHALL be the zero matrix
- **AND** no exception SHALL be thrown

#### Scenario: divideScalarUnchecked on valid scalar

- **WHEN** `Matrix3.divideScalarUnchecked(matrix, 2)` is called
- **THEN** the result SHALL equal the matrix with all components halved

### Requirement: Complex predicate test coverage

Complex static predicates and instance comparison methods SHALL have explicit test coverage.

#### Scenario: hasNaN detects NaN in real part

- **WHEN** `Complex.hasNaN(new Complex(NaN, 1))` is called
- **THEN** the result SHALL be `true`

#### Scenario: hasNaN detects NaN in imaginary part

- **WHEN** `Complex.hasNaN(new Complex(1, NaN))` is called
- **THEN** the result SHALL be `true`

#### Scenario: hasNaN returns false for finite complex

- **WHEN** `Complex.hasNaN(new Complex(3, 4))` is called
- **THEN** the result SHALL be `false`

#### Scenario: hasInfinity detects Infinity

- **WHEN** `Complex.hasInfinity(new Complex(Infinity, 0))` is called
- **THEN** the result SHALL be `true`

#### Scenario: isZero instance predicate

- **WHEN** `new Complex(0, 0).isZero()` is called
- **THEN** the result SHALL be `true`

#### Scenario: isReal instance predicate

- **WHEN** `new Complex(5, 0).isReal()` is called
- **THEN** the result SHALL be `true`
- **AND** `new Complex(5, 1).isReal()` SHALL return `false`

#### Scenario: isImaginary instance predicate

- **WHEN** `new Complex(0, 5).isImaginary()` is called
- **THEN** the result SHALL be `true`
- **AND** `new Complex(1, 5).isImaginary()` SHALL return `false`

### Requirement: Transform2 batch operation test coverage

Transform2 batch methods `transformPoints()` and `transformVectors()` SHALL have explicit test coverage including array handling.

#### Scenario: transformPoints batch produces same result as individual

- **WHEN** `transform.transformPoints([p1, p2, p3])` is called
- **THEN** each output point SHALL match `Transform2.transformPoint(transform, pN)`

#### Scenario: transformVectors batch produces same result as individual

- **WHEN** `transform.transformVectors([v1, v2])` is called
- **THEN** each output vector SHALL match `Transform2.transformVector(transform, vN)`

### Requirement: Rotation2.fromCS factory test coverage

The `Rotation2.fromCS()` factory method SHALL have explicit test coverage.

#### Scenario: fromCS with unit values

- **WHEN** `Rotation2.fromCS(cos(PI/4), sin(PI/4))` is called
- **THEN** the result SHALL have `cos` and `sin` within EPSILON of the expected values

#### Scenario: fromCS normalizes non-unit input

- **WHEN** `Rotation2.fromCS(2, 0)` is called with non-unit magnitude
- **THEN** the result SHALL be normalized to `(1, 0)` via the normalization path
