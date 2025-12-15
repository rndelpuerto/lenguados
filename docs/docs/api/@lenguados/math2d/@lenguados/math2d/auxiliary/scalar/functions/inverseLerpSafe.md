# Function: inverseLerpSafe()

> **inverseLerpSafe**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:107](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/interpolation.ts#L107)

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

0.13.0
