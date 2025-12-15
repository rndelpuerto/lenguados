# Function: mirrorSafe()

> **mirrorSafe**(`value`, `center`, `range`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:162](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L162)

Mirrors value around center (safe).

## Parameters

### value

`number`

Value to mirror.

### center

`number` = `0`

Mirror center (default: 0).

### range

`number` = `1`

Range from center (default: 1).

## Returns

`number`

Mirrored value, or center if range is invalid.

## See

[mirror](mirror.md) - Throws if range is invalid

## Since

0.14.0
