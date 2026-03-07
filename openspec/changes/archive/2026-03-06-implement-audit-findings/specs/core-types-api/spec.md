## RENAMED Requirements

### Requirement: Vector2.magnitudeSquared renamed to magnitudeSq

FROM: `Vector2.magnitudeSquared` (static and instance)
TO: `Vector2.magnitudeSq` (static and instance)

## REMOVED Requirements

### Requirement: Rotation2.slerp removed

**Reason**: In 2D, slerp of unit complex numbers degenerates to lerp+normalize. The separate method misleads users into thinking it provides different behavior than lerp.
**Migration**: Use `Rotation2.lerp(a, b, t, out?)` — it IS slerp in 2D. The lerp TSDoc SHALL document this equivalence.

### Requirement: Rotation2.angleValue removed

**Reason**: Exact duplicate of the `angle` getter. Zero unique consumers.
**Migration**: Use `rotation.angle` (getter) instead.

### Requirement: Interval.NORMALIZED removed

**Reason**: Exact duplicate of `Interval.UNIT` (both represent [0, 1]).
**Migration**: Use `Interval.UNIT` instead.

## MODIFIED Requirements

### Requirement: Rotation2.negate renamed to conjugate

The `Rotation2` type SHALL provide a `conjugate()` method (renamed from `negate()`) that returns the inverse rotation by negating the sin component while preserving cos. This is the standard conjugate operation for unit complex numbers in SO(2).

The method SHALL be available as both static `Rotation2.conjugate(r, out?)` and instance `rotation.conjugate()`.

#### Scenario: Conjugate produces inverse rotation

- **WHEN** `Rotation2.conjugate(Rotation2.fromAngle(PI/4))` is called
- **THEN** the result SHALL equal `Rotation2.fromAngle(-PI/4)` within EPSILON

#### Scenario: Conjugate round-trip is identity

- **WHEN** `Rotation2.conjugate(Rotation2.conjugate(r))` is called for any rotation r
- **THEN** the result SHALL equal r within EPSILON

### Requirement: Transform2 static constants are deeply frozen

The static constants `Transform2.IDENTITY`, `Transform2.FLIP_X`, and `Transform2.FLIP_Y` SHALL be deeply immutable. All nested objects (position Vector2, rotation Rotation2, scale Vector2) SHALL be frozen using `freezeVector2()` and `freezeRotation2()`.

#### Scenario: Nested position is immutable

- **WHEN** `Transform2.IDENTITY.position.x = 99` is executed in strict mode
- **THEN** a TypeError SHALL be thrown

#### Scenario: Nested rotation is immutable

- **WHEN** `Transform2.IDENTITY.rotation.cos = 0` is executed in strict mode
- **THEN** a TypeError SHALL be thrown

#### Scenario: Nested scale is immutable

- **WHEN** `Transform2.FLIP_X.scale.x = 5` is executed in strict mode
- **THEN** a TypeError SHALL be thrown

## ADDED Requirements

### Requirement: ReadonlyRotation2 type alias exists

The library SHALL export a `ReadonlyRotation2` type alias defined as `Readonly<Rotation2>`, consistent with the 6 other core types that already have Readonly type aliases (ReadonlyVector2, ReadonlyComplex, ReadonlyInterval, ReadonlyMatrix2, ReadonlyMatrix3, ReadonlyTransform2).

#### Scenario: ReadonlyRotation2 is importable

- **WHEN** a consumer imports `ReadonlyRotation2` from `@lenguados/math2d`
- **THEN** the type SHALL be available and assignable from a `Rotation2` instance

#### Scenario: ReadonlyRotation2 prevents mutation

- **WHEN** a variable is typed as `ReadonlyRotation2`
- **THEN** calling mutating methods (e.g., `.set()`, `.multiply()`) SHALL produce a TypeScript compilation error
