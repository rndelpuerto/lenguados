# Function: cos()

> **cos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:397](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L397)

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

0.8.0
