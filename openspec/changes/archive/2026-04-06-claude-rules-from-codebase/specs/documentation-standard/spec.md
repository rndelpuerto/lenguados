## ADDED Requirements

### Requirement: Edge case documentation

Updated `.claude/rules/documentation-conventions.md` MUST include requirements for documenting edge cases when creating new math operations.

#### Scenario: Claude documents a new operation with failure modes

- **WHEN** Claude creates a method that can fail (division, normalization, intersection)
- **THEN** the documentation includes the failure mode, IEEE 754 behavior, and the recommended safe variant
- **THEN** edge cases follow the pattern established in `docs/docs/math2d/edge-cases.md`

### Requirement: Interoperability documentation

The rule MUST specify documentation requirements for type conversions and escalation patterns.

#### Scenario: Claude documents a conversion between types

- **WHEN** Claude writes `from*()` or `to*()` method documentation
- **THEN** it documents when and why escalation is needed (e.g., Transform2 → Matrix3 for shear)
- **THEN** it documents precision implications (e.g., Rotation2 drift requiring periodic `.normalize()`)

### Requirement: Stale API reference prevention

The rule MUST warn against using renamed or removed API names in documentation.

#### Scenario: Claude writes documentation referencing math2d APIs

- **WHEN** Claude mentions a method name in markdown documentation
- **THEN** it verifies the method exists in the current codebase (e.g., `multiplyScalar` not `scale`)
