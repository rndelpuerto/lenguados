# Function: sinCos()

> **sinCos**(`x`, `out?`): [`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Defined in: [src/deterministic/deterministic-kernels.ts:420](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L420)

Compute sin and cos simultaneously (more efficient than separate calls).

## Parameters

### x

`number`

Angle in radians

### out?

[`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

## Returns

[`SinCos`](../../auxiliary/angle/interfaces/SinCos.md)

Object with sin and cos values

## Remarks

Range reduction uses Cody-Waite two-step subtraction with 106-bit extended
precision for PI/2 (PIO2_HI + PIO2_LO). For `|x| > 2^20·PI` (~3.3e6 radians),
the reduction error may exceed 1 ULP, causing gradual precision degradation.
Typical 2D physics simulations operate well within this bound.

## Example

```typescript
const result = sinCos(PI / 4);
// result.sin ≈ 0.7071, result.cos ≈ 0.7071
```

## Since

0.8.0
