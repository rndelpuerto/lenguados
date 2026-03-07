# Function: sinCosNormalized()

> **sinCosNormalized**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:89](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/operations.ts#L89)

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

0.7.0
