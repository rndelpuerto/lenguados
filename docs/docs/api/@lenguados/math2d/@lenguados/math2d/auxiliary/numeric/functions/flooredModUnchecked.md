# Function: flooredModUnchecked()

> **flooredModUnchecked**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:93](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/wrapping.ts#L93)

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
