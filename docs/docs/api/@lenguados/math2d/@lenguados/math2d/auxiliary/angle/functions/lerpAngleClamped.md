# Function: lerpAngleClamped()

> **lerpAngleClamped**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:60](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/angle/interpolation.ts#L60)

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

0.9.0
