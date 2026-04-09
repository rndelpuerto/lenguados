# Function: loopUnchecked()

> **loopUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:249](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L249)

Loops value into [min, max) range (unchecked).

## Parameters

### value

`number`

Value to wrap

### min

`number`

Lower bound (inclusive)

### max

`number`

Upper bound (exclusive, must be > min)

## Returns

`number`

Wrapped value

## Remarks

**Precondition:** max > min. Invalid range produces undefined behavior.

## See

- [loop](loop.md) — Throws for invalid range
- [loopSafe](loopSafe.md) — Returns min if range is invalid

## Since

0.7.0
