## ADDED Requirements

### Requirement: Matrix2 inverse SHALL be tested at near-singular determinants

Matrix2.inverse() and Matrix2.inverseSafe() SHALL have boundary tests verifying correct behavior when the determinant approaches zero (near EPSILON threshold).

#### Scenario: Matrix2.inverse throws when determinant is below EPSILON

- **WHEN** `Matrix2.inverse(m)` is called with a matrix whose determinant is `1e-11` (below EPSILON = 1e-10)
- **THEN** it SHALL throw a `RangeError` indicating the matrix is singular

#### Scenario: Matrix2.inverse succeeds when determinant is just above EPSILON

- **WHEN** `Matrix2.inverse(m)` is called with a matrix whose determinant is `2e-10` (above EPSILON)
- **THEN** it SHALL return the inverse matrix without throwing

#### Scenario: Matrix2.inverseSafe returns identity for exactly singular matrix

- **WHEN** `Matrix2.inverseSafe(m)` is called with a matrix whose determinant is exactly `0`
- **THEN** it SHALL return the identity matrix `[[1,0],[0,1]]` as the safe fallback

#### Scenario: Matrix2.inverseSafe returns identity for near-singular matrix

- **WHEN** `Matrix2.inverseSafe(m)` is called with a matrix whose determinant is `1e-15`
- **THEN** it SHALL return the identity matrix as the safe fallback

### Requirement: Matrix3 inverse SHALL be tested at near-singular determinants

Matrix3.inverse() and Matrix3.inverseSafe() SHALL have boundary tests verifying correct behavior when the determinant approaches zero.

#### Scenario: Matrix3.inverse throws when determinant is below EPSILON

- **WHEN** `Matrix3.inverse(m)` is called with a 3x3 matrix whose determinant is below EPSILON
- **THEN** it SHALL throw a `RangeError`

#### Scenario: Matrix3.inverseSafe returns identity for singular matrix

- **WHEN** `Matrix3.inverseSafe(m)` is called with a 3x3 matrix whose determinant is exactly `0`
- **THEN** it SHALL return the 3x3 identity matrix

#### Scenario: Matrix3.inverse with nearly-parallel rows

- **WHEN** `Matrix3.inverse(m)` is called with a matrix where two rows are nearly parallel (angle < 1e-6 rad)
- **THEN** it SHALL throw a `RangeError` because the determinant is near zero

### Requirement: Transform2 inverse SHALL be tested with near-zero scale

Transform2.inverse() involves inverting scale components. Tests SHALL verify behavior when scale approaches zero.

#### Scenario: Transform2.inverse throws with zero scale X

- **WHEN** `Transform2.inverse(t)` is called with a transform whose scaleX is `0`
- **THEN** it SHALL throw a `RangeError`

#### Scenario: Transform2.inverse throws with near-zero scale

- **WHEN** `Transform2.inverse(t)` is called with a transform whose scaleX is `1e-15`
- **THEN** it SHALL throw a `RangeError` (scale is below safe inversion threshold)

#### Scenario: Transform2.inverseSafe returns identity for zero-scale transform

- **WHEN** `Transform2.inverseSafe(t)` is called with a transform whose scale is `(0, 0)`
- **THEN** it SHALL return the identity transform as the safe fallback

#### Scenario: Transform2.inverse succeeds with small but valid scale

- **WHEN** `Transform2.inverse(t)` is called with scaleX = `1e-5` and scaleY = `1e-5`
- **THEN** it SHALL return the correct inverse transform without throwing
