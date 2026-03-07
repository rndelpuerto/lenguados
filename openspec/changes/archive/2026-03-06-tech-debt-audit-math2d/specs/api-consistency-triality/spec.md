## ADDED Requirements

### Requirement: Vector2 instance methods SHALL match static triality tiers

Multiple Vector2 instance methods diverge from their static counterparts in validation behavior. All instance methods SHALL match the validation tier of their static equivalent.

**Affected methods:**

- `reject()` — instance silently returns `this` on zero axis; static throws `RangeError`
- `project()` — instance returns `(0,0)` on zero axis; static throws `RangeError`
- `reflect()` — instance skips unit-normal validation; static validates

For each, instance `Safe` and `Unchecked` variants SHALL be added (static versions already exist).

#### Scenario: instance reject throws on zero-length axis

- **WHEN** `vector.reject(zeroAxis)` is called on an instance with near-zero axis
- **THEN** it SHALL throw a `RangeError` (breaking: was silent no-op)

#### Scenario: instance rejectSafe returns this on zero-length axis

- **WHEN** `vector.rejectSafe(zeroAxis)` is called with near-zero axis
- **THEN** it SHALL return `this` unchanged

#### Scenario: instance project throws on zero-length axis

- **WHEN** `vector.project(zeroAxis)` is called on an instance with near-zero axis
- **THEN** it SHALL throw a `RangeError` (breaking: was returning (0,0))

#### Scenario: instance projectSafe returns this on zero-length axis

- **WHEN** `vector.projectSafe(zeroAxis)` is called with near-zero axis
- **THEN** it SHALL return `this` set to `(0, 0)` (safe fallback)

#### Scenario: instance reflect validates unit normal

- **WHEN** `vector.reflect(nonUnitNormal)` is called with a non-unit normal
- **THEN** it SHALL throw a `RangeError` (matching static behavior)

### Requirement: Vector2 SHALL have angle getter/setter (BREAKING: replaces method)

Vector2 SHALL expose an `angle` getter returning `atan2(y, x)` in radians and an `angle` setter that preserves magnitude while changing direction, matching the accessor pattern of Complex and Rotation2.

**BREAKING**: The existing instance `angle()` method (line 3204) SHALL be converted to a `get angle()` getter. Callers using `v.angle()` with parentheses must change to `v.angle`.

#### Scenario: Get angle of unit vector along X axis

- **WHEN** `new Vector2(1, 0).angle` is accessed (no parentheses)
- **THEN** it SHALL return `0`

#### Scenario: Get angle of unit vector along Y axis

- **WHEN** `new Vector2(0, 1).angle` is accessed
- **THEN** it SHALL return `PI / 2` (approximately 1.5707963)

#### Scenario: Set angle preserves magnitude

- **GIVEN** a Vector2 with magnitude 5 and angle 0
- **WHEN** `v.angle = PI / 2` is set
- **THEN** `v.x` SHALL be near 0, `v.y` SHALL be near 5, and magnitude SHALL remain 5

#### Scenario: Get angle of zero vector

- **WHEN** `new Vector2(0, 0).angle` is accessed
- **THEN** it SHALL return `0` (atan2(0, 0) = 0)

### Requirement: Vector2.signedAngle ALREADY EXISTS as angleTo

`Vector2.angleTo(a, b)` already computes `atan2(cross(a,b), dot(a,b))` — the exact `signedAngle` operation. No new method is needed.

### Requirement: Zero-length normalization fallback SHALL be documented per type

The normalization Safe fallback values SHALL be explicitly documented:

- `Vector2.normalizeSafe` returns `(0, 0)` — zero vector (no direction)
- `Complex.normalizeSafe` returns `(1, 0)` — multiplicative identity
- `Rotation2.normalizeSafe` returns `(cos=1, sin=0)` — identity rotation

#### Scenario: Vector2.normalizeSafe on zero vector

- **WHEN** `Vector2.normalizeSafe({x:0, y:0})` is called
- **THEN** it SHALL return a vector with `x=0, y=0`

#### Scenario: Complex.normalizeSafe on zero complex

- **WHEN** `Complex.normalizeSafe({real:0, imag:0})` is called
- **THEN** it SHALL return a complex with `real=1, imag=0`

#### Scenario: Rotation2.normalizeSafe on zero rotation

- **WHEN** `Rotation2.normalizeSafe({cos:0, sin:0})` is called
- **THEN** it SHALL return a rotation with `cos=1, sin=0`
