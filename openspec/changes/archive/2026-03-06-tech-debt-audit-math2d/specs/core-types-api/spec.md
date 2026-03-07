## MODIFIED Requirements

### Requirement: Vector2 angle accessor pattern

Vector2 SHALL expose an `angle` getter that returns `atan2(y, x)` in radians and an `angle` setter that calls `setAngle(radians)`, preserving magnitude. This matches the accessor pattern of Complex and Rotation2.

**BREAKING**: The existing instance `angle()` method (line 3204) SHALL be converted to a `get angle()` getter. Callers using `v.angle()` must change to `v.angle`. The existing static `Vector2.angle(vector)` method SHALL remain unchanged.

#### Scenario: Vector2 angle getter returns atan2

- **WHEN** `new Vector2(1, 1).angle` is accessed (without parentheses)
- **THEN** it SHALL return `PI / 4` (approximately 0.7853981)

#### Scenario: Vector2 angle setter mutates direction

- **GIVEN** `const v = new Vector2(3, 0)` (angle = 0, magnitude = 3)
- **WHEN** `v.angle = PI` is executed
- **THEN** `v.x` SHALL be near `-3`, `v.y` SHALL be near `0`

#### Scenario: Vector2 angle getter on zero vector

- **WHEN** `new Vector2(0, 0).angle` is accessed
- **THEN** it SHALL return `0`

### Requirement: Vector2 instance reject SHALL match static triality

The static `Vector2.reject()`, `Vector2.rejectSafe()`, and `Vector2.rejectUnchecked()` already implement the correct triality pattern. The instance `reject()` method SHALL be fixed to match the static behavior (throw on zero axis instead of silent no-op). Instance `rejectSafe()` and `rejectUnchecked()` methods SHALL be added.

#### Scenario: Instance reject throws on zero axis

- **WHEN** `new Vector2(1,1).reject({x:0,y:0})` is called
- **THEN** it SHALL throw `RangeError` (currently silently returns `this`)

#### Scenario: Instance rejectSafe returns this on zero axis

- **WHEN** `new Vector2(1,1).rejectSafe({x:0,y:0})` is called
- **THEN** it SHALL return `this` unchanged

#### Scenario: Instance rejectUnchecked computes without validation

- **WHEN** `new Vector2(3,4).rejectUnchecked({x:1,y:0})` is called
- **THEN** it SHALL set `this` to `(0,4)` and return `this`

### Requirement: Vector2 signedAngle ALREADY EXISTS as angleTo

`Vector2.angleTo(a, b)` (line 1303) already computes `atan2(cross(a,b), dot(a,b))` — the exact `signedAngle` operation. No new method is needed. This is documented here to prevent duplicate implementation.

#### Scenario: angleTo is equivalent to signedAngle

- **WHEN** `Vector2.angleTo({x:1,y:0}, {x:0,y:1})` is called
- **THEN** it SHALL return a value near `PI / 2` (positive, CCW)
