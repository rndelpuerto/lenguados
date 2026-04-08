# Function: lerpAngleClamped()

> **lerpAngleClamped**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:60](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/interpolation.ts#L60)

Interpolates between angles using shortest path, clamping t to [0, 1].
Prevents extrapolation beyond the target angles.

## Parameters

### from

`number`

Start angle in radians

### to

`number`

End angle in radians

### t

`number`

Interpolation factor (clamped to [0, 1])

## Returns

`number`

Interpolated angle along shortest arc

## Example

```typescript
lerpAngleClamped(0, Math.PI / 2, 0.5); // Math.PI / 4
lerpAngleClamped(0, Math.PI / 2, 1.5); // Math.PI / 2 (clamped)
lerpAngleClamped(0, Math.PI / 2, -0.5); // 0 (clamped)
```

## See

- [lerpAngle](lerpAngle.md) - Unclamped variant (allows extrapolation)
- [smoothStepAngle](smoothStepAngle.md) - Smooth eased variant

## Since

0.7.0
