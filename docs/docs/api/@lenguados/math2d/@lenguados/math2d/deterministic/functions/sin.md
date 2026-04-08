# Function: sin()

> **sin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:361](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L361)

Deterministic sine function.

## Parameters

### x

`number`

Angle in radians

## Returns

`number`

sin(x) with ~15 digit precision

## Remarks

Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
Completely deterministic: no Math.sin dependency.

## Example

```typescript
sin(0); // 0
sin(PI / 2); // 1
sin(PI); // ~0 (very small due to range reduction)
```

## Since

0.7.0
