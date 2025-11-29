# Function: smoothStepAngle()

> **smoothStepAngle**(`from`, `to`, `t`): `number`

Smooth step interpolation for angles.

## Parameters

### from

`number`

Start angle in radians

### to

`number`

End angle in radians

### t

`number`

Interpolation factor [0, 1]

## Returns

`number`

Interpolated angle with smooth acceleration/deceleration

## Example

```typescript
smoothStepAngle(0, Math.PI / 2, 0.5); // Smooth transition
smoothStepAngle(0, Math.PI, 0.5); // Smooth transition
```

## Since

1.0.0
