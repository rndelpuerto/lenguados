## ADDED Requirements

### Requirement: normalizeRadians MUST use (-PI, PI] convention

The `normalizeRadians` function SHALL normalize angles to the half-open interval `(-PI, PI]` where `+PI` is included and `-PI` is excluded. This matches IEEE 754 atan2 output, the C standard, MATLAB wrapToPi, Unity Mathf.DeltaAngle, Box2D, Bullet Physics, and the mathematical principal argument Arg(z).

#### Scenario: PI maps to +PI

WHEN `normalizeRadians(Math.PI)` is called
THEN the result SHALL be `+Math.PI` (not `-Math.PI`)

#### Scenario: -PI maps to +PI

WHEN `normalizeRadians(-Math.PI)` is called
THEN the result SHALL be `+Math.PI`
AND this SHALL be consistent: -PI and +PI represent the same angle, and +PI is the canonical form

#### Scenario: Odd multiples of PI map to +PI

WHEN `normalizeRadians(3 * Math.PI)` or `normalizeRadians(-3 * Math.PI)` is called
THEN the result SHALL be `+Math.PI`

#### Scenario: Non-boundary values are unchanged

WHEN `normalizeRadians(x)` is called where `x` is not an exact odd multiple of PI
THEN the result SHALL be identical to the previous `[-PI, PI)` convention
AND values even 1e-15 away from the PI boundary SHALL NOT be affected

#### Scenario: Consistent with atan2 output

WHEN `normalizeRadians(Math.atan2(y, x))` is computed for any finite x, y
THEN the result SHALL equal `Math.atan2(y, x)` exactly (no value change)

### Requirement: normalizeDegrees MUST use (-180, 180] convention

The `normalizeDegrees` function SHALL normalize angles to `(-180, 180]` where `+180` is included and `-180` is excluded. Same rationale as normalizeRadians.

#### Scenario: 180 maps to +180

WHEN `normalizeDegrees(180)` is called
THEN the result SHALL be `+180` (not `-180`)

#### Scenario: -180 maps to +180

WHEN `normalizeDegrees(-180)` is called
THEN the result SHALL be `+180`

### Requirement: normalizeRadiansPositive and normalizeDegreesPositive MUST NOT change

The `normalizeRadiansPositive` `[0, TAU)` and `normalizeDegreesPositive` `[0, 360)` conventions SHALL remain unchanged.

#### Scenario: Positive normalization is unaffected

WHEN `normalizeRadiansPositive(Math.PI)` is called
THEN the result SHALL be `Math.PI` (unchanged from current behavior)

### Requirement: angleDifference MUST reflect new convention

The `angleDifference` function inherits the convention change through its use of `normalizeRadians`. Its range changes from `[-PI, PI)` to `(-PI, PI]`.

#### Scenario: angleDifference at PI boundary resolves to +PI

WHEN `angleDifference(0, Math.PI)` is called
THEN the result SHALL be `+Math.PI` (CCW half-turn, aligning with CCW-positive convention)

#### Scenario: angleDifference anti-symmetry note

WHEN `angleDifference(Math.PI, 0)` is called
THEN the result SHALL also be `+Math.PI` (anti-symmetry breaks at the PI boundary; this is inherent and SHALL be documented)

### Requirement: Rotation2.fromAngle round-trip MUST be consistent

The `Rotation2.fromAngle(angle).angle` round-trip SHALL preserve the sign of PI.

#### Scenario: fromAngle(PI).angle equals PI

WHEN `Rotation2.fromAngle(Math.PI)` is constructed and `.angle` is read
THEN the angle SHALL be approximately `+Math.PI` (not `-Math.PI`)
AND `fromAngle(PI).angleTurns` SHALL be approximately `0.5` (not `-0.5`)
