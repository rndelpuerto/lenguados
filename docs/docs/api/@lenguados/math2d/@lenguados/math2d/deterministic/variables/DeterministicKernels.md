# Variable: DeterministicKernels

> `const` **DeterministicKernels**: `object`

Defined in: [src/deterministic/deterministic-kernels.ts:952](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L952)

Deterministic math kernels for L0 cross-platform consistency.

## Type Declaration

## Arithmetic

#### exp()

> **exp**: (`x`) => `number`

Deterministic exponential function using fdlibm algorithm.

##### Parameters

###### x

`number`

Exponent value

##### Returns

`number`

e^x

##### Remarks

Uses range reduction x = k\*ln(2) + r where |r| <= ln(2)/2,
then polynomial approximation for exp(r).
Completely deterministic: no Math.exp dependency.

##### Example

```typescript
exp(0); // 1
exp(1); // 2.718281828...
exp(-Infinity); // 0
exp(Infinity); // Infinity
```

##### Since

0.9.0

#### expSafe()

> **expSafe**: (`x`) => `number`

Safe exponential function (handles extreme values gracefully).

##### Parameters

###### x

`number`

Exponent value

##### Returns

`number`

e^x, clamped to finite range

##### Since

0.9.0

#### log()

> **log**: (`x`) => `number`

Deterministic natural logarithm using fdlibm algorithm.

##### Parameters

###### x

`number`

Value to compute logarithm of (must be positive)

##### Returns

`number`

ln(x), NaN for x <= 0

##### Remarks

Uses range reduction x = 2^k \* (1+f) where sqrt(2)/2 < 1+f < sqrt(2),
then polynomial approximation for log(1+f).
Completely deterministic: no Math.log dependency.

##### Example

```typescript
log(1); // 0
log(Math.E); // 1
log(10); // 2.302585...
log(-1); // NaN
```

##### Since

0.9.0

#### logSafe()

> **logSafe**: (`x`) => `number`

Safe natural logarithm (returns 0 for non-positive values).

##### Parameters

###### x

`number`

Value to compute logarithm of

##### Returns

`number`

ln(x) for x > 0, 0 otherwise

##### Since

0.9.0

#### pow()

> **pow**: (`base`, `exponent`) => `number`

Deterministic power function.

##### Parameters

###### base

`number`

Base value

###### exponent

`number`

Exponent value

##### Returns

`number`

base^exponent

##### Remarks

For integer exponents, uses exponentiation by squaring.
For non-integer exponents, uses deterministic exp(exponent \* log(base)).
Fully L0 deterministic with no Math.pow dependency.

##### Since

0.8.0

#### sqrt()

> **sqrt**: (`x`) => `number`

Deterministic square root using IEEE 754 exponent extraction
and Newton-Raphson iteration.

##### Parameters

###### x

`number`

Value to compute square root of

##### Returns

`number`

Square root of x, NaN for negative values, handles Infinity correctly

##### Remarks

Uses IEEE 754 exponent extraction for a good initial guess, then refines
with Newton-Raphson iterations. This achieves full double precision (~15 digits)
with deterministic cross-platform behavior.

**Algorithm**: Based on fdlibm (Sun Microsystems)

1. Extract exponent from IEEE 754 representation
2. Initial guess: 2^(exponent/2)
3. Newton-Raphson: y\_{n+1} = (y_n + x/y_n) / 2

##### Example

```typescript
sqrt(4); // 2
sqrt(2); // 1.4142135623730951
sqrt(1e10); // 100000 (fixed!)
sqrt(-1); // NaN
sqrt(Infinity); // Infinity
```

##### Since

0.8.0

#### sqrtSafe()

> **sqrtSafe**: (`x`) => `number`

Safe deterministic square root (clamps negative values to 0).

##### Parameters

###### x

`number`

Value to compute square root of

##### Returns

`number`

Square root of x, or 0 for negative values

##### Since

0.8.0

## Trigonometry

#### acos()

> **acos**: (`x`) => `number`

Deterministic arccosine using atan2.

##### Parameters

###### x

`number`

Value in [-1, 1]

##### Returns

`number`

acos(x) in [0, π]

##### Since

0.8.0

#### acosSafe()

> **acosSafe**: (`x`) => `number`

Safe arccosine that clamps input to [-1, 1].

##### Parameters

###### x

`number`

Any value (will be clamped)

##### Returns

`number`

acos(clamp(x, -1, 1))

##### Since

0.8.0

#### asin()

> **asin**: (`x`) => `number`

Deterministic arcsine using atan2.

##### Parameters

###### x

`number`

Value in [-1, 1]

##### Returns

`number`

asin(x) in [-π/2, π/2]

##### Since

0.8.0

#### asinSafe()

> **asinSafe**: (`x`) => `number`

Safe arcsine that clamps input to [-1, 1].

##### Parameters

###### x

`number`

Any value (will be clamped)

##### Returns

`number`

asin(clamp(x, -1, 1))

##### Since

0.8.0

#### atan()

> **atan**: (`x`) => `number`

Deterministic arctangent function.

##### Parameters

###### x

`number`

Any real number

##### Returns

`number`

atan(x) in [-π/2, π/2]

##### Since

0.8.0

#### atan2()

> **atan2**: (`y`, `x`) => `number`

Deterministic two-argument arctangent.

##### Parameters

###### y

`number`

Y coordinate

###### x

`number`

X coordinate

##### Returns

`number`

Angle in [-π, π] from positive X axis to point (x, y)

##### Remarks

This is the most important function for 2D geometry as it gives the angle
of a vector. Uses pure arithmetic via atan() and quadrant logic.

##### Example

```typescript
atan2(0, 1); // 0 (positive X axis)
atan2(1, 0); // π/2 (positive Y axis)
atan2(0, -1); // π (negative X axis)
atan2(-1, 0); // -π/2 (negative Y axis)
```

##### Since

0.8.0

#### cos()

> **cos**: (`x`) => `number`

Deterministic cosine function.

##### Parameters

###### x

`number`

Angle in radians

##### Returns

`number`

cos(x) with ~15 digit precision

##### Remarks

Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
Completely deterministic: no Math.cos dependency.

##### Example

```typescript
cos(0); // 1
cos(PI / 2); // ~0
cos(PI); // -1
```

##### Since

0.8.0

#### sin()

> **sin**: (`x`) => `number`

Deterministic sine function.

##### Parameters

###### x

`number`

Angle in radians

##### Returns

`number`

sin(x) with ~15 digit precision

##### Remarks

Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
Completely deterministic: no Math.sin dependency.

##### Example

```typescript
sin(0); // 0
sin(PI / 2); // 1
sin(PI); // ~0 (very small due to range reduction)
```

##### Since

0.8.0

#### sinCos()

> **sinCos**: (`x`) => `object`

Compute sin and cos simultaneously (more efficient than separate calls).

##### Parameters

###### x

`number`

Angle in radians

##### Returns

`object`

Object with sin and cos values

###### cos

> **cos**: `number`

###### sin

> **sin**: `number`

##### Since

0.8.0

#### tan()

> **tan**: (`x`) => `number`

Deterministic tangent function.

##### Parameters

###### x

`number`

Angle in radians

##### Returns

`number`

tan(x) = sin(x) / cos(x)

##### Since

0.8.0

## Remarks

Contains ONLY functions that are not deterministic in native JavaScript:

- Trigonometric: sin, cos, tan, atan, atan2, acos, asin
- Square root: sqrt
- Power: pow (for non-integer exponents)

For deterministic floor/ceil/abs/sign, use Math.\* directly (IEEE 754 guarantees).

## Since

0.8.0
