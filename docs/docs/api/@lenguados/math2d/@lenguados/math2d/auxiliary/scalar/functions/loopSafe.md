# Function: loopSafe()

> **loopSafe**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:254](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L254)

Loops value into [min, max) range (safe).

## Parameters

### value

`number`

Value to wrap.

### min

`number`

Lower bound (inclusive).

### max

`number`

Upper bound (exclusive).

## Returns

`number`

Wrapped value, or min if range is invalid.

## See

[loop](loop.md) - Throws if range is invalid

## Since

0.13.0
