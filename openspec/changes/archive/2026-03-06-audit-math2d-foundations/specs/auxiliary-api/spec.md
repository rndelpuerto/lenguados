## MODIFIED Requirements

### Requirement: Scalar constants are complete and correctly placed

The `auxiliary/scalar/constants.ts` module SHALL export exactly these constants:

- `EPSILON` (1e-10), `EPSILON_SQUARED` (EPSILON^2), `ANGLE_EPSILON` (1e-12)
- `ITERATIVE_TOLERANCE` (1e-6), `MAX_SAFE_INTEGER_F64` (Number.MAX_SAFE_INTEGER)
- `PI`, `TAU`, `HALF_PI`, `QUARTER_PI`
- `DEG_TO_RAD`, `RAD_TO_DEG`, `RAD_TO_TURN`, `TURN_TO_RAD`
- `SQRT_2`, `SQRT_HALF`, `LN_2`, `E`
- `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE`, `SMALLEST_NORMAL`
- `Constants` unified object re-exporting all above

No constant SHALL be duplicated across modules. All tolerance-related constants
live in scalar/constants.

**AUDIT SCOPE**: Every constant value and its placement SHALL be re-evaluated:

- `EPSILON = 1e-10` vs gl-matrix's 1e-6 vs IEEE 754 machine epsilon — which is correct for 2D math?
- `ANGLE_EPSILON = 1e-12` — is this tighter than the fdlibm kernel output precision warrants?
- `ITERATIVE_TOLERANCE = 1e-6` — what iterative algorithms use this? Is 1e-6 justified?
- `GOLDEN_RATIO` and `GOLDEN_RATIO_CONJUGATE` — do any math operations use these? Are they math-core or utility?
- `SMALLEST_NORMAL` — verified against IEEE 754-2019 section 3.4?
- Whether `Constants` unified object is a JS-ecosystem pattern (lodash-style) or unusual

#### Scenario: EPSILON value externally justified

- **WHEN** the audit evaluates `EPSILON = 1e-10`
- **THEN** it SHALL produce a decision: maintain, change to 1e-6, change to 1e-12, or make configurable — with Higham error analysis, gl-matrix comparison, and three.js comparison as evidence

#### Scenario: Constant precision

- **WHEN** a constant represents a mathematical value (e.g., PI, GOLDEN_RATIO)
- **THEN** its value SHALL match IEEE 754 double precision to all available significant digits

#### Scenario: Constants object completeness

- **WHEN** a consumer imports `Constants`
- **THEN** it SHALL contain all individually exported constants as properties

---

### Requirement: Numeric safety functions with \*Safe suffix naming

The `auxiliary/numeric/safety.ts` module SHALL export with **suffix naming**:

- `divideSafe(numerator, denominator, epsilon?)` (RENAMED from `safeDivide`)
- `reciprocalSafe(value, epsilon?)` (RENAMED from `safeReciprocal`)
- `logSafe(value, base?)` (RENAMED from `safeLog`)
- `powSafe(base, exponent)` (RENAMED from `safePow`)
- `lerpSafe(a, b, t)` (RENAMED from `safeLerp`)
- `sanitizeNumber(value, fallback?, min?, max?)`
- `ensureFinite(value, fallback?)`
- `robustSum(values)`, `neumaierSum(values)`, `compensatedProduct(a, b)`
- `MIN_SAFE_DIVISOR` constant (= EPSILON)

**AUDIT SCOPE**: Each safety function's fallback behavior SHALL be re-evaluated:

- What does Box2D do when dividing by zero in contact solving? (clamp, skip, assert)
- What does Rapier return for zero-length normalization? (returns zero vector)
- Are the fallback values (0 for division, -Infinity for log) mathematically justified or arbitrary?
- Should `MIN_SAFE_DIVISOR` be independent from `EPSILON`?
- Are `robustSum` and `neumaierSum` correctly implementing their respective algorithms?

#### Scenario: Safety fallback values justified

- **WHEN** the audit evaluates each `*Safe` function's fallback value
- **THEN** each SHALL have documented justification: mathematical limit, industry precedent, or DX rationale — not "returns 0 because that's what we chose"

#### Scenario: divideSafe with near-zero denominator

- **WHEN** `divideSafe(10, 1e-15)` is called with default epsilon
- **THEN** it SHALL return `0`

---

### Requirement: Angle normalization consolidated to 4 functions

The `auxiliary/angle/normalization.ts` module SHALL export exactly 4 functions:

- `normalizeRadians(radians)` — normalize to [-PI, PI)
- `normalizeRadiansPositive(radians)` — normalize to [0, TAU)
- `normalizeDegrees(degrees)` — normalize to [-180, 180)
- `normalizeDegreesPositive(degrees)` — normalize to [0, 360)

**AUDIT SCOPE**: The normalization functions SHALL be re-evaluated:

- Do reference libraries normalize to [-PI, PI) or (-PI, PI]? (GLSL: implementation-defined; Godot: [-PI, PI]; Box2D: not exposed)
- Is the half-open interval [-PI, PI) mathematically correct for all use cases?
- Are there precision issues at the boundaries (exactly PI)?
- Should `clampAngle` and `isAngleBetween` be in normalization or operations module?

#### Scenario: Normalization range convention validated

- **WHEN** the audit evaluates [-PI, PI) vs (-PI, PI] vs [-PI, PI]
- **THEN** it SHALL document which convention is used by GLSL, three.js, Unity, Godot, and Box2D, and justify the chosen convention for consistency with atan2 output range

#### Scenario: Normalize negative angle

- **WHEN** `normalizeRadians(-3 * PI)` is called
- **THEN** it SHALL return a value nearEquals to `-PI` within ANGLE_EPSILON
