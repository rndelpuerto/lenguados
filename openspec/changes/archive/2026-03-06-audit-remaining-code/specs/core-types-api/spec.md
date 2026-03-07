## ADDED Requirements

### Requirement: Complex.exp computes the complex exponential

The `Complex` class SHALL provide a static method `exp(z: ReadonlyComplexLike, out?: Complex): Complex` and an instance method `exp(): this` that compute the complex exponential using Euler's formula: `e^(a+bi) = e^a * (cos(b) + i*sin(b))`.

The implementation SHALL use `deterministic/exp` for `e^a` and `deterministic/sinCos` for `cos(b)` and `sin(b)`.

#### Scenario: exp of purely imaginary number

- **WHEN** `Complex.exp({ re: 0, im: Math.PI })` is called
- **THEN** the result SHALL be approximately `(-1, 0)` (Euler's identity) within EPSILON tolerance

#### Scenario: exp of real number

- **WHEN** `Complex.exp({ re: 1, im: 0 })` is called
- **THEN** the result SHALL be approximately `(e, 0)` within EPSILON tolerance

#### Scenario: exp of zero

- **WHEN** `Complex.exp({ re: 0, im: 0 })` is called
- **THEN** the result SHALL be exactly `(1, 0)`

#### Scenario: exp with out parameter

- **WHEN** `Complex.exp(z, out)` is called with an existing Complex as `out`
- **THEN** the result SHALL be written into `out` and `out` SHALL be returned

#### Scenario: exp overflow

- **WHEN** `Complex.exp({ re: 1000, im: 0 })` is called
- **THEN** the result SHALL be `(Infinity, 0)` (consistent with deterministic/exp overflow behavior)

### Requirement: Complex.log computes the principal complex logarithm

The `Complex` class SHALL provide a static method `log(z: ReadonlyComplexLike, out?: Complex): Complex` and an instance method `log(): this` that compute the principal logarithm: `log(z) = ln|z| + i*arg(z)`.

The implementation SHALL use `deterministic/log` for `ln|z|` and the existing `argument()` computation for `arg(z)`.

#### Scenario: log of e

- **WHEN** `Complex.log({ re: Math.E, im: 0 })` is called
- **THEN** the result SHALL be approximately `(1, 0)` within EPSILON tolerance

#### Scenario: log of negative real

- **WHEN** `Complex.log({ re: -1, im: 0 })` is called
- **THEN** the result SHALL be approximately `(0, π)` within EPSILON tolerance (principal branch)

#### Scenario: log of unit complex on circle

- **WHEN** `Complex.log({ re: 0, im: 1 })` is called
- **THEN** the result SHALL be approximately `(0, π/2)` within EPSILON tolerance

#### Scenario: log of zero

- **WHEN** `Complex.log({ re: 0, im: 0 })` is called
- **THEN** the real part SHALL be `-Infinity` and the imaginary part SHALL be `0`

### Requirement: Complex.toPolar returns polar form

The `Complex` class SHALL provide a static method `toPolar(z: ReadonlyComplexLike): { magnitude: number; angle: number }` and an instance method `toPolar(): { magnitude: number; angle: number }` that return the polar representation.

The `magnitude` SHALL equal `Complex.magnitude(z)` and `angle` SHALL equal `Complex.argument(z)`.

#### Scenario: toPolar of unit on real axis

- **WHEN** `Complex.toPolar({ re: 1, im: 0 })` is called
- **THEN** the result SHALL be `{ magnitude: 1, angle: 0 }`

#### Scenario: toPolar round-trip with fromPolar

- **WHEN** `Complex.toPolar(z)` is called, then `Complex.fromPolar(result.magnitude, result.angle)` is called
- **THEN** the round-trip result SHALL equal the original `z` within EPSILON tolerance

#### Scenario: toPolar of zero

- **WHEN** `Complex.toPolar({ re: 0, im: 0 })` is called
- **THEN** the result SHALL be `{ magnitude: 0, angle: 0 }`

## MODIFIED Requirements

### Requirement: Interval divide semantics are consistent

The `Interval` instance method `divide` SHALL accept a `scalar: number` parameter (not another Interval), matching the static method signature `divide(interval: ReadonlyIntervalLike, scalar: number, out?: Interval): Interval`.

The instance method signature SHALL be `divide(scalar: number): this`.

#### Scenario: Instance divide by scalar

- **WHEN** `new Interval(2, 6).divide(2)` is called
- **THEN** the result SHALL be `Interval(1, 3)` and the return value SHALL be `this`

#### Scenario: Instance divide by zero

- **WHEN** `new Interval(2, 6).divide(0)` is called
- **THEN** the behavior SHALL match the static method's behavior for zero divisor

#### Scenario: Static and instance produce same result

- **WHEN** `Interval.divide(interval, scalar)` and `interval.clone().divide(scalar)` are called with the same inputs
- **THEN** both results SHALL be identical
