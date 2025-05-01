# Function: normalize()

> **normalize**(`x`, `min`, `max`): `number`

Defined in: [src/scalar.ts:81](https://github.com/rndelpuerto/lenguados/blob/3db26e60cf924a3f02d7d869c59509fd2fa87c96/packages/math2d/src/scalar.ts#L81)

Maps a value from [min, max] into [0, 1], clamped.

## Parameters

### x

`number`

The value to normalize.

### min

`number`

Lower bound of the input range.

### max

`number`

Upper bound of the input range.

## Returns

`number`

Normalized and clamped value in [0, 1].
