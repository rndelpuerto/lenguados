# Function: acos()

> **acos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:674](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L674)

Deterministic arccosine using atan2.

## Parameters

### x

`number`

Value in [-1, 1]

## Returns

`number`

acos(x) in [0, π]

## Remarks

Returns NaN for inputs outside [-1, 1]. Use [acosSafe](acosSafe.md) for automatic clamping.

## Example

```typescript
acos(1); // 0
acos(0); // ~1.5708 (π/2)
acos(-1); // ~3.1416 (π)
```

## See

[acosSafe](acosSafe.md) — Clamps input to [-1, 1]

## Since

0.8.0
