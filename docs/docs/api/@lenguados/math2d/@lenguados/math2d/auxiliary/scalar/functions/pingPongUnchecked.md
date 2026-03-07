# Function: pingPongUnchecked()

> **pingPongUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:303](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L303)

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

0.7.0
