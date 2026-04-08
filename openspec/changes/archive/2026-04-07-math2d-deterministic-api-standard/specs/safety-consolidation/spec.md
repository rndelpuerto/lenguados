## MODIFIED Requirements

### Requirement: ALL Safe math functions SHALL live in auxiliary/numeric/safety.ts

`auxiliary/numeric/safety.ts` SHALL be the single canonical location for all scalar Safe math functions. Functions moved from L0:

- `acosSafe(x)`: Clamps input to [-1, 1], delegates to deterministic `acos`
- `asinSafe(x)`: Clamps input to [-1, 1], delegates to deterministic `asin`
- `expSafe(x)`: Clamps overflow to `Number.MAX_VALUE` / `0`, delegates to deterministic `exp`

`logKernelSafe` is NOT moved — it is deleted. The existing `logSafe(value, base?)` already handles the natural-log case (base defaults to `Math.E`, guard `value <= 0` returns 0).

**Evidence:**

1. `safety.ts` already contains 7 Safe functions: `divideSafe`, `reciprocalSafe`, `sqrtSafe`, `logSafe`, `powSafe`, `lerpSafe`, `sanitizeNumber`, `ensureFinite`. It IS the canonical safety layer.
2. `acosSafe`/`asinSafe` were already re-exported from `safety.ts` (lines 129, 140). This change converts re-exports to definitions.
3. `expSafe` follows the same pattern as `powSafe` (wraps a deterministic kernel with overflow/edge-case handling).

#### Scenario: acosSafe defined in safety.ts

- **GIVEN** `auxiliary/numeric/safety.ts`
- **WHEN** `acosSafe(x)` is called with `x = 1.5`
- **THEN** it SHALL return `0` (clamped to 1, `acos(1) = 0`)
- **AND** the implementation SHALL import `acos` from `../../deterministic/deterministic-kernels`

#### Scenario: acosSafe with valid input

- **GIVEN** `acosSafe(0.5)`
- **THEN** the result SHALL be identical to `acos(0.5)` from the deterministic kernel

#### Scenario: asinSafe defined in safety.ts

- **GIVEN** `asinSafe(-1.5)`
- **THEN** it SHALL return `-PI/2` (clamped to -1)

#### Scenario: expSafe defined in safety.ts

- **GIVEN** `expSafe(1000)`
- **THEN** it SHALL return `Number.MAX_VALUE` (not `Infinity`)

- **GIVEN** `expSafe(-1000)`
- **THEN** it SHALL return `0` (not a subnormal)

#### Scenario: logKernelSafe does not exist

- **GIVEN** the codebase
- **WHEN** a developer searches for `logKernelSafe`
- **THEN** zero results SHALL be found
- **AND** `logSafe(x)` (with default base) SHALL serve the same purpose

#### Scenario: naming consistency

- **GIVEN** all Safe functions in `safety.ts`
- **WHEN** their names are listed
- **THEN** every name SHALL follow the pattern `{functionName}Safe`
- **AND** no name SHALL contain a `Kernel` infix or any other non-standard modifier
