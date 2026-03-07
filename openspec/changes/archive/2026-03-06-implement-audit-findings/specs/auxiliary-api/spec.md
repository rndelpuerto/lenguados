## REMOVED Requirements

### Requirement: ANGLE_EPSILON constant removed

**Reason**: Zero consumers in the entire codebase. Its existence causes confusion about which epsilon to use (EPSILON vs ANGLE_EPSILON). If tighter angular tolerance is needed, pass it as an `eps` parameter to `anglesNearEqual`.
**Migration**: Use `EPSILON` with the optional `eps` parameter on comparison functions (e.g., `anglesNearEqual(a, b, 1e-12)`).

### Requirement: GOLDEN_RATIO constant removed

**Reason**: Zero consumers in the codebase. Not a math-core primitive. `GOLDEN_RATIO_CONJUGATE` (~0.618) remains because it is computationally useful. If the golden ratio is needed, compute it: `1 + GOLDEN_RATIO_CONJUGATE`.
**Migration**: Use `1 + GOLDEN_RATIO_CONJUGATE` to compute phi, or define it locally.

## MODIFIED Requirements

### Requirement: Scalar constants are complete and correctly placed

The `auxiliary/scalar/constants.ts` module SHALL export exactly these constants:

- `EPSILON` (1e-10), `EPSILON_SQUARED` (EPSILON^2)
- `ITERATIVE_TOLERANCE` (1e-6), `MAX_SAFE_INTEGER_F64` (Number.MAX_SAFE_INTEGER)
- `PI`, `TAU`, `HALF_PI`, `QUARTER_PI`
- `DEG_TO_RAD`, `RAD_TO_DEG`, `RAD_TO_TURN`, `TURN_TO_RAD`
- `SQRT_2`, `SQRT_HALF`, `LN_2`, `E`
- `GOLDEN_RATIO_CONJUGATE`, `SMALLEST_NORMAL`
- `Constants` unified object re-exporting all above

`ANGLE_EPSILON` and `GOLDEN_RATIO` SHALL NOT be exported.

#### Scenario: Constants object completeness

- **WHEN** a consumer imports `Constants`
- **THEN** it SHALL contain all individually exported constants as properties and SHALL NOT contain `ANGLE_EPSILON` or `GOLDEN_RATIO`

#### Scenario: ANGLE_EPSILON is not exported

- **WHEN** a consumer attempts to import `ANGLE_EPSILON` from `@lenguados/math2d`
- **THEN** it SHALL produce a TypeScript compilation error (symbol not found)

### Requirement: sqrtSafe lives in numeric/safety

The `sqrtSafe` function SHALL be defined in `auxiliary/numeric/safety.ts` with implementation `x <= 0 ? 0 : Math.sqrt(x)`. It SHALL be re-exported from `deterministic/deterministic-kernels.ts` for backward compatibility.

#### Scenario: sqrtSafe returns 0 for negative input

- **WHEN** `sqrtSafe(-4)` is called
- **THEN** it SHALL return `0`

#### Scenario: sqrtSafe uses Math.sqrt for positive input

- **WHEN** `sqrtSafe(9)` is called
- **THEN** it SHALL return `3` (via Math.sqrt, IEEE 754 correctly rounded)

#### Scenario: sqrtSafe importable from both locations

- **WHEN** `sqrtSafe` is imported from `@lenguados/math2d`
- **THEN** it SHALL be the same function regardless of import path
