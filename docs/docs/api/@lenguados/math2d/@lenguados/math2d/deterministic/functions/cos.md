# Function: cos()

> **cos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:404](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L404)

Deterministic cosine function.

## Parameters

### x

`number`

Angle in radians

## Returns

`number`

cos(x) with ~15 digit precision

## Remarks

Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
Completely deterministic: no Math.cos dependency.

## Example

```typescript
cos(0); // 1
cos(PI / 2); // ~0
cos(PI); // -1
```

## Since

0.7.0
