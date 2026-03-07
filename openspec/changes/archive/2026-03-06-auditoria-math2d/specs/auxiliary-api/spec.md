## ADDED Requirements

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

#### Scenario: Constant precision

- **WHEN** a constant represents a mathematical value (e.g., PI, GOLDEN_RATIO)
- **THEN** its value SHALL match IEEE 754 double precision to all available significant digits

#### Scenario: Constants object completeness

- **WHEN** a consumer imports `Constants`
- **THEN** it SHALL contain all individually exported constants as properties

---

### Requirement: Scalar arithmetic functions with correct triality

The `auxiliary/scalar/arithmetic.ts` module SHALL export:

- `clamp(value, min, max)` — no variants needed (pure clamping, no failure mode)
- `sign(value)` — returns -1, 0, or 1; handles NaN and signed zeros correctly
- `saturate(value)` — clamp to [0, 1]
- `saturateSigned(value)` — clamp to [-1, 1]
- `step(edge, x)` — Heaviside step, returns 0 or 1
- `floorDivide(value, divisor)` — floor of quotient
- `remap(value, inMin, inMax, outMin, outMax)` — strict, throws if inMin === inMax
- `remapSafe(value, inMin, inMax, outMin, outMax)` — returns outMin if inMin === inMax
- `loop(value, min, max)` / `loopSafe` / `loopUnchecked` — full triality
- `pingPong(value, min, max)` / `pingPongSafe` / `pingPongUnchecked` — full triality
- `mod(dividend, divisor)` / `modSafe` / `modUnchecked` — full triality

#### Scenario: remap strict throws on zero range

- **WHEN** `remap(5, 10, 10, 0, 100)` is called (inMin === inMax)
- **THEN** it SHALL throw an Error

#### Scenario: remapSafe returns fallback on zero range

- **WHEN** `remapSafe(5, 10, 10, 0, 100)` is called (inMin === inMax)
- **THEN** it SHALL return `0` (outMin)

#### Scenario: loop wraps value into range

- **WHEN** `loop(370, 0, 360)` is called
- **THEN** it SHALL return `10`

---

### Requirement: Scalar comparison functions

The `auxiliary/scalar/comparison.ts` module SHALL export:

- `nearEquals(a, b, epsilon?)` — absolute tolerance comparison, default EPSILON
- `isNearZero(value, epsilon?)` — |value| <= epsilon
- `isNearOne(value, epsilon?)` — |value - 1| <= epsilon
- `relativeEquals(a, b, relativeEpsilon?)` — scaled tolerance for large values
- `lessThan(a, b, epsilon?)` — a < b - epsilon
- `greaterThan(a, b, epsilon?)` — a > b + epsilon
- `inRange(value, min, max, epsilon?)` — inclusive range check with tolerance
- `compare(a, b, epsilon?)` — returns -1, 0, or 1

No variants needed — comparisons are predicates with no failure mode.

#### Scenario: nearEquals with default tolerance

- **WHEN** `nearEquals(1.0, 1.0 + 1e-11)` is called with default EPSILON (1e-10)
- **THEN** it SHALL return `true`

#### Scenario: nearEquals with NaN input

- **WHEN** `nearEquals(NaN, NaN)` is called
- **THEN** it SHALL return `false` (IEEE 754: NaN !== NaN)

---

### Requirement: Scalar interpolation functions

The `auxiliary/scalar/interpolation.ts` module SHALL export:

- `lerp(a, b, t)` — linear interpolation, allows extrapolation (t outside [0,1])
- `lerpClamped(a, b, t)` — lerp with t clamped to [0, 1]
- `inverseLerp(a, b, value)` / `inverseLerpSafe` / `inverseLerpUnchecked` — full triality (division by zero risk when a === b)
- `smoothStep(edge0, edge1, x)` — Hermite 3rd order: 3t^2 - 2t^3
- `smootherStep(edge0, edge1, x)` — Hermite 5th order: 6t^5 - 15t^4 + 10t^3

No triality for lerp, lerpClamped, smoothStep, smootherStep — no failure modes.

#### Scenario: lerp extrapolates beyond [0,1]

- **WHEN** `lerp(0, 10, 1.5)` is called
- **THEN** it SHALL return `15` (extrapolation allowed)

#### Scenario: inverseLerp throws on equal endpoints

- **WHEN** `inverseLerp(5, 5, 5)` is called
- **THEN** it SHALL throw an Error (division by zero)

