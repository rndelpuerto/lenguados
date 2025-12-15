# Function: pingPongUnchecked()

> **pingPongUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:343](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L343)

Ping-pongs value in [min, max] range (unchecked).

## Parameters

### value

`number`

Value to ping-pong.

### min

`number`

Lower bound.

### max

`number`

Upper bound (must be > min).

## Returns

`number`

Ping-ponged value.

## Remarks

**⚠️ Precondition:** max > min.

## Since

0.13.0
