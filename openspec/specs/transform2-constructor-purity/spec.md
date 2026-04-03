## ADDED Requirements

### Requirement: `Transform2` constructor SHALL be pure (no assertions)

The `Transform2` constructor SHALL NOT contain any assertions. The Constructor Purity rule (ratified in `audit-architectural-fixes`, documented in `architecture-and-layers.md`) states:

> Constructors MUST have NO assertions. NaN/Infinity are valid IEEE 754 values in the math layer.

All 6 other core types comply:

- `Vector2`: pure assignment
- `Rotation2`: pure assignment
- `Complex`: pure assignment
- `Interval`: fixed in audit, now pure
- `Matrix2`: pure assignment
- `Matrix3`: pure assignment

The `assertFinite(rotation, 'Transform2.constructor:rotation')` call at `transform2.ts:~234` is an oversight predating the formal Constructor Purity rule.

**Fix**: Remove the `assertFinite` call. Add canonical comment. Remove `assertFinite` import if no longer used in the file.

#### Scenario: Transform2 constructor accepts NaN rotation without throwing

- **WHEN** `new Transform2(position, NaN)` is called
- **THEN** the constructor SHALL NOT throw and `transform.rotation` SHALL encode the NaN state

#### Scenario: Transform2 constructor accepts Infinity rotation without throwing

- **WHEN** `new Transform2(position, Infinity)` is called
- **THEN** the constructor SHALL NOT throw

#### Scenario: Transform2 constructor still accepts valid input

- **WHEN** `new Transform2(new Vector2(1, 2), Math.PI / 4)` is called
- **THEN** the constructor SHALL NOT throw and SHALL construct the transform correctly
