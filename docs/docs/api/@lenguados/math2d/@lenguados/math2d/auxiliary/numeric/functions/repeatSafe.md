# Function: repeatSafe()

> **repeatSafe**(`value`, `length`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:241](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L241)

Repeats value in range (safe).

## Parameters

### value

`number`

Value to repeat.

### length

`number`

Period of repetition.

## Returns

`number`

Repeated value in [0, length), or 0 if length is invalid.

## See

[repeat](repeat.md) - Throws if length is invalid

## Since

0.14.0
