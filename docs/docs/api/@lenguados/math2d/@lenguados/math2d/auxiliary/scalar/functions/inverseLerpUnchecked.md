# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:126](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/interpolation.ts#L126)

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

0.7.0
