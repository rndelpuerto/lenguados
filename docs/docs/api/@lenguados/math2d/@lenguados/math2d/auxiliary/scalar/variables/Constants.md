# Variable: Constants

> `const` **Constants**: `object`

Defined in: [src/auxiliary/scalar/constants.ts:302](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/constants.ts#L302)

Unified constants object for convenient access.

## Type Declaration

## Angular

#### ANGLE_EPSILON

> **ANGLE_EPSILON**: `1e-12`

Angle epsilon for near-zero angle comparisons.

##### Remarks

Used in DeterministicMath for detecting angles near zero
where special handling may be needed.

##### Constant

##### Since

0.13.0

#### HALF_PI

> **HALF_PI**: `number`

Half of π ≈ 1.5707963267949 (90 degrees).

##### Constant

##### Since

1.0.0

#### PI

> **PI**: `number`

Mathematical constant π (pi) ≈ 3.14159265358979.

##### Constant

##### Since

1.0.0

#### QUARTER_PI

> **QUARTER_PI**: `number`

Quarter of π ≈ 0.785398163397448 (45 degrees).

##### Constant

##### Since

1.0.0

#### TAU

> **TAU**: `number`

Mathematical constant τ (tau) = 2π ≈ 6.28318530717959.

##### Remarks

Tau represents one full rotation in radians. Some consider it
more intuitive than π for angular calculations.

##### Constant

##### Since

1.0.0

## Conversion

#### DEG_TO_RAD

> **DEG_TO_RAD**: `number`

Conversion factor from degrees to radians.

##### Example

```typescript
const radians = degrees * DEG_TO_RAD;
```

##### Constant

##### Since

1.0.0

#### GRAD_TO_RAD

> **GRAD_TO_RAD**: `number`

Conversion factor from gradians to radians.

##### Remarks

Gradians (also called gon or grade) divide a right angle into 100 units.
400 gradians = 2π radians = 360 degrees.

##### Constant

##### Since

1.0.0

#### RAD_TO_DEG

> **RAD_TO_DEG**: `number`

Conversion factor from radians to degrees.

##### Example

```typescript
const degrees = radians * RAD_TO_DEG;
```

##### Constant

##### Since

1.0.0

#### RAD_TO_GRAD

> **RAD_TO_GRAD**: `number`

Conversion factor from radians to gradians.

##### Constant

##### Since

1.0.0

#### RAD_TO_TURN

> **RAD_TO_TURN**: `number`

Conversion factor from radians to turns (full rotations).

##### Example

```typescript
const turns = radians * RAD_TO_TURN;
// 2π radians = 1 turn
```

##### Constant

##### Since

1.0.0

#### TURN_TO_RAD

> **TURN_TO_RAD**: `number`

Conversion factor from turns to radians.

##### Example

```typescript
const radians = turns * TURN_TO_RAD;
// 1 turn = 2π radians
```

##### Constant

##### Since

1.0.0

## Mathematical

#### E

> **E**: `number`

Euler's number e ≈ 2.718281828459045.

##### Remarks

Base of natural logarithms. Fundamental in calculus and exponential growth.

##### Constant

##### Since

1.0.0

#### GOLDEN_RATIO

> **GOLDEN_RATIO**: `number`

Golden ratio φ (phi) ≈ 1.6180339887.

##### Remarks

φ = (1 + √5) / 2. Appears in art, architecture, and nature.
Has the property that φ² = φ + 1.

##### Constant

##### Since

1.0.0

#### LN_10

> **LN_10**: `number`

Natural logarithm of 10 ≈ 2.302585092994.

##### Constant

##### Since

1.0.0

#### LN_2

> **LN_2**: `number`

Natural logarithm of 2 ≈ 0.693147180559945.

##### Constant

##### Since

1.0.0

#### SQRT_2

> **SQRT_2**: `number`

Square root of 2 ≈ 1.41421356237.

##### Remarks

The diagonal of a unit square. Commonly used in 2D geometry.

##### Constant

##### Since

1.0.0

#### SQRT_HALF

> **SQRT_HALF**: `number`

Square root of 1/2 ≈ 0.707106781187.

##### Remarks

Equals 1/√2 = √2/2. Common in rotation calculations (45° sin/cos).

##### Constant

##### Since

1.0.0

## Numeric Limits

#### MAX_SAFE_INTEGER_F64

> **MAX_SAFE_INTEGER_F64**: `number`

Maximum safe integer in float64 (2^53 - 1).

##### Remarks

Beyond this value, integer arithmetic becomes imprecise due to
IEEE 754 double precision limitations.

##### Constant

##### Since

1.0.0

## Tolerance

#### EPSILON

> **EPSILON**: `1e-10`

Default epsilon for floating-point comparisons.

##### Remarks

This value (1e-10) provides a good balance between:

- Precision: Can distinguish values differing by more than 1e-10
- Robustness: Absorbs typical floating-point rounding errors

For physics simulations, this is sufficient for most 2D calculations.
Consider using relative tolerance (relativeEquals) for values with
widely varying magnitudes.

##### Constant

##### Since

1.0.0

#### EPSILON_SQUARED

> **EPSILON_SQUARED**: `number`

Square of epsilon for area/volume comparisons.

##### Remarks

When comparing areas or squared distances, use EPSILON_SQUARED
to maintain consistent tolerance behavior.

##### Constant

##### Since

1.0.0

#### ITERATIVE_TOLERANCE

> **ITERATIVE_TOLERANCE**: `0.000001`

Tolerance for iterative angle algorithms.

##### Remarks

Used in iterative angle operations (like constraint solving) where
a looser tolerance than EPSILON is acceptable for convergence.
Value of 1e-6 provides good balance between precision and performance.

##### Constant

##### Since

0.14.0

## Example

```typescript
import { Constants } from '@lenguados/math2d';
const angle = degrees * Constants.DEG_TO_RAD;
```

## Constant

## Since

1.0.0
