## ADDED Requirements

### Requirement: Angle functions SHALL have NaN/Infinity tests

All exported functions in `auxiliary/angle/` SHALL have test cases verifying behavior when passed `NaN` and `Infinity` inputs.

#### Scenario: sinCos with NaN input

- **WHEN** `sinCos(NaN)` is called
- **THEN** the result SHALL have `sin: NaN` and `cos: NaN`

#### Scenario: sinCos with Infinity input

- **WHEN** `sinCos(Infinity)` is called
- **THEN** the result SHALL have `sin: NaN` and `cos: NaN` (IEEE 754: sin/cos of infinity is undefined)

#### Scenario: angleDifference with NaN input

- **WHEN** `angleDifference(NaN, 0)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: angleDistance with Infinity input

- **WHEN** `angleDistance(Infinity, 0)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: lerpAngle with NaN parameter

- **WHEN** `lerpAngle(0, PI, NaN)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: normalizeRadians with Infinity

- **WHEN** `normalizeRadians(Infinity)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: degreesToRadians with NaN

- **WHEN** `degreesToRadians(NaN)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: unwrapAngles with NaN element

- **WHEN** `unwrapAngles([0, NaN, PI])` is called
- **THEN** the result SHALL propagate `NaN` at the affected index

### Requirement: Scalar functions SHALL have extreme value tests

The `auxiliary/scalar/` module SHALL have test cases for `sign(NaN)`, `compare()` with extreme values, and `inRange()` with NaN.

#### Scenario: sign of NaN

- **WHEN** `sign(NaN)` is called
- **THEN** it SHALL return `0`

#### Scenario: compare near-MAX_VALUE numbers

- **WHEN** `compare(1e308, 1e308)` is called
- **THEN** it SHALL return `0` (equal within tolerance)

#### Scenario: compare near-MIN_VALUE denormal numbers

- **WHEN** `compare(1e-308, 1e-308)` is called
- **THEN** it SHALL return `0`

#### Scenario: inRange with NaN value

- **WHEN** `inRange(NaN, 0, 10)` is called
- **THEN** it SHALL return `false`

#### Scenario: inRange with NaN bounds

- **WHEN** `inRange(5, NaN, 10)` is called
- **THEN** it SHALL return `false`

### Requirement: Core type operations SHALL have NaN/Infinity property tests

Property-based tests using `fast-check` SHALL verify that core type operations properly propagate or handle `NaN` and `Infinity` inputs.

#### Scenario: Vector2 arithmetic with NaN propagation

- **WHEN** `Vector2.add({x:NaN, y:1}, {x:2, y:3})` is called
- **THEN** the result SHALL have `x: NaN` and `y: 4`

#### Scenario: Vector2.magnitude with Infinity component

- **WHEN** `Vector2.magnitude({x: Infinity, y: 0})` is called
- **THEN** it SHALL return `Infinity`

#### Scenario: Matrix2.inverse with NaN elements

- **WHEN** `Matrix2.inverse` is called with a matrix containing NaN
- **THEN** it SHALL throw a `RangeError` (determinant is NaN, treated as near-zero)

#### Scenario: Rotation2.fromAngle with NaN

- **WHEN** `Rotation2.fromAngle(NaN)` is called
- **THEN** the result SHALL have `cos: NaN` and `sin: NaN`

#### Scenario: Complex.magnitude of Infinity

- **WHEN** `Complex.magnitude({real: Infinity, imag: 0})` is called
- **THEN** it SHALL return `Infinity`

### Requirement: Rounding functions SHALL have non-finite input tests

Tests SHALL verify that `roundToPlaces`, `roundToMultiple`, `snapToGrid`, and `fract` handle `NaN` and `Infinity` inputs consistently.

#### Scenario: roundToPlaces with NaN

- **WHEN** `roundToPlaces(NaN, 2)` is called
- **THEN** it SHALL return `NaN` (pass-through)

#### Scenario: roundToMultiple with Infinity

- **WHEN** `roundToMultiple(Infinity, 5)` is called
- **THEN** it SHALL return `Infinity` (pass-through)

#### Scenario: snapToGrid with NaN value

- **WHEN** `snapToGrid(NaN, 1)` is called
- **THEN** it SHALL return `NaN` (pass-through)

#### Scenario: fract with Infinity

- **WHEN** `fract(Infinity)` is called
- **THEN** it SHALL return `NaN` (fractional part of infinity is undefined)
