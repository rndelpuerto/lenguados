# Function: inverseLerpSafe()

> **inverseLerpSafe**(`a`, `b`, `value`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:119](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/interpolation.ts#L119)

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
