# Function: modUnchecked()

> **modUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:426](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L426)

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
