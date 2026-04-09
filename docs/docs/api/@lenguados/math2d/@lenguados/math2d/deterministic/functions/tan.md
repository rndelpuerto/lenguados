# Function: tan()

> **tan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:509](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L509)

Deterministic tangent function.

## Parameters

### x

`number`

Angle in radians

## Returns

`number`

tan(x) = sin(x) / cos(x)

## Remarks

Computed as `sin(x) / cos(x)`, so reduced precision near π/2 + nπ
where cos → 0. No singularity guard; returns ±large values near poles.

## Example

```typescript
tan(0); // 0
tan(PI / 4); // ~1
```

## Since

0.7.0
