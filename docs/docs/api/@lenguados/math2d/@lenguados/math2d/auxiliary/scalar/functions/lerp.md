# Function: lerp()

> **lerp**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:35](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/interpolation.ts#L35)

Linear interpolation between two values.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor (usually 0-1)

## Returns

`number`

Interpolated value

## Remarks

The interpolation factor t is not clamped, allowing extrapolation
for t values outside [0, 1]. Use [lerpClamped](lerpClamped.md) when you need
to ensure the result stays within [a, b].

## Example

```typescript
lerp(0, 10, 0.5);    // 5
lerp(0, 10, 0);      // 0
lerp(0, 10, 1);      // 10
lerp(0, 10, 2);      // 20 (extrapolation)
lerp(0, 10, -0.5);   // -5 (extrapolation)
```

## See

[lerpClamped](lerpClamped.md) for clamped interpolation

## Since

1.0.0
