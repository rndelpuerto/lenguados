## ADDED Requirements

### Requirement: Complex MUST support scalar addition and subtraction

The `Complex` class SHALL provide `addScalar` and `subtractScalar` operations in both static and instance forms, following the same pattern as `Vector2.addScalar` and `Vector2.subtractScalar`. Adding a real scalar to a complex number affects only the real component: `(re + s, im)`.

#### Scenario: Complex.addScalar static method

WHEN `Complex.addScalar(new Complex(3, 4), 2)` is called
THEN the result SHALL be a Complex with `real = 5` and `imag = 4`
AND an optional `out` parameter SHALL be accepted as the last argument
AND the input SHALL accept `ReadonlyComplexLike`

#### Scenario: Complex.addScalar instance method

WHEN `new Complex(3, 4).addScalar(2)` is called
THEN `this.real` SHALL be mutated to `5`
AND `this.imag` SHALL remain `4`
AND the method SHALL return `this` for chaining

#### Scenario: Complex.subtractScalar static method

WHEN `Complex.subtractScalar(new Complex(3, 4), 2)` is called
THEN the result SHALL be a Complex with `real = 1` and `imag = 4`
AND an optional `out` parameter SHALL be accepted as the last argument

#### Scenario: Complex.subtractScalar instance method

WHEN `new Complex(3, 4).subtractScalar(2)` is called
THEN `this.real` SHALL be mutated to `1`
AND `this.imag` SHALL remain `4`
AND the method SHALL return `this` for chaining

### Requirement: Rotation2 MUST provide angleTo instance method

The `Rotation2` class SHALL provide an `angleTo` instance method that returns the signed angle from `this` rotation to `other`, consistent with the `Vector2.angleTo` naming convention.

#### Scenario: Rotation2.angleTo computes signed angle

WHEN `Rotation2.fromAngle(0).angleTo(Rotation2.fromAngle(Math.PI / 2))` is called
THEN the result SHALL be approximately `Math.PI / 2`
AND the method SHALL delegate to `Rotation2.angleBetween(this, other)`

#### Scenario: Rotation2.angleTo handles wrap-around

WHEN `Rotation2.fromAngle(Math.PI * 0.75).angleTo(Rotation2.fromAngle(-Math.PI * 0.75))` is called
THEN the result SHALL be the shortest arc (approximately `Math.PI / 2`, not `-3 * Math.PI / 2`)

### Requirement: Angle interpolation MUST provide a clamped variant

The angle interpolation module SHALL provide a `lerpAngleClamped` function that clamps the interpolation parameter `t` to `[0, 1]` before interpolating, consistent with the `lerpClamped` scalar variant and `Vector2.lerpClamped`.

#### Scenario: lerpAngleClamped clamps t to valid range

WHEN `lerpAngleClamped(0, Math.PI / 2, 1.5)` is called
THEN the result SHALL equal `lerpAngle(0, Math.PI / 2, 1.0)` (i.e., `Math.PI / 2`)
AND it SHALL NOT extrapolate beyond the target angle

#### Scenario: lerpAngleClamped with negative t

WHEN `lerpAngleClamped(0, Math.PI / 2, -0.5)` is called
THEN the result SHALL equal `lerpAngle(0, Math.PI / 2, 0)` (i.e., `0`)

#### Scenario: lerpAngleClamped normal interpolation

WHEN `lerpAngleClamped(0, Math.PI, 0.5)` is called
THEN the result SHALL equal `lerpAngle(0, Math.PI, 0.5)`
AND it SHALL use the shortest arc (via `angleDifference`)
