# Function: pingPongUnchecked()

> **pingPongUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:327](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L327)

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
