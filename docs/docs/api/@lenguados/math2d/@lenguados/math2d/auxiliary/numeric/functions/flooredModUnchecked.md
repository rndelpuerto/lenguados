# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:88](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/wrapping.ts#L88)

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