#### Scenario: inverseLerpSafe returns fallback

- **WHEN** `inverseLerpSafe(5, 5, 5)` is called
- **THEN** it SHALL return `0`

---

### Requirement: Angle conversion functions

The `auxiliary/angle/conversion.ts` module SHALL export exactly 4 conversion functions:

- `degreesToRadians(degrees)` — multiply by DEG_TO_RAD
- `radiansToDegrees(radians)` — multiply by RAD_TO_DEG
- `turnsToRadians(turns)` — multiply by TAU
- `radiansToTurns(radians)` — divide by TAU

No variants needed — pure multiplication, no failure modes.

#### Scenario: Full circle conversion

- **WHEN** `degreesToRadians(360)` is called
- **THEN** it SHALL return a value nearEquals to TAU within EPSILON

---

### Requirement: Angle normalization consolidated to 4 functions

The `auxiliary/angle/normalization.ts` module SHALL export exactly 4 functions:

- `normalizeRadians(radians)` — normalize to [-PI, PI)
- `normalizeRadiansPositive(radians)` — normalize to [0, TAU)
- `normalizeDegrees(degrees)` — normalize to [-180, 180)
- `normalizeDegreesPositive(degrees)` — normalize to [0, 360)

The following functions SHALL be REMOVED:

- `normalizeRadiansAround(radians, center)` — composable as `normalizeRadians(radians - center) + center`
- `wrapAngle(angle, period?)` — duplicates `loop()` from scalar/arithmetic

#### Scenario: Normalize negative angle

- **WHEN** `normalizeRadians(-3 * PI)` is called
- **THEN** it SHALL return a value nearEquals to `-PI` within ANGLE_EPSILON

#### Scenario: normalizeRadiansAround is removed

- **WHEN** a consumer needs angle normalization around a custom center
- **THEN** they SHALL compose: `normalizeRadians(angle - center) + center`

---

### Requirement: Angle operations with deterministic math

The `auxiliary/angle/operations.ts` module SHALL export:

- `SinCos` interface: `{ sin: number; cos: number }`
- `sinCos(angle, out?)` — computes sin and cos using deterministic kernels
- `sinCosNormalized(angle, out?)` — normalizes angle first, then computes; MUST accept `out` parameter
- `angleDifference(from, to)` — shortest signed difference in [-PI, PI)
- `angleDistance(a, b)` — absolute distance in [0, PI]
- `anglesNearEqual(a, b, epsilon?)` — comparison with ANGLE_EPSILON default
- `angleBisector(a, b)` — midpoint angle
- `isAngleBetween(angle, start, end, inclusive?)` — CCW arc test
- `clampAngle(angle, min, max)` — clamp to nearest boundary
- `angleFromVectors(x1, y1, x2, y2)` — using deterministic atan2

#### Scenario: sinCosNormalized accepts out parameter

- **WHEN** `sinCosNormalized(angle, existingObj)` is called with an out parameter
- **THEN** it SHALL write sin/cos to `existingObj` and return it, avoiding allocation

#### Scenario: angleDifference shortest path

- **WHEN** `angleDifference(0, 3 * PI / 2)` is called
- **THEN** it SHALL return a value nearEquals to `-PI/2` (shortest path is clockwise)

---

### Requirement: Angle interpolation functions

The `auxiliary/angle/interpolation.ts` module SHALL export:

- `lerpAngle(from, to, t)` — shortest-path linear interpolation
- `smoothStepAngle(from, to, t)` — eased angular interpolation using smoothStep

No triality needed — these delegate to `angleDifference` which handles edge cases.

#### Scenario: lerpAngle takes shortest path

- **WHEN** `lerpAngle(degreesToRadians(350), degreesToRadians(10), 0.5)` is called
- **THEN** it SHALL return a value nearEquals to `degreesToRadians(0)` (shortest path crosses 0)

---

### Requirement: Angle unwrapping utilities

The `auxiliary/angle/unwrapping.ts` module SHALL export:

- `unwrapAngles(angles, reference?)` — returns new array with phase-unwrapped angles
- `unwrapAnglesInPlace(angles, reference?)` — modifies array in place
- `AngleUnwrapper` class — streaming unwrapper with `next(theta)`, `value` getter, `reset()`

#### Scenario: Unwrap sequence crossing PI boundary

