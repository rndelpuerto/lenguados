## MODIFIED Requirements

### Requirement: Rotation2 inverse getter naming

The Rotation2 inverse getter SHALL be named `inverted` (not `inversed`) to match the naming convention used by Matrix2, Matrix3, and Transform2.

#### Scenario: Rotation2 inverted getter returns correct value

- **WHEN** a Rotation2 with cos=0.6, sin=0.8 is accessed via `.inverted`
- **THEN** the result SHALL be a new Rotation2 with cos=0.6, sin=-0.8
- **AND** the original Rotation2 SHALL remain unmodified

#### Scenario: All core types use consistent inverse getter name

- **WHEN** checking the inverse getter name across Matrix2, Matrix3, Transform2, and Rotation2
- **THEN** all four types SHALL use the getter name `inverted`

## ADDED Requirements

### Requirement: Vector2 inverted getter

Vector2 SHALL provide a `get inverted(): Vector2` getter that returns a new Vector2 with component-wise reciprocals (1/x, 1/y), matching the pattern of existing getters `negated`, `absolute`, and `normalized`.

#### Scenario: Vector2 inverted getter returns component-wise reciprocals

- **WHEN** a Vector2 with x=2, y=4 is accessed via `.inverted`
- **THEN** the result SHALL be a new Vector2 with x=0.5, y=0.25
- **AND** the original Vector2 SHALL remain unmodified

#### Scenario: Vector2 inverted getter with zero component

- **WHEN** a Vector2 with x=0, y=5 is accessed via `.inverted`
- **THEN** the result SHALL be a new Vector2 with x=Infinity, y=0.2

### Requirement: Transform2 COMPONENT_COUNT constant

Transform2 SHALL provide a `COMPONENT_COUNT = 6` static constant representing the number of raw components yielded by `Symbol.iterator` (px, py, cos, sin, sx, sy). The existing `ELEMENT_COUNT = 5` JSDoc SHALL clarify it refers to `toArray()` serialization format (px, py, angle, sx, sy).

#### Scenario: COMPONENT_COUNT matches iterator length

- **WHEN** spreading a Transform2 via `[...transform]`
- **THEN** the resulting array length SHALL equal `Transform2.COMPONENT_COUNT` (6)

#### Scenario: ELEMENT_COUNT matches toArray length

- **WHEN** calling `transform.toArray()`
- **THEN** the resulting array length SHALL equal `Transform2.ELEMENT_COUNT` (5)

### Requirement: Complex component-wise operations

Complex SHALL provide all 10 component-wise operations (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod) as both static and instance methods, operating independently on `real` and `imag` components. This matches the pattern established by Vector2 and Matrix2.

#### Scenario: Complex static abs

- **WHEN** calling `Complex.abs({ real: -3, imag: -4 })`
- **THEN** the result SHALL be Complex(3, 4)

#### Scenario: Complex instance floor

- **WHEN** calling `.floor()` on Complex(1.7, -2.3)
- **THEN** the Complex SHALL be mutated to (1, -3) and return `this`

#### Scenario: Complex static min

- **WHEN** calling `Complex.min({ real: 3, imag: 1 }, { real: 1, imag: 5 })`
- **THEN** the result SHALL be Complex(1, 1)

#### Scenario: Complex static clamp

- **WHEN** calling `Complex.clamp({ real: -5, imag: 10 }, { real: 0, imag: 0 }, { real: 3, imag: 3 })`
- **THEN** the result SHALL be Complex(0, 3)

#### Scenario: Complex static mod

- **WHEN** calling `Complex.mod({ real: 5, imag: 7 }, { real: 3, imag: 4 })`
- **THEN** the result SHALL be Complex(2, 3)

#### Scenario: Complex component-wise ops with NaN

- **WHEN** calling `Complex.abs({ real: NaN, imag: 1 })`
- **THEN** the result SHALL be Complex(NaN, 1)

#### Scenario: Complex component-wise ops with Infinity

- **WHEN** calling `Complex.floor({ real: Infinity, imag: -Infinity })`
- **THEN** the result SHALL be Complex(Infinity, -Infinity)

#### Scenario: Complex static methods accept out parameter

- **WHEN** calling `Complex.abs(input, existingComplex)`
- **THEN** the result SHALL be written into `existingComplex` and returned

### Requirement: Interval component-wise operations

Interval SHALL provide 9 component-wise operations (floor, ceil, round, trunc, sign, min, max, clamp, mod) as both static and instance methods, operating independently on `min` and `max` bounds. Interval already has `abs`.

#### Scenario: Interval static floor

- **WHEN** calling `Interval.floor({ min: -1.5, max: 2.7 })`
- **THEN** the result SHALL be Interval(-2, 2)

#### Scenario: Interval instance ceil

- **WHEN** calling `.ceil()` on Interval(1.2, 3.8)
- **THEN** the Interval SHALL be mutated to (2, 4) and return `this`

#### Scenario: Interval static sign

- **WHEN** calling `Interval.sign({ min: -5, max: 3 })`
- **THEN** the result SHALL be Interval(-1, 1)

#### Scenario: Interval static clamp

- **WHEN** calling `Interval.clamp({ min: -10, max: 10 }, { min: 0, max: 0 }, { min: 5, max: 5 })`
- **THEN** the result SHALL be Interval(0, 5)

#### Scenario: Interval static min

- **WHEN** calling `Interval.min({ min: 1, max: 5 }, { min: 2, max: 3 })`
- **THEN** the result SHALL be Interval(1, 3)

#### Scenario: Interval component-wise ops with NaN

- **WHEN** calling `Interval.floor({ min: NaN, max: 2.5 })`
- **THEN** the result SHALL be Interval(NaN, 2)

#### Scenario: Interval static methods accept out parameter

- **WHEN** calling `Interval.floor(input, existingInterval)`
- **THEN** the result SHALL be written into `existingInterval` and returned
