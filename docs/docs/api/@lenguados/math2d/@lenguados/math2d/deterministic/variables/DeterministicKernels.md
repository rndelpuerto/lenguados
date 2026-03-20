# Variable: DeterministicKernels

> `const` **DeterministicKernels**: `object`

Defined in: [src/deterministic/deterministic-kernels.ts:961](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L961)

Deterministic math kernels for L0 cross-platform consistency.

## Type Declaration

## Arithmetic

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

##### Remarks

Returns NaN for inputs outside [-1, 1]. Use [acosSafe](../functions/acosSafe.md) for automatic clamping.

##### Example

```typescript
acos(1); // 0
acos(0); // ~1.5708 (π/2)
acos(-1); // ~3.1416 (π)
```

##### See

[acosSafe](../functions/acosSafe.md) — Clamps input to [-1, 1]

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

##### See

[acos](../functions/acos.md) — Returns NaN for out-of-range inputs

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

##### Remarks

Returns NaN for inputs outside [-1, 1]. Use [asinSafe](../functions/asinSafe.md) for automatic clamping.

##### Example

```typescript
asin(0); // 0
asin(1); // ~1.5708 (π/2)
asin(-1); // ~-1.5708 (-π/2)
```

##### See

[asinSafe](../functions/asinSafe.md) — Clamps input to [-1, 1]

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

##### See

[asin](../functions/asin.md) — Returns NaN for out-of-range inputs

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

##### Example

```typescript
atan(0); // 0
atan(1); // ~0.7854 (π/4)
atan(Infinity); // ~1.5708 (π/2)
```

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

#### hypot()

> **hypot**: (`x`, `y`) => `number`

Deterministic hypotenuse: sqrt(x² + y²) without intermediate overflow.

##### Parameters

###### x

`number`

First value

###### y

`number`

Second value

##### Returns

`number`

sqrt(x² + y²) computed safely

##### Remarks

**Problem solved:** The naive formula `sqrt(x*x + y*y)` overflows to Infinity
when `x` or `y` > ~1e154, even though the result is representable.

**Algorithm:** Uses the identity `sqrt(x² + y²) = max * sqrt(1 + (min/max)²)`
which avoids intermediate overflow since `min/max` is always in `[0, 1]`.

**Performance:** ~17% faster than Math.hypot in benchmarks.

##### Example

```typescript
hypot(3, 4); // 5
hypot(1e200, 1e200); // 1.414e200 (not Infinity!)
hypot(0, 5); // 5
hypot(Infinity, 5); // Infinity
```

##### See

[https://www.netlib.org/fdlibm/e_hypot.c](https://www.netlib.org/fdlibm/e_hypot.c) - fdlibm hypot source

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

##### Example

```typescript
pow(2, 10); // 1024
pow(9, 0.5); // 3 (square root)
pow(2, -1); // 0.5
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

> **sinCos**: (`x`, `out?`) => [`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Compute sin and cos simultaneously (more efficient than separate calls).

##### Parameters

###### x

`number`

Angle in radians

###### out?

[`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

##### Returns

[`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Object with sin and cos values

##### Remarks

Range reduction uses Cody-Waite two-step subtraction with 106-bit extended
precision for PI/2 (PIO2_HI + PIO2_LO). For `|x| > 2^20·PI` (~3.3e6 radians),
the reduction error may exceed 1 ULP, causing gradual precision degradation.
Typical 2D physics simulations operate well within this bound.

##### Example

```typescript
const result = sinCos(PI / 4);
// result.sin ≈ 0.7071, result.cos ≈ 0.7071
```

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

##### Example

```typescript
tan(0); // 0
tan(PI / 4); // ~1
```

##### Since

0.8.0

## Configuration

#### config

> **config**: `object`

Global configuration for deterministic math execution.

##### Remarks

By default, this module uses `fdlibm` bit-exact polynomial algorithms
(L0 Determinism) for perfect network lockstep sync across browsers/CPUs.
However, this is significantly slower than native assembly floats.

Set `config.useNativeMath = true` to bypass deterministic kernels and use
native `Math.*` functions instead, recovering maximum CPU performance for
single-player or non-networked scenarios.

**Global mutability**: This object is a shared mutable singleton. Changing
`useNativeMath` affects ALL subsequent calls to deterministic functions
across the entire application. There is no per-context or per-thread
isolation — JavaScript is single-threaded, but Web Workers each get their
own module instance and thus their own `config`.

**Recommendation**: Set `config.useNativeMath` once at application startup,
before any math computation begins. Toggling it mid-computation may produce
inconsistent results if earlier computations used different kernels.

##### Example

```typescript
import { config } from '@lenguados/math2d/deterministic';

// Disable determinism, run native C-level floats on local CPU
config.useNativeMath = true;
```

##### Since

0.8.0

##### config.useNativeMath

> **useNativeMath**: `boolean` = `false`

## Other

#### logKernelSafe()

> **logKernelSafe**: (`x`) => `number`

**`Internal`**

Kernel-level safe natural logarithm (returns 0 for non-positive values).

##### Parameters

###### x

`number`

Value to compute logarithm of

##### Returns

`number`

ln(x) for x > 0, 0 otherwise

##### Remarks

This is the kernel-level safe variant (single-argument, no base support).
The public API `logSafe` in `auxiliary/numeric/safety` adds custom base
support and delegates to this kernel. Both return 0 for non-positive input.
Not exported from the main index to avoid naming collisions with the
richer public variant.

## Remarks

Contains ONLY functions that are not deterministic in native JavaScript:

- Trigonometric: sin, cos, tan, atan, atan2, acos, asin
- Power: pow (for non-integer exponents)
- Hypotenuse: hypot

`Math.sqrt`, `Math.floor`, `Math.ceil`, `Math.abs` are IEEE 754 required
operations and should be used directly — they are deterministic.

## Since

0.8.0
