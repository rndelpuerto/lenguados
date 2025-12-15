# Function: sinCosInto()

> **sinCosInto**(`angle`, `out`): [`SinCos`](../interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:95](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L95)

Computes sine and cosine into an existing output object.
Zero-allocation version of [sinCos](sinCos.md) for hot paths.

## Parameters

### angle

`number`

Angle in radians.

### out

[`SinCos`](../interfaces/SinCos.md)

Output object to write sin/cos into.

## Returns

[`SinCos`](../interfaces/SinCos.md)

The same `out` object with updated sin/cos.

## Remarks

**Hot path optimization:** Use this in tight loops to avoid
creating new objects on each call, reducing GC pressure.

## Example

```typescript
const result: SinCos = { sin: 0, cos: 0 };

// Reuse object in hot loop
for (let i = 0; i < 1000; i++) {
 sinCosInto(angles[i], result);
 // use result.sin, result.cos...
}
```

## See

[sinCos](sinCos.md) for convenience variant that creates new object.

## Since

1.1.0
