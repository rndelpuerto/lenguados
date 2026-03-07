# Function: loopUnchecked()

> **loopUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:226](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L226)

Loops value into [min, max) range (unchecked).

## Parameters

### value

`number`

Value to wrap.

### min

`number`

Lower bound (inclusive).

### max

`number`

Upper bound (exclusive, must be > min).

## Returns

`number`

Wrapped value.

## Remarks

**⚠️ Precondition:** max > min. Invalid range produces undefined behavior.

## Since

0.7.0
