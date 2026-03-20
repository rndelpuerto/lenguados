# Function: inverseLerpUnchecked()

> **inverseLerpUnchecked**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:141](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/interpolation.ts#L141)

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
