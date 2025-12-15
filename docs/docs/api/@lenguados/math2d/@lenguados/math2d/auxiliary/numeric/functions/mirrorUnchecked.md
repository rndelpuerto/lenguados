# Function: mirrorUnchecked()

> **mirrorUnchecked**(`value`, `center`, `range`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:180](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L180)

Mirrors value around center (unchecked).

## Parameters

### value

`number`

Value to mirror.

### center

`number`

Mirror center.

### range

`number`

Range from center (must be > 0).

## Returns

`number`

Mirrored value.

## Remarks

**⚠️ Precondition:** range > 0. Invalid range produces undefined behavior.

## Since

0.14.0
