# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:142](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/interpolation.ts#L142)

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
