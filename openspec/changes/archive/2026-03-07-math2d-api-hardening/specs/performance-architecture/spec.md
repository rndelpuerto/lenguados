## ADDED Requirements

### Requirement: Complex and Rotation2 SHALL have \*CS factory variants for hot paths

The \*CS (pre-computed cos/sin) pattern currently covers Vector2, Matrix2, Matrix3, and Transform2 methods but is missing from Complex and Rotation2 factories. The pattern SHALL be completed:

- `Complex.fromPolarCS(magnitude, cos, sin, out?)` — creates complex from polar form without computing trig
- `Rotation2.fromCS(cos, sin, out?)` — creates rotation directly without `fromAngle`

These factories trust caller-provided cos/sin values (no normalization), consistent with all existing \*CS methods.

#### Scenario: fromPolarCS avoids trig computation

- **WHEN** a hot loop pre-computes `const { cos, sin } = sinCos(angle)` once and calls `Complex.fromPolarCS(mag, cos, sin)` N times
- **THEN** no additional sin/cos computation SHALL occur inside `fromPolarCS`

#### Scenario: fromCS avoids trig computation

- **WHEN** a hot loop pre-computes `const { cos, sin } = sinCos(angle)` once and calls `Rotation2.fromCS(cos, sin)` N times
- **THEN** no additional sin/cos computation SHALL occur inside `fromCS`

#### Scenario: \*CS factories produce same results as angle-based factories

- **WHEN** `Complex.fromPolarCS(r, cos(a), sin(a))` and `Complex.fromPolar(r, a)` are compared
- **THEN** results SHALL be identical within EPSILON (both use the same cos/sin values)

#### Scenario: \*CS factories support out parameter

- **WHEN** `Complex.fromPolarCS(r, c, s, out)` or `Rotation2.fromCS(c, s, out)` is called with an `out` parameter
- **THEN** the result SHALL be written into `out` to avoid allocation, matching the convention of all other \*CS methods
