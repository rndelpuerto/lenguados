## MODIFIED Requirements

### Requirement: Vector2 public API surface

The Vector2 class SHALL include `moveTowards` as both a static method and an instance method, following the established static+instance duality pattern. The static method SHALL accept an optional `out` parameter as the last argument.

#### Scenario: moveTowards is exported

- **WHEN** a consumer imports from `@lenguados/math2d`
- **THEN** `Vector2.moveTowards` SHALL be available as a static method
- **AND** `new Vector2().moveTowards()` SHALL be available as an instance method

### Requirement: Matrix2 public API surface

The Matrix2 class SHALL include `fromAngleScale` as a static factory method, following the established factory pattern with optional `out` parameter.

#### Scenario: fromAngleScale is exported

- **WHEN** a consumer imports from `@lenguados/math2d`
- **THEN** `Matrix2.fromAngleScale` SHALL be available as a static method
