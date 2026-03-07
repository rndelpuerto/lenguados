## ADDED Requirements

### Requirement: Complex division overflow protection

Complex division (`Complex.divide`, `Complex.divideSafe`, `Complex.divideUnchecked` and their instance equivalents) SHALL use Smith's algorithm to avoid intermediate overflow in the denominator computation. The naive formula `denom = c*c + d*d` SHALL be replaced with a scaled formulation that branches on `|d| <= |c|` vs `|d| > |c|`:

- When `|d| <= |c|`: compute `r = d/c`, `denom = c + d*r`, result = `((a + b*r)/denom, (b - a*r)/denom)`
- When `|d| > |c|`: compute `r = c/d`, `denom = d + c*r`, result = `((a*r + b)/denom, (b*r - a)/denom)`

This eliminates squared terms entirely, preventing overflow for operands up to ~1e308 (the full IEEE 754 double range).

#### Scenario: Division with large components (overflow prevention)

- **GIVEN** `a = Complex(1, 0)` and `b = Complex(1e200, 1e200)`
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be approximately `Complex(5e-201, -5e-201)` (not `Complex(0, 0)` as the naive formula produces)

#### Scenario: Division with very small components (underflow prevention)

- **GIVEN** `a = Complex(1, 1)` and `b = Complex(1e-200, 1e-200)`
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be approximately `Complex(1e200, 0)` (not `Complex(Infinity, NaN)`)

#### Scenario: Division with mixed large/small components

- **GIVEN** `a = Complex(1e300, 1e-300)` and `b = Complex(1e300, 1e300)`
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be approximately `Complex(0.5, -0.5)` with relative error less than 4 ULP

#### Scenario: Normal-range division unchanged

- **GIVEN** `a = Complex(3, 4)` and `b = Complex(1, 2)`
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be `Complex(2.2, -0.4)` — identical to the naive formula result for normal-range inputs

#### Scenario: Division by near-zero (triality preserved)

- **GIVEN** `b = Complex(1e-320, 1e-320)` (near subnormal range)
- **WHEN** `Complex.divide(Complex(1, 0), b)` is called (strict variant)
- **THEN** the function SHALL throw `RangeError` (existing near-zero guard behavior preserved)

### Requirement: Complex division determinism

Complex division using Smith's algorithm SHALL produce bit-identical results across all JavaScript engines (V8, SpiderMonkey, JavaScriptCore) for the same inputs. The algorithm SHALL use only IEEE 754 basic operations (addition, subtraction, multiplication, division, comparison) and no engine-specific intrinsics.

#### Scenario: Cross-platform bit-exactness

- **GIVEN** inputs `a = Complex(1.7976931348623157e+308, 5e-324)` and `b = Complex(2.2250738585072014e-308, 1.7976931348623157e+308)`
- **WHEN** `Complex.divide(a, b)` is computed
- **THEN** the result SHALL be bit-identical on Node.js (V8), Firefox (SpiderMonkey), and Safari (JSC)

### Requirement: Complex division instance-static parity

All 6 division code paths SHALL use the same Smith's algorithm implementation. The instance methods `divide()`, `divideSafe()`, and `divideUnchecked()` SHALL delegate to (or inline) the same core algorithm used by their static counterparts.

#### Scenario: Instance method delegates to static algorithm

- **GIVEN** `z1 = new Complex(1e200, 1e200)` and `z2 = new Complex(1e200, -1e200)`
- **WHEN** `z1.divide(z2)` is called (instance) and `Complex.divide(z1copy, z2)` is called (static)
- **THEN** both results SHALL be bit-identical

### Requirement: Complex division Baudin-Smith pre-scaling guard

When either operand contains components whose magnitude is below `Number.MIN_VALUE * 2` (subnormal range), the algorithm SHALL apply a pre-scaling step to avoid underflow in the intermediate `r = d/c` computation. The pre-scaling factor SHALL be a power of 2 to avoid introducing rounding error.

#### Scenario: Pre-scaling prevents underflow

- **GIVEN** `a = Complex(5e-324, 5e-324)` and `b = Complex(5e-324, 0)`
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be approximately `Complex(1, 1)` (not `Complex(NaN, NaN)`)

### Requirement: Complex reciprocal threshold consistency

`Complex.reciprocal` SHALL check `isNearZero(magnitude)` against `EPSILON` on the **magnitude** (not on the squared magnitude `magSq`). The current check `isNearZero(magSq)` uses a linear threshold on a quadratic quantity, causing `reciprocal(Complex(1e-5, 0))` to throw even though the result `Complex(1e5, 0)` is perfectly valid.

#### Scenario: Reciprocal of small but valid complex number

- **GIVEN** `z = Complex(1e-5, 0)` (magnitude = 1e-5, which is above EPSILON = 1e-10)
- **WHEN** `Complex.reciprocal(z)` is called
- **THEN** the result SHALL be `Complex(1e5, 0)` (not throw RangeError)

#### Scenario: Reciprocal of truly near-zero complex number

- **GIVEN** `z = Complex(1e-11, 0)` (magnitude = 1e-11, below EPSILON)
- **WHEN** `Complex.reciprocal(z)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: Reciprocal safe variant for near-zero

- **GIVEN** `z = Complex(1e-11, 0)`
- **WHEN** `Complex.reciprocalSafe(z)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (safe fallback)
