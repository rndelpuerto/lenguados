# Function: sinCosNormalized()

> **sinCosNormalized**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:117](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L117)

Computes sine and cosine of a normalized angle.
Normalizes the angle to [-π, π) before computing.

## Parameters

### angle

`number`

Angle in radians (will be normalized).

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties.

## Example

```typescript
const { sin, cos } = sinCosNormalized(5 * Math.PI);
// Equivalent to sinCos(Math.PI)
```

## Since

1.0.0
