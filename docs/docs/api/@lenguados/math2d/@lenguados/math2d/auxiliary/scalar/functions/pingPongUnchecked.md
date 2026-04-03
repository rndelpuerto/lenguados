# Function: pingPongUnchecked()

> **pingPongUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:330](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L330)

Ping-pongs value in [min, max] range (unchecked).

## Parameters

### value

`number`

Value to ping-pong

### min

`number`

Lower bound

### max

`number`

Upper bound (must be > min)

## Returns

`number`

Ping-ponged value

## Remarks

**Precondition:** max > min.

## See

- [pingPong](pingPong.md) — Throws for invalid range
- [pingPongSafe](pingPongSafe.md) — Returns min if range is invalid

## Since

0.7.0
