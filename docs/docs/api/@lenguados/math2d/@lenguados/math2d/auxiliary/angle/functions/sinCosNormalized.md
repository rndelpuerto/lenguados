# Function: sinCosNormalized()

> **sinCosNormalized**(`angle`, `out?`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:83](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/operations.ts#L83)

Computes sine and cosine of a normalized angle.
Normalizes the angle to [-π, π) before computing.

## Parameters

### angle

`number`

Angle in radians (will be normalized)

### out?

[`SinCos`](../interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties

## Remarks

Uses deterministic math (`sin`, `cos` from deterministic-kernels).

## Example

```typescript
const { sin, cos } = sinCosNormalized(5 * Math.PI);
// Equivalent to sinCos(Math.PI)
```

## Since

0.7.0
