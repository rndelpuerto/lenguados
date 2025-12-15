# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:83](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L83)

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

0.14.0
