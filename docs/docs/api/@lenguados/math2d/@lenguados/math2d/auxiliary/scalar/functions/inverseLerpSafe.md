# Function: inverseLerpSafe()

> **inverseLerpSafe**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:119](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/interpolation.ts#L119)

Inverse linear interpolation (safe).

## Parameters

### a

`number`

Start value

### b

`number`

End value

### value

`number`

Value to find t for

## Returns

`number`

Interpolation factor t, or 0 if range is degenerate

## Example

```typescript
inverseLerpSafe(0, 10, 5); // 0.5
inverseLerpSafe(5, 5, 3); // 0 (degenerate range)
```

## See

[inverseLerp](inverseLerp.md) — Throws for degenerate range

## Since

0.7.0
