# Function: pow()

> **pow**(`base`, `exponent`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:904](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L904)

Deterministic power function.

## Parameters

### base

`number`

Base value

### exponent

`number`

Exponent value

## Returns

`number`

base^exponent

## Remarks

For integer exponents, uses exponentiation by squaring.
For non-integer exponents, uses deterministic exp(exponent \* log(base)).
Fully L0 deterministic with no Math.pow dependency.

## Since

0.8.0
