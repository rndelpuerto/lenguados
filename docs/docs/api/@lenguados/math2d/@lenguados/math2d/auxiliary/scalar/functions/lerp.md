# Function: lerp()

> **lerp**(`a`, `b`, `t`): `number`

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

The interpolation factor t is not clamped. Use saturate(t) if needed.
For t=0 returns a, for t=1 returns b.

## Example

```typescript
lerp(0, 10, 0.5); // 5
lerp(0, 10, 0); // 0
lerp(0, 10, 1); // 10
lerp(0, 10, 2); // 20 (extrapolation)
```

## Since

1.0.0
