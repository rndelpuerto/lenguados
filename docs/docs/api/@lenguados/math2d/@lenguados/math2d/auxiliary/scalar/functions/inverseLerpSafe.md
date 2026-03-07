# Function: inverseLerpSafe()

> **inverseLerpSafe**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:107](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/interpolation.ts#L107)

Inverse linear interpolation (safe).

## Parameters

### a

`number`

Start value.

### b

`number`

End value.

### value

`number`

Value to find t for.

## Returns

`number`

Interpolation factor t, or 0 if range is degenerate.

## Since

0.7.0
