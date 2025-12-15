# Function: sinCos()

> **sinCos**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:61](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L61)

Computes sine and cosine of an angle simultaneously.
Uses deterministic math for cross-platform reproducibility.

## Parameters

### angle

`number`

Angle in radians.

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties.

## Remarks

Creates a new object on each call. For hot paths where allocation
must be avoided, use [sinCosInto](sinCosInto.md) with a reusable object.

## Example

```typescript
const { sin, cos } = sinCos(Math.PI / 4);
// sin ≈ 0.7071, cos ≈ 0.7071
```

## See

[sinCosInto](sinCosInto.md) for zero-allocation variant.

## Since

1.0.0
