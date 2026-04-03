# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:142](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/interpolation.ts#L142)

Inverse linear interpolation (unchecked).

## Parameters

### a

`number`

Start value

### b

`number`

End value (must != a)

### value

`number`

Value to find t for

## Returns

`number`

Interpolation factor t

## Remarks

**Precondition:** a !== b.

## See

- [inverseLerp](inverseLerp.md) — Throws for degenerate range
- [inverseLerpSafe](inverseLerpSafe.md) — Returns 0 if range is degenerate

## Since

0.7.0
