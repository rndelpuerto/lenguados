# Function: floorDivideUnchecked()

> **floorDivideUnchecked**(`value`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:494](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L494)

Unchecked floored division. No validation.

## Parameters

### value

`number`

Numerator

### divisor

`number`

Denominator

## Returns

`number`

Floor of division

## Remarks

**Precondition:** divisor !== 0.

## See

- [floorDivide](floorDivide.md) — Throws for zero divisor
- [floorDivideSafe](floorDivideSafe.md) — Returns 0 if divisor is zero

## Since

0.7.0
