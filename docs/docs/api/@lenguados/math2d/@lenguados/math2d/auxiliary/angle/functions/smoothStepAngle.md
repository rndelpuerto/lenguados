# Function: smoothStepAngle()

> **smoothStepAngle**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:80](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/angle/interpolation.ts#L80)

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

0.7.0
