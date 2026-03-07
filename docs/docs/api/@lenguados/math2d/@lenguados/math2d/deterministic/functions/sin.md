# Function: sin()

> **sin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:399](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L399)

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

0.8.0
