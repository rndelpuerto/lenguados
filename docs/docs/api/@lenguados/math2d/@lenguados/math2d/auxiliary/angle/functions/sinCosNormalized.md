# Function: sinCosNormalized()

> **sinCosNormalized**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:118](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L118)

Computes sine and cosine of a normalized angle.
Normalizes the angle to [-π, π) before computing.

## Parameters

### angle

`number`

Angle in radians (will be normalized)

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties

## Example

```typescript
const { sin, cos } = sinCosNormalized(5 * Math.PI);
// Equivalent to sinCos(Math.PI)
```

## Since

1.0.0
