# Function: sin()

> **sin**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:363](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L363)

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