- **WHEN** `unwrapAngles([3.0, 3.1, -3.0])` is called (crossing from ~PI to ~-PI)
- **THEN** the third element SHALL be approximately `3.28` (unwrapped, not wrapped to -PI)

---

### Requirement: Numeric guard predicates

The `auxiliary/numeric/guards.ts` module SHALL export:

- `isPositiveInfinity(value)` — `value === Infinity`
- `isNegativeInfinity(value)` — `value === -Infinity`
- `isInfinity(value)` — either infinity
- `isDenormal(value)` — `|value| < SMALLEST_NORMAL && value !== 0`
- `isInRange(value, min, max)` — inclusive range check (no tolerance)

No variants — pure predicates.

#### Scenario: isDenormal detects subnormal numbers

- **WHEN** `isDenormal(5e-324)` is called (Number.MIN_VALUE, smallest positive subnormal)
- **THEN** it SHALL return `true`

#### Scenario: isDenormal rejects zero

- **WHEN** `isDenormal(0)` is called
- **THEN** it SHALL return `false`

---

### Requirement: Numeric safety functions with \*Safe suffix naming

The `auxiliary/numeric/safety.ts` module SHALL export with **suffix naming**:

- `divideSafe(numerator, denominator, epsilon?)` — returns 0 if |denom| < epsilon (RENAMED from `safeDivide`)
- `reciprocalSafe(value, epsilon?)` — returns 0 if |value| < epsilon (RENAMED from `safeReciprocal`)
- `logSafe(value, base?)` — returns -Infinity for <= 0 (RENAMED from `safeLog`)
- `powSafe(base, exponent)` — handles 0^0 = 1 (RENAMED from `safePow`)
- `lerpSafe(a, b, t)` — avoids overflow for large values (RENAMED from `safeLerp`)
- `sanitizeNumber(value, fallback?, min?, max?)` — validation + clamping (no rename needed)
- `ensureFinite(value, fallback?)` — returns fallback if not finite (no rename needed)
- `robustSum(values)` — Kahan summation (no rename needed)
- `neumaierSum(values)` — improved Kahan (no rename needed)
- `compensatedProduct(a, b)` — Veltkamp splitting (no rename needed)
- `MIN_SAFE_DIVISOR` constant (= EPSILON)

Re-exports from deterministic-kernels (already use correct suffix):

- `sqrtSafe` (from deterministic-kernels)
- `acosSafe` (from deterministic-kernels)
- `asinSafe` (from deterministic-kernels)

#### Scenario: divideSafe with near-zero denominator

- **WHEN** `divideSafe(10, 1e-15)` is called with default epsilon
- **THEN** it SHALL return `0`

#### Scenario: Old safeDivide name is deprecated re-export

- **WHEN** a consumer imports `safeDivide`
- **THEN** it SHALL work identically to `divideSafe` but produce a deprecation notice in documentation for one minor version

---

### Requirement: Numeric rounding functions

The `auxiliary/numeric/rounding.ts` module SHALL export:

- `roundToInt(value)` — banker's rounding (round half to even)
- `roundToPlaces(value, places)` — N decimal places
- `roundToMultiple(value, multiple)` — nearest multiple
- `roundToPowerOfTwo(value)` — nearest power of 2 (uses deterministic `log`)
- `snapToGrid(value, gridSize, offset?)` — snap with optional offset
- `fract(value)` — fractional part, always positive

No triality needed — rounding has no failure modes for finite input.

#### Scenario: roundToInt uses banker's rounding

- **WHEN** `roundToInt(2.5)` is called
- **THEN** it SHALL return `2` (round half to even)

#### Scenario: roundToInt rounds half to even

- **WHEN** `roundToInt(3.5)` is called
- **THEN** it SHALL return `4` (round half to even)

---

### Requirement: Numeric wrapping functions with triality

The `auxiliary/numeric/wrapping.ts` module SHALL export:

- `flooredMod(dividend, divisor)` / `flooredModSafe` / `flooredModUnchecked` — Python-style modulo

Full triality because divisor can be near-zero.

#### Scenario: flooredMod produces positive result for negative dividend

- **WHEN** `flooredMod(-1, 3)` is called
- **THEN** it SHALL return `2` (Python-style: always positive for positive divisor)

#### Scenario: flooredMod strict throws on near-zero divisor

- **WHEN** `flooredMod(5, 1e-15)` is called
- **THEN** it SHALL throw an Error
