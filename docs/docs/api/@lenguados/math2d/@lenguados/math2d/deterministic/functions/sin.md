# Function: sin()

> **sin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:336](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L336)

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
