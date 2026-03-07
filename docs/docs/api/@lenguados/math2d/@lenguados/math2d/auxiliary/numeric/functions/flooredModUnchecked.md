# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:83](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/wrapping.ts#L83)

Floored modulo (unchecked).

## Parameters

### dividend

`number`

Value to divide.

### divisor

`number`

Divisor (must not be zero).

## Returns

`number`

Floored remainder.

## Remarks

**⚠️ Precondition:** divisor !== 0. Zero divisor produces NaN.

## Since

0.7.0
