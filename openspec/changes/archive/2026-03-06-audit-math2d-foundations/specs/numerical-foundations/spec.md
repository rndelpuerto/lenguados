## ADDED Requirements

### Requirement: EPSILON value validated against IEEE 754 and industry practice

The value of `EPSILON` (currently 1e-10) SHALL be validated against IEEE 754 double precision
machine epsilon (~2.22e-16), the values used by gl-matrix (~1e-6), three.js (1e-6 for geometry,
no global), Box2D (various per-context), Unity.Mathematics (float.Epsilon for single, ~1e-7),
Eigen (NumTraits::epsilon), and nalgebra (f64::EPSILON).

The audit SHALL document:

1. The mathematical justification for 1e-10 vs alternatives
2. Whether a single global EPSILON is appropriate or per-context tolerances are needed
3. How each reference library handles tolerance (global constant vs per-function parameter vs adaptive)
4. The relationship between EPSILON and the accumulated error of deterministic kernel operations

#### Scenario: EPSILON is within justified range

- **WHEN** the audit evaluates `EPSILON = 1e-10`
- **THEN** it SHALL produce a documented justification citing IEEE 754, Higham's error analysis framework, and at least two commercial library comparisons

#### Scenario: EPSILON-dependent functions are identified

- **WHEN** the audit traces all usages of `EPSILON` across the codebase
- **THEN** it SHALL produce a complete list of functions that use EPSILON as default tolerance, documenting whether 1e-10 is appropriate for each use case

#### Scenario: Accumulated error bounds documented

- **WHEN** the audit analyzes composite operations (e.g., rotation composition, transform chain)
- **THEN** it SHALL document the worst-case accumulated error after N operations and whether EPSILON covers that error bound, citing Higham's forward/backward error analysis

---

### Requirement: ANGLE_EPSILON value validated against trigonometric precision

The value of `ANGLE_EPSILON` (currently 1e-12) SHALL be validated against:

1. The output precision of the deterministic `sin`/`cos`/`atan2` kernels (fdlibm-based)
2. The angular resolution achievable at IEEE 754 double precision
3. How reference libraries handle angular comparison (dedicated constant vs reusing general epsilon)

#### Scenario: ANGLE_EPSILON matches kernel output precision

- **WHEN** the audit measures the maximum error of `sin(x)` and `cos(x)` in the deterministic kernels
- **THEN** `ANGLE_EPSILON` SHALL be documented as >= the maximum observed error in kernel outputs, with fdlibm accuracy specifications cited

#### Scenario: Angular comparison precision is sufficient

- **WHEN** `anglesNearEqual(a, b, ANGLE_EPSILON)` is used to compare angles after normalization
- **THEN** the tolerance SHALL be documented as sufficient to absorb normalization rounding errors without producing false positives, citing the error analysis of `normalizeRadians`

---

### Requirement: MIN_SAFE_DIVISOR validated against division safety

The value of `MIN_SAFE_DIVISOR` (currently equal to EPSILON) SHALL be validated by:

1. Computing the smallest denominator that produces a finite IEEE 754 result for representative numerators
2. Comparing against Box2D's `b2_epsilon`, Rapier's tolerance constants, and gl-matrix's approach
3. Determining whether MIN_SAFE_DIVISOR should equal EPSILON or have an independent value

#### Scenario: MIN_SAFE_DIVISOR prevents overflow

- **WHEN** `divideSafe(MAX_SAFE_INTEGER_F64, MIN_SAFE_DIVISOR)` is called
- **THEN** the result SHALL be finite, documenting the overflow boundary

#### Scenario: MIN_SAFE_DIVISOR relationship to EPSILON justified

- **WHEN** the audit evaluates whether `MIN_SAFE_DIVISOR === EPSILON` is appropriate
- **THEN** it SHALL document whether these serve different purposes (comparison tolerance vs division safety) and whether they should be independent, citing at least one reference library's approach

---

### Requirement: Mathematical constants verified to maximum double precision

All exported mathematical constants (PI, TAU, HALF_PI, QUARTER_PI, E, LN_2, SQRT_2, SQRT_HALF,
GOLDEN_RATIO, GOLDEN_RATIO_CONJUGATE, SMALLEST_NORMAL) SHALL be verified against IEEE 754
double precision to all 17 significant digits.

The audit SHALL verify each constant against:

