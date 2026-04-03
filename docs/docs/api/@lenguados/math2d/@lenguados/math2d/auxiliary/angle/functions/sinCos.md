# Function: sinCos()

> **sinCos**(`angle`, `out?`): [`SinCos`](../../../types/interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:44](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/angle/operations.ts#L44)

Computes sine and cosine of an angle simultaneously.
Uses deterministic math for cross-platform reproducibility.

## Parameters

### angle

`number`

Angle in radians

### out?

[`SinCos`](../../../types/interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

## Returns

[`SinCos`](../../../types/interfaces/SinCos.md)

Object with sin and cos properties

## Remarks

When `out` is provided, writes directly to it (zero-allocation for hot paths).
Otherwise, creates a new object.

## Example

```typescript
// Convenience: creates new object
const { sin, cos } = sinCos(Math.PI / 4);

// Hot path: reuse object
const result: SinCos = { sin: 0, cos: 0 };
for (let i = 0; i < 1000; i++) {
 sinCos(angles[i], result);
 // use result.sin, result.cos...
}
```

## Since

0.7.0
