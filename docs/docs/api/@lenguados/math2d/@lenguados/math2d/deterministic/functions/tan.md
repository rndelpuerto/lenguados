# Function: tan()

> **tan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:502](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L502)

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

0.8.0
