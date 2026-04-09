# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:143](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/interpolation.ts#L143)

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
