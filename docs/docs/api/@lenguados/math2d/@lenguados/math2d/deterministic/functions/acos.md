# Function: acos()

> **acos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:679](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L679)

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
