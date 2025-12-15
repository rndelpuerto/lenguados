# Function: smoothStepAngle()

> **smoothStepAngle**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:76](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/interpolation.ts#L76)

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
smoothStepAngle(0, Math.PI / 2, 0.5);      // Smooth transition
smoothStepAngle(0, Math.PI, 0.5);          // Smooth transition
```

## Since

1.0.0
