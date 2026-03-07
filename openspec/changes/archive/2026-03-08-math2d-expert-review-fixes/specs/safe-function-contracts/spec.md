## ADDED Requirements

### Requirement: Safe function finite-in/finite-out invariant

Every function in the `*Safe` family SHALL satisfy the finite-in/finite-out invariant: for any combination of finite input arguments, the return value MUST be finite (not NaN, not Infinity, not -Infinity). This invariant defines the core contract that distinguishes `*Safe` from strict and unchecked variants.

#### Scenario: powSafe with zero base and negative exponent

- **GIVEN** `base = 0` and `exponent = -1`
- **WHEN** `powSafe(base, exponent)` is called
- **THEN** the result SHALL be `0` (the safe fallback) — the function SHALL NOT return `Infinity`
- **AND** the early return `if (base === 0) return 0` SHALL be conditional on `exponent >= 0`; for negative exponents with zero base, the function SHALL return `0` as the safe fallback

#### Scenario: logSafe with base 1

- **GIVEN** `value = 10` and `base = 1`
- **WHEN** `logSafe(value, base)` is called
- **THEN** the result SHALL be `0` (the safe fallback), not `Infinity`

#### Scenario: logSafe with negative base

- **GIVEN** `value = 10` and `base = -2`
- **WHEN** `logSafe(value, base)` is called
- **THEN** the result SHALL be `0` (the safe fallback), not `NaN`

#### Scenario: logSafe with zero base

- **GIVEN** `value = 10` and `base = 0`
- **WHEN** `logSafe(value, base)` is called
- **THEN** the result SHALL be `0` (the safe fallback)

#### Scenario: logSafe with infinite base

- **GIVEN** `value = 10` and `base = Infinity`
- **WHEN** `logSafe(value, base)` is called
- **THEN** the result SHALL be `0` (the safe fallback)

### Requirement: Safe function NaN propagation

`*Safe` functions SHALL propagate NaN from primary operands, NOT silently convert NaN to a fallback value. NaN in a primary operand indicates a computation error upstream that should propagate, not be masked. Exception: functions whose explicit purpose is NaN replacement (e.g., `sanitizeNumber`, `ensureFinite`) may convert NaN.

#### Scenario: expSafe with NaN input

- **GIVEN** `x = NaN`
- **WHEN** `expSafe(x)` is called
- **THEN** the result SHALL be `NaN`, not `1` (the neutral element)

#### Scenario: powSafe with NaN base

- **GIVEN** `base = NaN`, `exponent = 2`
- **WHEN** `powSafe(base, exponent)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: sqrtSafe with NaN input

- **GIVEN** `x = NaN`
- **WHEN** `sqrtSafe(x)` is called
- **THEN** the result SHALL be `NaN` (current behavior — this is correct, verify it is preserved)

### Requirement: lerpSafe overflow protection

`lerpSafe` SHALL avoid overflow when `a` and `b` have large magnitudes with opposite signs. The formula SHALL use `a * (1 - t) + b * t` (distributive form) instead of `a + (b - a) * t` (difference form) to prevent the intermediate `b - a` from overflowing.

#### Scenario: lerpSafe with opposite-sign large values

- **GIVEN** `a = -1e308` and `b = 1e308` and `t = 0.3`
- **WHEN** `lerpSafe(a, b, t)` is called
- **THEN** the result SHALL be approximately `-4e307` (not `Infinity`)

#### Scenario: lerpSafe with same-sign large values

- **GIVEN** `a = 1e308` and `b = 2e308` and `t = 0.5`
- **WHEN** `lerpSafe(a, b, t)` is called
- **THEN** the result SHALL be approximately `1.5e308`

#### Scenario: lerpSafe preserves normal-range behavior

- **GIVEN** `a = 0` and `b = 10` and `t = 0.5`
- **WHEN** `lerpSafe(a, b, t)` is called
- **THEN** the result SHALL be `5`

### Requirement: Safe function fallback validity

For `*Safe` functions that accept a `fallback` parameter, the fallback value MUST satisfy the function's postconditions. If the function specifies a valid output range, the fallback MUST be within that range.

#### Scenario: sanitizeNumber fallback within range

- **GIVEN** `value = NaN`, `fallback = 50`, `min = 0`, `max = 10`
- **WHEN** `sanitizeNumber(value, fallback, min, max)` is called
- **THEN** the result SHALL be `10` (fallback clamped to [min, max]), not `50`

#### Scenario: ensureFinite fallback must be finite

- **GIVEN** `value = NaN`, `fallback = Infinity`
- **WHEN** `ensureFinite(value, fallback)` is called
- **THEN** the result SHALL be `0` (default finite fallback), not `Infinity`

#### Scenario: ensureFinite with valid fallback

- **GIVEN** `value = NaN`, `fallback = 42`
- **WHEN** `ensureFinite(value, fallback)` is called
- **THEN** the result SHALL be `42`

### Requirement: divideSafe and reciprocalSafe documentation accuracy

The JSDoc examples for `divideSafe` and `reciprocalSafe` SHALL accurately reflect the function's behavior at the EPSILON boundary. The comparison is strict less-than (`<`), so values equal to EPSILON are NOT treated as near-zero.

#### Scenario: divideSafe doc example correctness

- **GIVEN** the JSDoc example `divideSafe(10, 0.0000000001)`
- **WHEN** `|0.0000000001| < EPSILON (1e-10)` is evaluated
- **THEN** the comparison is `false` (1e-10 is NOT strictly less than 1e-10), so the function SHALL return `10 / 1e-10 = 1e11`
- **AND** the JSDoc SHALL be corrected to use `divideSafe(10, 1e-11)` as the example that returns `0`

#### Scenario: reciprocalSafe doc example correctness

- **GIVEN** the JSDoc example `reciprocalSafe(0.00001)`
- **WHEN** `|0.00001| < EPSILON (1e-10)` is evaluated
- **THEN** the comparison is `false`, so the function SHALL return `1 / 0.00001 = 100000`
- **AND** the JSDoc SHALL be corrected to use `reciprocalSafe(1e-11)` as the example that returns `0`

### Requirement: Interval.reciprocal direct division for validated inputs

`Interval.reciprocal` (strict variant) SHALL use direct `1 / value` division instead of `divideSafe` after the zero-containment guard has already verified that the interval does not contain zero. Using `divideSafe` on already-validated inputs can silently return 0 for denormal bounds, corrupting the result.

#### Scenario: Reciprocal of interval with denormal bounds

- **GIVEN** `interval = Interval(1e-320, 1e-310)` (denormal range, does not contain zero)
- **WHEN** `Interval.reciprocal(interval)` is called
- **THEN** the result SHALL be approximately `Interval(1e310, 1e320)` (not `Interval(0, 0)`)
