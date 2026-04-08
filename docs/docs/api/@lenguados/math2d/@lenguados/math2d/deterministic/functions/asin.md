# Function: asin()

> **asin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:707](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L707)

Deterministic arcsine using atan2.

## Parameters

### x

`number`

Value in [-1, 1]

## Returns

`number`

asin(x) in [-π/2, π/2]

## Remarks

Returns NaN for inputs outside [-1, 1]. Use asinSafe for automatic clamping.

## Example

```typescript
asin(0); // 0
asin(1); // ~1.5708 (π/2)
asin(-1); // ~-1.5708 (-π/2)
```

## See

asinSafe — Clamps input to [-1, 1]

## Since

0.7.0
