# Function: cos()

> **cos**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:402](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L402)

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
