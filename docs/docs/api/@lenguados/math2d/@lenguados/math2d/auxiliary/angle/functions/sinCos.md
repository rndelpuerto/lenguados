# Function: sinCos()

> **sinCos**(`angle`): [`SinCos`](../interfaces/SinCos.md)

Computes sine and cosine of an angle simultaneously.
Uses deterministic math for cross-platform reproducibility.

## Parameters

### angle

`number`

Angle in radians

## Returns

[`SinCos`](../interfaces/SinCos.md)

Object with sin and cos properties

## Example

```typescript
const { sin, cos } = sinCos(Math.PI / 4);
// sin ≈ 0.7071, cos ≈ 0.7071
```

## Since

1.0.0
