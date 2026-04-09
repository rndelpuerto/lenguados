# Function: acos()

> **acos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:681](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L681)

Deterministic arccosine using atan2.

## Parameters

### x

`number`

Value in [-1, 1]

## Returns

`number`

acos(x) in [0, π]

## Remarks

Returns NaN for inputs outside [-1, 1]. Use acosSafe for automatic clamping.

## Example

```typescript
acos(1); // 0
acos(0); // ~1.5708 (π/2)
acos(-1); // ~3.1416 (π)
```

## See

acosSafe — Clamps input to [-1, 1]

## Since

0.7.0
