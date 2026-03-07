## MODIFIED Requirements

### Requirement: Angle conversion functions use consistent multiplication pattern

All angle conversion functions SHALL use pre-computed multiplication constants rather than division. Specifically, `radiansToTurns` SHALL use `radians * RAD_TO_TURN` (not `radians / TAU`), consistent with `degreesToRadians` using `* DEG_TO_RAD`, `radiansToDegrees` using `* RAD_TO_DEG`, and `turnsToRadians` using `* TURN_TO_RAD`.

#### Scenario: radiansToTurns uses multiplication

- **WHEN** the implementation of `radiansToTurns` is inspected
- **THEN** it SHALL use `radians * RAD_TO_TURN` where `RAD_TO_TURN = 1 / TAU`

#### Scenario: radiansToTurns produces correct results

- **WHEN** `radiansToTurns(2 * Math.PI)` is called
- **THEN** the result SHALL be `1` within EPSILON tolerance

### Requirement: Rounding functions SHALL validate non-finite inputs

`roundToPlaces`, `roundToMultiple`, and `snapToGrid` SHALL return the input unchanged when the value is not finite (NaN or Infinity), matching IEEE 754 propagation semantics and aligning with `roundToInt`'s validation pattern.

#### Scenario: roundToPlaces with NaN returns NaN

- **WHEN** `roundToPlaces(NaN, 2)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: roundToPlaces with Infinity returns Infinity

- **WHEN** `roundToPlaces(Infinity, 2)` is called
- **THEN** it SHALL return `Infinity`

#### Scenario: roundToMultiple with NaN returns NaN

- **WHEN** `roundToMultiple(NaN, 5)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: roundToMultiple with negative Infinity returns negative Infinity

- **WHEN** `roundToMultiple(-Infinity, 5)` is called
- **THEN** it SHALL return `-Infinity`

#### Scenario: snapToGrid with NaN returns NaN

- **WHEN** `snapToGrid(NaN, 1)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: snapToGrid with Infinity returns Infinity

- **WHEN** `snapToGrid(Infinity, 1)` is called
- **THEN** it SHALL return `Infinity`

#### Scenario: Normal values remain unaffected

- **WHEN** `roundToPlaces(3.14159, 2)` is called
- **THEN** it SHALL return `3.14` (existing behavior unchanged)

### Requirement: logSafe JSDoc one-line summary SHALL match implementation

The `logSafe` function in `auxiliary/numeric/safety.ts` has a one-line description at line 123 that says "Safe logarithm (returns -Infinity for <= 0)". This is INCORRECT — the function returns `0`, not `-Infinity`. The `@returns` tag and `@remarks` section are already correct. Only the one-line summary needs fixing.

#### Scenario: logSafe returns 0 for zero

- **WHEN** `logSafe(0)` is called
- **THEN** it SHALL return `0`

#### Scenario: logSafe returns 0 for negative values

- **WHEN** `logSafe(-5)` is called
- **THEN** it SHALL return `0`

#### Scenario: logSafe one-line JSDoc summary

- **WHEN** the one-line JSDoc description for `logSafe` is inspected
- **THEN** it SHALL state "Safe logarithm (returns 0 for non-positive values)"
