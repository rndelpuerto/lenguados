# Variable: Constants

> `const` **Constants**: `object`

Defined in: [src/auxiliary/scalar/constants.ts:212](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/constants.ts#L212)

Unified constants object for convenient access.

## Type Declaration

## Angular

#### HALF_PI

> **HALF_PI**: `number`

Half of π ≈ 1.5707963267949 (90 degrees).

##### Constant

##### Since

0.5.0

#### PI

> **PI**: `number`

Mathematical constant π (pi) ≈ 3.14159265358979.

##### Constant

##### Since

0.5.0

#### QUARTER_PI

> **QUARTER_PI**: `number`

Quarter of π ≈ 0.785398163397448 (45 degrees).

##### Constant

##### Since

0.7.0

#### TAU

> **TAU**: `number`

Mathematical constant τ (tau) = 2π ≈ 6.28318530717959.

##### Remarks

Tau represents one full rotation in radians. Some consider it
more intuitive than π for angular calculations.

##### Constant

##### Since

0.5.0

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

0.5.0

#### RAD_TO_DEG

> **RAD_TO_DEG**: `number`

Conversion factor from radians to degrees.

##### Example

```typescript
const degrees = radians * RAD_TO_DEG;
```

##### Constant

##### Since

0.5.0

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

0.7.0

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

0.7.0

## Mathematical

#### LN_2

> **LN_2**: `number`

Natural logarithm of 2 ≈ 0.693147180559945.

##### Constant

##### Since

0.7.0

#### SQRT_2

> **SQRT_2**: `number`

Square root of 2 ≈ 1.41421356237.

##### Remarks

The diagonal of a unit square. Commonly used in 2D geometry.

##### Constant

##### Since

0.7.0

#### SQRT_HALF

> **SQRT_HALF**: `number`

Square root of 1/2 ≈ 0.707106781187.

##### Remarks

Equals 1/√2 = √2/2. Common in rotation calculations (45° sin/cos).

##### Constant

##### Since

0.7.0

## Numeric Limits

#### SMALLEST_NORMAL

> **SMALLEST_NORMAL**: `2.2250738585072014e-308`

Smallest positive normal number in IEEE 754 double precision.
Numbers smaller than this (but not zero) are denormal/subnormal.

##### Constant

##### Since

0.7.0

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

0.5.0

#### EPSILON_SQUARED

> **EPSILON_SQUARED**: `number`

Square of epsilon for area/volume comparisons.

##### Remarks

When comparing areas or squared distances, use EPSILON_SQUARED
to maintain consistent tolerance behavior.

##### Constant

##### Since

0.7.0

## Example

```typescript
import { Constants } from '@lenguados/math2d';
const angle = degrees * Constants.DEG_TO_RAD;
```

## Constant

## Since

0.7.0
