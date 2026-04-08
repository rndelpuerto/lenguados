# Function: modUnchecked()

> **modUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:429](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L429)

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
