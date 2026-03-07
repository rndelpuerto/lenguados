## ADDED Requirements

### Requirement: Zero-vector geometric predicates SHALL NOT produce false positives

`Vector2.isParallel` and `Vector2.isPerpendicular` SHALL guard against zero-vector inputs. The zero vector has no direction and is mathematically neither parallel nor perpendicular to any vector. Currently both predicates return `true` simultaneously for `(ZERO, v)`, which is a logical contradiction.

#### Scenario: isParallel with zero vector returns false

- **WHEN** `Vector2.isParallel(Vector2.ZERO, {x: 1, y: 0})` is called
- **THEN** the result SHALL be `false`

#### Scenario: isPerpendicular with zero vector returns false

- **WHEN** `Vector2.isPerpendicular(Vector2.ZERO, {x: 1, y: 0})` is called
- **THEN** the result SHALL be `false`

#### Scenario: isParallel with both vectors zero returns false

- **WHEN** `Vector2.isParallel(Vector2.ZERO, Vector2.ZERO)` is called
- **THEN** the result SHALL be `false`

#### Scenario: isPerpendicular with second argument zero returns false

- **WHEN** `Vector2.isPerpendicular({x: 3, y: 4}, Vector2.ZERO)` is called
- **THEN** the result SHALL be `false`

### Requirement: Scalar clamping functions SHALL have explicit NaN behavior tests

The `clamp`, `lerpClamped`, and `clampAngle` functions produce results "by accident" when given NaN arguments because IEEE 754 comparisons with NaN are always false. These behaviors SHALL be documented with explicit tests to prevent accidental regressions.

#### Scenario: clamp with NaN minimum passes value through unclamped

- **WHEN** `clamp(5, NaN, 10)` is called
- **THEN** the result SHALL be `5` (NaN comparisons are false, so both `value < min` and `value > max` are false)

#### Scenario: clamp with NaN maximum passes value through unclamped

- **WHEN** `clamp(15, 0, NaN)` is called
- **THEN** the result SHALL be `15` (the `value > max` comparison is false because NaN comparisons are false)

#### Scenario: clamp with inverted range returns min

- **WHEN** `clamp(5, 10, 0)` is called (min > max)
- **THEN** the result SHALL be `10` (the `value < min` branch fires, returning `min`)

#### Scenario: lerpClamped with NaN t falls through clamping

- **WHEN** `lerpClamped(0, 10, NaN)` is called
- **THEN** the result SHALL be `NaN` (NaN falls through both `t < 0` and `t > 1` guards)

### Requirement: Sign and step functions SHALL have explicit NaN and negative-zero tests

The `sign` and `step` functions suppress NaN propagation and lose negative zero sign information. These behaviors SHALL be tested explicitly.

#### Scenario: sign of NaN returns 0

- **WHEN** `sign(NaN)` is called
- **THEN** the result SHALL be `0` (NaN fails both `> 0` and `< 0` comparisons)

#### Scenario: sign of negative zero returns 0

- **WHEN** `sign(-0)` is called
- **THEN** the result SHALL be `0` (loses negative zero sign; documented behavior)

#### Scenario: step with NaN edge returns 1

- **WHEN** `step(NaN, 5)` is called
- **THEN** the result SHALL be `1` (NaN fails the `x < edge` comparison, so the else branch returns 1)

#### Scenario: step with NaN value returns 1

- **WHEN** `step(5, NaN)` is called
- **THEN** the result SHALL be `1` (NaN fails the `x < edge` comparison)

### Requirement: Comparison and range functions SHALL have explicit NaN behavior tests

Functions that perform range or comparison checks using IEEE 754 operators produce false for all NaN comparisons. These behaviors SHALL be explicitly tested to document the contract.

#### Scenario: lessThan with NaN returns false

- **WHEN** `lessThan(NaN, 5)` is called
- **THEN** the result SHALL be `false`

#### Scenario: greaterThan with NaN returns false

- **WHEN** `greaterThan(NaN, 5)` is called
- **THEN** the result SHALL be `false`

#### Scenario: inRange with NaN value returns false

- **WHEN** `inRange(NaN, 0, 1)` is called
- **THEN** the result SHALL be `false`

#### Scenario: inRange with min greater than max always returns false

- **WHEN** `inRange(5, 10, 0)` is called (min > max)
- **THEN** the result SHALL be `false`

#### Scenario: anglesNearEqual with NaN returns false

- **WHEN** `anglesNearEqual(NaN, 0)` is called
- **THEN** the result SHALL be `false`

### Requirement: Loop and modular arithmetic SHALL have explicit non-finite tests

The `loop`, `flooredMod`, and `fract` functions produce NaN for specific non-finite inputs. These behaviors SHALL be explicitly tested.

#### Scenario: loop with Infinity value returns NaN

- **WHEN** `loop(Infinity, 0, 10)` is called
- **THEN** the result SHALL be `NaN` (modular arithmetic with infinity is undefined)

#### Scenario: flooredMod with NaN dividend returns NaN

- **WHEN** `flooredMod(NaN, 3)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: flooredMod with Infinity dividend returns NaN

- **WHEN** `flooredMod(Infinity, 3)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: fract with NaN returns NaN

