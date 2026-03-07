## MODIFIED Requirements

### Requirement: Angle conversion functions use consistent multiplication pattern

All angle conversion functions SHALL use pre-computed multiplication constants rather than division. Specifically, `radiansToTurns` SHALL use `radians * RAD_TO_TURN` (not `radians / TAU`), consistent with `degreesToRadians` using `* DEG_TO_RAD`, `radiansToDegrees` using `* RAD_TO_DEG`, and `turnsToRadians` using `* TURN_TO_RAD`.

#### Scenario: radiansToTurns uses multiplication

- **WHEN** the implementation of `radiansToTurns` is inspected
- **THEN** it SHALL use `radians * RAD_TO_TURN` where `RAD_TO_TURN = 1 / TAU`

#### Scenario: radiansToTurns produces correct results

- **WHEN** `radiansToTurns(2 * Math.PI)` is called
- **THEN** the result SHALL be `1` within EPSILON tolerance
