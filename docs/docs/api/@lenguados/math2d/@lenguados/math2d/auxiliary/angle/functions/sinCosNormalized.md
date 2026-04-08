# Function: sinCosNormalized()

> **sinCosNormalized**(`angle`, `out?`): [`SinCos`](../../../types/interfaces/SinCos.md)

Defined in: [src/auxiliary/angle/operations.ts:81](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/operations.ts#L81)

Computes sine and cosine of a normalized angle.
Normalizes the angle to (-π, π] before computing.

## Parameters

### angle

`number`

Angle in radians (will be normalized)

### out?

[`SinCos`](../../../types/interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

## Returns

[`SinCos`](../../../types/interfaces/SinCos.md)

Object with sin and cos properties

## Remarks

Uses deterministic math (`sin`, `cos` from deterministic-kernels).

Prefer this over [sinCos](sinCos.md) for accumulated angles exceeding ~2²⁰·π
(~3.3e6 radians), where Cody-Waite range reduction loses precision due to
large quadrant numbers `n` in the `n·(π/2)` subtraction. This function
normalizes the angle to (-π, π] first via floating-point modulo
([normalizeRadians](normalizeRadians.md)), ensuring the subsequent Cody-Waite reduction
operates on a small angle with `n ≤ 2`.

**Not Payne-Hanek:** The pre-normalization uses IEEE 754 remainder (`%`),
not arbitrary-precision reduction. For `|angle| > ~2⁵³ / τ` (~1.4e15),
the modulo itself loses all significant digits. In practice, 2D physics
simulations rarely accumulate angles beyond a few thousand radians, so
this is not a concern for typical use cases.

## Example

```typescript
const { sin, cos } = sinCosNormalized(5 * Math.PI);
// Equivalent to sinCos(Math.PI)
```

## Since

0.7.0
