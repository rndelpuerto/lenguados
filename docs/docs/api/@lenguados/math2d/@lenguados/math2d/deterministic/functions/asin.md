# Function: asin()

> **asin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:702](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L702)

Deterministic arcsine using atan2.

## Parameters

### x

`number`

Value in [-1, 1]

## Returns

`number`

asin(x) in [-π/2, π/2]

## Remarks

Returns NaN for inputs outside [-1, 1]. Use [asinSafe](asinSafe.md) for automatic clamping.

## Example

```typescript
asin(0); // 0
asin(1); // ~1.5708 (π/2)
asin(-1); // ~-1.5708 (-π/2)
```

## See

[asinSafe](asinSafe.md) — Clamps input to [-1, 1]

## Since

0.8.0
