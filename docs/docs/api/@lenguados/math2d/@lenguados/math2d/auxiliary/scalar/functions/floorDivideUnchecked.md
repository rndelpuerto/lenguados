# Function: floorDivideUnchecked()

> **floorDivideUnchecked**(`value`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:491](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L491)

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
