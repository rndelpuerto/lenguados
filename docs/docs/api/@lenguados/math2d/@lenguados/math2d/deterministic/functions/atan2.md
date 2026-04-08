# Function: atan2()

> **atan2**(`y`, `x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:617](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L617)

Deterministic two-argument arctangent.

## Parameters

### y

`number`

Y coordinate

### x

`number`

X coordinate

## Returns

`number`

Angle in [-π, π] from positive X axis to point (x, y)

## Remarks

This is the most important function for 2D geometry as it gives the angle
of a vector. Uses pure arithmetic via atan() and quadrant logic.

## Example

```typescript
atan2(0, 1); // 0 (positive X axis)
atan2(1, 0); // π/2 (positive Y axis)
atan2(0, -1); // π (negative X axis)
atan2(-1, 0); // -π/2 (negative Y axis)
```

## Since

0.7.0
