# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:93](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/wrapping.ts#L93)

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
