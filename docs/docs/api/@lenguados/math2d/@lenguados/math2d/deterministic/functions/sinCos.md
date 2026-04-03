# Function: sinCos()

> **sinCos**(`x`, `out?`): [`SinCos`](../../types/interfaces/SinCos.md)

Defined in: [src/deterministic/deterministic-kernels.ts:440](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L440)

Compute sin and cos simultaneously (more efficient than separate calls).

## Parameters

### x

`number`

Angle in radians

### out?

[`SinCos`](../../types/interfaces/SinCos.md)

Optional output object to write sin/cos into (zero-allocation)

## Returns

[`SinCos`](../../types/interfaces/SinCos.md)

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
