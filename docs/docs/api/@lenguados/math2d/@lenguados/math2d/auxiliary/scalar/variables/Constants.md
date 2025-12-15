# Variable: Constants

> `const` **Constants**: `object`

Defined in: [src/auxiliary/scalar/constants.ts:271](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/constants.ts#L271)

Unified constants object for convenient access.

## Type Declaration

## Angular

#### HALF\_PI

> **HALF\_PI**: `number`

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

#### QUARTER\_PI

> **QUARTER\_PI**: `number`

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

#### DEG\_TO\_RAD

> **DEG\_TO\_RAD**: `number`

Conversion factor from degrees to radians.

##### Example

```typescript
const radians = degrees * DEG_TO_RAD;
```

##### Constant

##### Since

1.0.0

#### GRAD\_TO\_RAD

> **GRAD\_TO\_RAD**: `number`

Conversion factor from gradians to radians.

##### Remarks

Gradians (also called gon or grade) divide a right angle into 100 units.
400 gradians = 2π radians = 360 degrees.

##### Constant

##### Since

1.0.0

#### RAD\_TO\_DEG

> **RAD\_TO\_DEG**: `number`

Conversion factor from radians to degrees.

##### Example

```typescript
const degrees = radians * RAD_TO_DEG;
```

##### Constant

##### Since

1.0.0

#### RAD\_TO\_GRAD

> **RAD\_TO\_GRAD**: `number`

Conversion factor from radians to gradians.

##### Constant

##### Since

1.0.0

#### RAD\_TO\_TURN

> **RAD\_TO\_TURN**: `number`

Conversion factor from radians to turns (full rotations).

##### Example

```typescript
const turns = radians * RAD_TO_TURN;
// 2π radians = 1 turn
```

##### Constant

##### Since

1.0.0

#### TURN\_TO\_RAD

> **TURN\_TO\_RAD**: `number`

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

#### GOLDEN\_RATIO

> **GOLDEN\_RATIO**: `number`

Golden ratio φ (phi) ≈ 1.6180339887.

##### Remarks

φ = (1 + √5) / 2. Appears in art, architecture, and nature.
Has the property that φ² = φ + 1.

##### Constant

##### Since

1.0.0

#### LN\_10

> **LN\_10**: `number`

Natural logarithm of 10 ≈ 2.302585092994.

##### Constant

##### Since

1.0.0

#### LN\_2

> **LN\_2**: `number`

Natural logarithm of 2 ≈ 0.693147180559945.

##### Constant

##### Since

1.0.0

#### SQRT\_2

> **SQRT\_2**: `number`

Square root of 2 ≈ 1.41421356237.

##### Remarks

The diagonal of a unit square. Commonly used in 2D geometry.

##### Constant

##### Since

1.0.0

#### SQRT\_HALF

> **SQRT\_HALF**: `number`

Square root of 1/2 ≈ 0.707106781187.

##### Remarks

Equals 1/√2 = √2/2. Common in rotation calculations (45° sin/cos).

##### Constant

##### Since

1.0.0

## Numeric Limits

#### MAX\_SAFE\_INTEGER\_F64

> **MAX\_SAFE\_INTEGER\_F64**: `number`

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

#### EPSILON\_SQUARED

> **EPSILON\_SQUARED**: `number`

Square of epsilon for area/volume comparisons.

##### Remarks

When comparing areas or squared distances, use EPSILON_SQUARED
to maintain consistent tolerance behavior.

##### Constant

##### Since

1.0.0

## Example

```typescript
import { Constants } from '@lenguados/math2d';
const angle = degrees * Constants.DEG_TO_RAD;
```

## Constant

## Since

1.0.0
