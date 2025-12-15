# Function: smoothStepAngle()

> **smoothStepAngle**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:76](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/interpolation.ts#L76)

Smooth step interpolation for angles.

## Parameters

### from

`number`

Start angle in radians.

### to

`number`

End angle in radians.

### t

`number`

Interpolation factor [0, 1].

## Returns

`number`

Interpolated angle with smooth acceleration/deceleration.

## Example

```typescript
smoothStepAngle(0, Math.PI / 2, 0.5); // Smooth transition
smoothStepAngle(0, Math.PI, 0.5); // Smooth transition
```

## Since

1.0.0
