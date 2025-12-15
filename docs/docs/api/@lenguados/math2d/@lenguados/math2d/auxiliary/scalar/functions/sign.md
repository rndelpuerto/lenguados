# Function: sign()

> **sign**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:43](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L43)

Returns the sign of a number (-1, 0, or 1).
More robust than Math.sign for special cases.

## Parameters

### value

`number`

Input number

## Returns

`number`

Sign of x

## Remarks

Handles special cases:
- Returns 0 for both +0 and -0
- Returns 0 for NaN (unlike Math.sign which returns NaN)

## Since

1.0.0
