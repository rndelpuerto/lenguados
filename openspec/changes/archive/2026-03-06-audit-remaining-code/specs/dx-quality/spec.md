## MODIFIED Requirements

### Requirement: Error messages validated for actionability

Assertion error messages in `validation/assert.ts` SHALL suggest the corresponding Safe variant when one exists. The message format SHALL be:

`[math2d] <name> <violation description>. Use <operationSafe>() for a fallback value`

The Safe variant suggestion SHALL only be included when a Safe variant actually exists for the operation context.

#### Scenario: assertFinite suggests ensureFinite

- **WHEN** `assertFinite(NaN, 'velocity.x')` throws
- **THEN** the error message SHALL include `Use ensureFinite() for a fallback value`

#### Scenario: assertNonZero suggests divideSafe

- **WHEN** `assertNonZero(0, 'denominator')` throws
- **THEN** the error message SHALL include `Use divideSafe() for a fallback value`

#### Scenario: assertVector2 does not suggest Safe variant

- **WHEN** `assertVector2(NaN, 0, 'position')` throws
- **THEN** the error message SHALL NOT include a Safe variant suggestion (no vectorSafe exists)

#### Scenario: assertRange message is actionable

- **WHEN** `assertRange(5, 0, 1, 'alpha')` throws
- **THEN** the error message SHALL include the valid range and the actual value: `alpha must be in range [0, 1], got 5`
