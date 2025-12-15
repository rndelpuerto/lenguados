# Function: sinCos()

> **sinCos**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:62](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L62)

Computes sine and cosine of an angle simultaneously.
Uses deterministic math for cross-platform reproducibility.

## Parameters

### angle

`number`

Angle in radians

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties

## Remarks

Creates a new object on each call. For hot paths where allocation
must be avoided, use [sinCosInto](sinCosInto.md) with a reusable object.

## Example

```typescript
const { sin, cos } = sinCos(Math.PI / 4);
// sin ≈ 0.7071, cos ≈ 0.7071
```

## See

[sinCosInto](sinCosInto.md) for zero-allocation variant

## Since

1.0.0