- **WHEN** `fract(NaN)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: fract with Infinity returns NaN

- **WHEN** `fract(Infinity)` is called
- **THEN** the result SHALL be `NaN`

### Requirement: Validation assertions SHALL have explicit NaN boundary tests

`assertRange` uses comparison operators that produce false for NaN, causing NaN to silently pass range checks. This behavior SHALL be explicitly tested and documented.

#### Scenario: assertRange does NOT throw for NaN value

- **WHEN** `assertRange(NaN, 0, 1)` is called
- **THEN** the function SHALL NOT throw (NaN fails both `value < min` and `value > max`, so neither guard triggers)

### Requirement: Deterministic kernel edge cases SHALL be tested for NaN passthrough

The deterministic `acos` and `asin` functions return NaN for NaN input by accident (the input falls through all guards). These fragile paths SHALL be explicitly tested.

#### Scenario: acos with NaN input returns NaN

- **WHEN** `acos(NaN)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: asin with NaN input returns NaN

- **WHEN** `asin(NaN)` is called
- **THEN** the result SHALL be `NaN`

### Requirement: Rounding and snapping functions SHALL have overflow and non-finite parameter tests

Rounding functions that compute intermediate values using exponentiation can overflow for extreme parameters. These behaviors SHALL be explicitly tested.

#### Scenario: roundToPlaces with extreme decimal places returns NaN

- **WHEN** `roundToPlaces(3.14, 400)` is called
- **THEN** the result SHALL be `NaN` (because `10^400 = Infinity`, and `Math.round(x * Infinity)` is NaN)

#### Scenario: roundToPowerOfTwo with Infinity returns Infinity

- **WHEN** `roundToPowerOfTwo(Infinity)` is called
- **THEN** the result SHALL be `Infinity`

#### Scenario: roundToPowerOfTwo with NaN returns NaN

- **WHEN** `roundToPowerOfTwo(NaN)` is called
- **THEN** the result SHALL be `NaN`

#### Scenario: snapToGrid with NaN grid size returns NaN

- **WHEN** `snapToGrid(5, NaN)` is called
- **THEN** the result SHALL be `NaN`

### Requirement: smoothStep degenerate range SHALL degrade to Heaviside step

When `smoothStep` is called with `edge0 === edge1`, the interpolation range collapses to zero width. The function SHALL degrade to a Heaviside step function (returning 0 for values below the edge, 1 for values at or above).

#### Scenario: smoothStep with equal edges below threshold

- **WHEN** `smoothStep(5, 5, 3)` is called (edge0 === edge1, x < edge)
- **THEN** the result SHALL be `0`

#### Scenario: smoothStep with equal edges at threshold

- **WHEN** `smoothStep(5, 5, 5)` is called (edge0 === edge1, x === edge)
- **THEN** the result SHALL be `1`

#### Scenario: smoothStep with equal edges above threshold

- **WHEN** `smoothStep(5, 5, 8)` is called (edge0 === edge1, x > edge)
- **THEN** the result SHALL be `1`

### Requirement: Negative zero behaviors in core types SHALL be explicitly tested

Negative zero (`-0`) is a valid IEEE 754 value that loses its sign in several operations. These behaviors SHALL be explicitly tested.

#### Scenario: Complex.toString with negative zero imaginary shows positive zero

- **WHEN** `Complex.toString(Complex.create(1, -0))` is called
- **THEN** the result SHALL be `"1.0000 + 0.0000i"` (the formatting loses the negative zero sign)

#### Scenario: Interval.scale with negative zero goes through non-negative branch

- **WHEN** `Interval.scale(Interval.create(2, 5), -0)` is called
- **THEN** the result SHALL go through the `scalar >= 0` branch (because `-0 >= 0` is true in IEEE 754), producing `Interval(min * -0, max * -0)` which is `Interval(-0, -0)` or `Interval(0, 0)` depending on sign handling

### Requirement: Complex.exp overflow SHALL be tested for extreme real parts

`Complex.exp` computes `e^real * cos(imag) + i * e^real * sin(imag)`. When `real` is large enough that `e^real = Infinity`, the imaginary part becomes `Infinity * sin(imag)`. When `imag = 0`, this produces `Infinity * 0 = NaN`.

#### Scenario: Complex.exp with large real and zero imaginary produces Infinity and NaN

- **WHEN** `Complex.exp(Complex.create(710, 0))` is called
- **THEN** the real part SHALL be `Infinity` (from `e^710 * cos(0) = Infinity * 1`)
- **AND** the imaginary part SHALL be `NaN` (from `e^710 * sin(0) = Infinity * 0 = NaN`)

### Requirement: Type guard functions SHALL accept NaN-valued numeric fields

The `isVector2Like`, `isComplex`, `isRotation2Like`, and related type guard functions check for the presence and `typeof` of numeric fields. They do NOT validate that the field values are finite. Objects with NaN-valued fields SHALL pass the type guard.

#### Scenario: isVector2Like accepts NaN coordinates

- **WHEN** `isVector2Like({x: NaN, y: NaN})` is called
- **THEN** the result SHALL be `true` (NaN is `typeof "number"`, which satisfies the guard)

#### Scenario: isComplexLike accepts NaN components

- **WHEN** `isComplexLike({real: NaN, imag: NaN})` is called
- **THEN** the result SHALL be `true`

#### Scenario: isRotation2Like accepts NaN fields

- **WHEN** `isRotation2Like({cos: NaN, sin: NaN})` is called
- **THEN** the result SHALL be `true`

#### Scenario: isMatrix2Like accepts NaN elements

- **WHEN** `isMatrix2Like({m00: NaN, m01: NaN, m10: NaN, m11: NaN})` is called
- **THEN** the result SHALL be `true`
