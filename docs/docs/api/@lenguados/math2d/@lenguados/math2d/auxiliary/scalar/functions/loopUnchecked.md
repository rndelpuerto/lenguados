# Function: loopUnchecked()

> **loopUnchecked**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:274](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L274)

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

0.13.0
