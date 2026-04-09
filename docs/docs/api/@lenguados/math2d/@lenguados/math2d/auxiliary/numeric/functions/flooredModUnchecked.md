# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:95](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/wrapping.ts#L95)

Floored modulo (unchecked).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor (must not be zero)

## Returns

`number`

Floored remainder

## Remarks

**Precondition:** divisor !== 0. Zero divisor produces NaN.

## See

- [flooredMod](flooredMod.md) — Throws if divisor is zero
- [flooredModSafe](flooredModSafe.md) — Returns 0 if divisor is zero

## Since

0.7.0
