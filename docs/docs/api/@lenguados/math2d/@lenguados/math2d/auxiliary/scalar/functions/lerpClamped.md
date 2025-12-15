# Function: lerpClamped()

> **lerpClamped**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:62](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/interpolation.ts#L62)

Clamped linear interpolation.
Clamps t to [0, 1] before interpolating.

## Parameters

### a

`number`

Start value.

### b

`number`

End value.

### t

`number`

Interpolation factor (will be clamped to [0, 1]).

## Returns

`number`

Interpolated value guaranteed to be in [a, b] (or [b, a] if b < a).

## Remarks

Use this when t may be outside [0, 1] and extrapolation is not desired.
For unclamped interpolation (allowing extrapolation), use [lerp](lerp.md).

## Example

```typescript
lerpClamped(0, 10, 0.5); // 5
lerpClamped(0, 10, 1.5); // 10 (clamped, not 15)
lerpClamped(0, 10, -0.5); // 0 (clamped, not -5)
```

## See

[lerp](lerp.md) for unclamped interpolation

## Since

1.1.0
