# Function: flooredMod()

> **flooredMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:48](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/wrapping.ts#L48)

Floored modulo (strict).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Floored remainder

## Remarks

Uses `isNearZero(divisor)` with EPSILON tolerance (1e-10) to detect
zero divisors, not an exact `=== 0` check. Values like 1e-11 will throw.

## Throws

If divisor is near zero

## Example

```typescript
flooredMod(7, 3); // 1
flooredMod(-7, 3); // 2
flooredMod(7, -3); // -2
flooredMod(-7, -3); // -1
```

## See

- [flooredModSafe](flooredModSafe.md) - Returns 0 if divisor is zero
- [flooredModUnchecked](flooredModUnchecked.md) - No validation

## Since

0.7.0
