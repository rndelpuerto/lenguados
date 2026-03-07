## ADDED Requirements

### Requirement: Complex SHALL have fromPolarCS factory for pre-computed trig

`Complex` SHALL provide a static factory `fromPolarCS(magnitude: number, cos: number, sin: number, out?: Complex): Complex` that creates a complex number from polar form using pre-computed cos/sin values, avoiding redundant trig computation in hot paths.

The factory trusts caller-provided cos/sin values without normalization or validation, consistent with existing \*CS methods (e.g., `Vector2.rotateCS`).

#### Scenario: fromPolarCS with unit magnitude

- **WHEN** `Complex.fromPolarCS(1, Math.cos(PI/4), Math.sin(PI/4))` is called
- **THEN** the result SHALL be approximately `(SQRT_HALF, SQRT_HALF)`

#### Scenario: fromPolarCS with arbitrary magnitude

- **WHEN** `Complex.fromPolarCS(5, 0, 1)` is called (angle = PI/2)
- **THEN** the result SHALL be `(0, 5)` (real = 5*cos = 0, imag = 5*sin = 5)

#### Scenario: fromPolarCS with out parameter

- **WHEN** `Complex.fromPolarCS(1, 1, 0, out)` is called with an existing Complex as `out`
- **THEN** the result SHALL be written into `out` and `out` SHALL be returned

#### Scenario: fromPolarCS with zero magnitude

- **WHEN** `Complex.fromPolarCS(0, 1, 0)` is called
- **THEN** the result SHALL be `(0, 0)` regardless of cos/sin values

### Requirement: Rotation2 SHALL have fromCS factory for pre-computed trig

`Rotation2` SHALL provide a static factory `fromCS(cos: number, sin: number, out?: Rotation2): Rotation2` that creates a rotation directly from cos/sin values without passing through `fromAngle`.

The factory trusts caller-provided values without normalization, consistent with the \*CS pattern.

#### Scenario: fromCS with identity rotation

- **WHEN** `Rotation2.fromCS(1, 0)` is called
- **THEN** the result SHALL be an identity rotation with `cos=1, sin=0`

#### Scenario: fromCS with 90-degree rotation

- **WHEN** `Rotation2.fromCS(0, 1)` is called
- **THEN** the result SHALL be a 90-degree CCW rotation with `cos=0, sin=1`

#### Scenario: fromCS with out parameter

- **WHEN** `Rotation2.fromCS(cos, sin, out)` is called with an existing Rotation2 as `out`
- **THEN** the result SHALL be written into `out` and `out` SHALL be returned

#### Scenario: fromCS matches fromAngle for same angle

- **WHEN** `Rotation2.fromCS(Math.cos(a), Math.sin(a))` and `Rotation2.fromAngle(a)` are called for the same angle `a`
- **THEN** both results SHALL be equal within EPSILON tolerance

### Requirement: Matrix2 SHALL have complete Instance-Static parity

Matrix2 SHALL have static equivalents for all instance-only methods and instance equivalents for all static-only methods.

**Missing static methods:**

- `Matrix2.premultiply(left, right, out?)` — computes `left * right` (static form; instance `premultiply(other)` computes `other * this`)

**Missing instance methods:**

- `matrix2.compose(scaleX, scaleY, angle)` — sets this to Scale \* Rotate composition
- `matrix2.decompose()` — extracts scaleX, scaleY, angle from this

#### Scenario: Matrix2.premultiply static method

- **WHEN** `Matrix2.premultiply(A, B, out?)` is called
- **THEN** it SHALL compute `A * B` and return the result (semantically identical to `Matrix2.multiply(A, B)`)

#### Scenario: Matrix2 instance compose

- **WHEN** `new Matrix2().compose(2, 3, PI/4)` is called
- **THEN** the matrix SHALL represent Scale(2,3) followed by Rotate(PI/4)

#### Scenario: Matrix2 instance decompose

- **WHEN** `Matrix2.fromRotation(PI/6).decompose()` is called
- **THEN** it SHALL return `{ scaleX: 1, scaleY: 1, angle: PI/6 }` within EPSILON tolerance

#### Scenario: compose-decompose round-trip

- **WHEN** a Matrix2 is composed with (sx, sy, angle) and then decomposed
- **THEN** the decomposed values SHALL match the original (sx, sy, angle) within EPSILON

### Requirement: Matrix3 SHALL have complete Instance-Static parity

Matrix3 SHALL have static equivalents for instance-only methods (with exceptions for accessor-style methods per design decision D4).

**Missing static methods:**

- `Matrix3.premultiply(left, right, out?)` — computes `left * right`
- `Matrix3.transformPoints(m, points, out?)` — transforms an array of points
- `Matrix3.transformVectors(m, vectors, out?)` — transforms an array of vectors (no translation)
- `Matrix3.isAffine(m)` — static predicate for affine matrix test

**Missing instance methods:**

- `matrix3.decompose()` — extracts translation, rotation, scale from this

Note: `getTranslation()`, `getScale()`, `getRotation()` remain instance-only (accessor pattern per D4).

#### Scenario: Matrix3.premultiply static method

- **WHEN** `Matrix3.premultiply(A, B, out?)` is called
- **THEN** it SHALL compute `A * B` and return the result

#### Scenario: Matrix3.transformPoints static method

- **WHEN** `Matrix3.transformPoints(m, [{x:1,y:0}, {x:0,y:1}])` is called
- **THEN** it SHALL return transformed points as an array of Vector2

#### Scenario: Matrix3.transformVectors static method

- **WHEN** `Matrix3.transformVectors(m, [{x:1,y:0}])` is called with a translation matrix
- **THEN** the translation SHALL NOT affect vectors (only rotation and scale apply)

#### Scenario: Matrix3.isAffine static predicate

- **WHEN** `Matrix3.isAffine(m)` is called with a valid affine matrix (bottom row `[0, 0, 1]`)
- **THEN** it SHALL return `true`

#### Scenario: Matrix3 instance decompose

- **WHEN** a Matrix3 composed from translation(5,3) + rotation(PI/4) + scale(2,2) is decomposed
- **THEN** it SHALL return `{ tx: 5, ty: 3, angle: PI/4, scaleX: 2, scaleY: 2 }` within EPSILON

### Requirement: Interval SHALL have static sample method

`Interval.sample()` is currently instance-only. A static equivalent SHALL be added.

#### Scenario: Interval.sample static method

- **WHEN** `Interval.sample({min: 0, max: 10}, 0.5)` is called
- **THEN** it SHALL return `5` (linear interpolation at t=0.5)

#### Scenario: Interval.sample static at boundaries

- **WHEN** `Interval.sample({min: 2, max: 8}, 0)` and `Interval.sample({min: 2, max: 8}, 1)` are called
- **THEN** they SHALL return `2` and `8` respectively

#### Scenario: Static and instance sample produce same result

- **WHEN** `Interval.sample(interval, t)` and `interval.clone().sample(t)` are called
- **THEN** both results SHALL be identical

### Requirement: Rotation2.lerp slerp equivalence documentation SHALL be maintained

`Rotation2.lerp` already includes a `@remarks` JSDoc tag (added in v0.6.0) documenting that slerp is unnecessary for 2D rotations on S^1. This documentation SHALL be preserved in v0.7.0. No `slerp` method SHALL be added to Rotation2.

#### Scenario: No slerp method exists on Rotation2

- **WHEN** the Rotation2 API is examined
- **THEN** no `slerp` method SHALL exist, and the existing `lerp` remarks SHALL explain why
