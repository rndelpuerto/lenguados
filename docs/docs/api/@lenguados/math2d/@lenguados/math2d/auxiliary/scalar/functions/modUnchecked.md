# Function: modUnchecked()

> **modUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:429](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L429)

Modulo operation that always returns positive result (unchecked).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor (must be positive)

## Returns

`number`

Positive modulo result

## Remarks

**Precondition:** divisor > 0.

## See

- [mod](mod.md) — Throws for non-positive divisor
- [modSafe](modSafe.md) — Returns 0 if divisor is invalid

## Since

0.7.0
