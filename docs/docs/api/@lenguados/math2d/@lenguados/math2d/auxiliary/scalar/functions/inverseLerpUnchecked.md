# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:126](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/interpolation.ts#L126)

Inverse linear interpolation (unchecked).

## Parameters

### a

`number`

Start value.

### b

`number`

End value (must != a).

### value

`number`

Value to find t for.

## Returns

`number`

Interpolation factor t.

## Remarks

**⚠️ Precondition:** a !== b.

## Since

0.13.0
