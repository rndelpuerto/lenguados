# Function: slerpAngle()

> **slerpAngle**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:55](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/interpolation.ts#L55)

Spherical linear interpolation for angles.
Constant angular velocity.

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

Interpolated angle

## Remarks

For angles, slerp and lerp produce the same result since
we're interpolating along a 1D circular arc. This function
exists for API consistency and clarity of intent.

## Since

1.0.0