1. The value produced by the corresponding `Math.*` constant or operation
2. The value in Wolfram Alpha / OEIS to full precision
3. The value used in at least two reference libraries

#### Scenario: PI matches IEEE 754 best representation

- **WHEN** the audit compares `PI` against `Math.PI`
- **THEN** they SHALL be bit-identical (same IEEE 754 double representation)

#### Scenario: Derived constants are mathematically consistent

- **WHEN** the audit checks `DEG_TO_RAD` against `PI / 180`
- **THEN** `DEG_TO_RAD` SHALL equal `PI / 180` exactly (not a rounded approximation), and the audit SHALL document whether pre-computing vs inline computing matters for determinism

#### Scenario: SMALLEST_NORMAL matches IEEE 754 spec

- **WHEN** the audit verifies `SMALLEST_NORMAL`
- **THEN** it SHALL equal `2^-1022` (≈ 2.2250738585072014e-308) per IEEE 754-2019 section 3.4

---

### Requirement: Compensated arithmetic validated against Kahan/Neumaier references

The implementations of `neumaierSum`, `robustSum`, and `compensatedProduct` SHALL be validated against:

1. Neumaier's 1974 paper "Rundungsfehleranalyse einiger Verfahren zur Summation endlicher Summen"
2. Kahan's 1965 summation algorithm
3. Priest's 1992 "On Properties of Floating Point Arithmetics"
4. The implementations in math.js and numeric.js

#### Scenario: neumaierSum matches reference accuracy

- **WHEN** `neumaierSum([1e16, 1, -1e16])` is called
- **THEN** it SHALL return exactly `1` (not `0` as naive summation would), validated against Neumaier's algorithm

#### Scenario: compensatedProduct error bound documented

- **WHEN** the audit analyzes `compensatedProduct`
- **THEN** it SHALL document the error bound relative to Veltkamp splitting and TwoProduct (Ogita, Rump, Oishi 2005), citing the expected relative error

---

### Requirement: Safe function behavior validated against domain analysis

Each `*Safe` function (divideSafe, reciprocalSafe, logSafe, powSafe, lerpSafe, sqrtSafe,
acosSafe, asinSafe, expSafe) SHALL have its fallback value validated against:

1. The mathematical limit as the input approaches the failure boundary
2. The approach of reference libraries (what does gl-matrix return? three.js? Box2D?)
3. The principle of least surprise for the developer

#### Scenario: divideSafe fallback is zero

- **WHEN** `divideSafe(x, 0)` is called
- **THEN** returning `0` SHALL be justified vs alternatives (returning `Infinity`, returning `NaN`, returning the numerator), citing how Box2D and Rapier handle division-by-zero in physics contexts

#### Scenario: sqrtSafe fallback for negative input

- **WHEN** `sqrtSafe(-1)` is called
- **THEN** returning `0` SHALL be justified vs alternatives (returning `NaN`, returning `sqrt(abs(x))`), citing the approach of GLSL `sqrt` (undefined for negative) and Unity.Mathematics `math.sqrt` (returns NaN)

#### Scenario: acosSafe clamps to domain

- **WHEN** `acosSafe(1.0000001)` is called (slightly outside [-1, 1])
- **THEN** the behavior (clamp to 1.0 then compute, vs return 0, vs return NaN) SHALL be justified against GLSL spec, Godot's `acos`, and Lengyel's recommendation for clamping before inverse trig

---

### Requirement: Tolerance strategy classified per operation type

The audit SHALL classify every function that uses a tolerance parameter into one of these categories
and document whether the current default is appropriate:

1. **Geometric comparison** — comparing positions/directions (EPSILON appropriate)
2. **Angular comparison** — comparing angles (ANGLE_EPSILON appropriate)
3. **Numerical safety** — preventing division by zero or overflow (MIN_SAFE_DIVISOR appropriate)
4. **Iterative convergence** — checking iteration termination (ITERATIVE_TOLERANCE appropriate)

#### Scenario: Each tolerance-using function is classified

- **WHEN** the audit completes the tolerance classification
- **THEN** every function with an `epsilon?` parameter SHALL have a documented category and justification for its default value

#### Scenario: Cross-cutting tolerance consistency

- **WHEN** two functions in the same category use different default tolerances
- **THEN** the audit SHALL flag this as an inconsistency and recommend alignment or justify the divergence
