# Function: repeatUnchecked()

> **repeatUnchecked**(`value`, `length`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:258](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L258)

Repeats value in range (unchecked).

## Parameters

### value

`number`

Value to repeat.

### length

`number`

Period of repetition (must be > 0).

## Returns

`number`

Repeated value in [0, length).

## Remarks

**⚠️ Precondition:** length > 0. Invalid length produces NaN/-Infinity.

## Since

0.14.0
