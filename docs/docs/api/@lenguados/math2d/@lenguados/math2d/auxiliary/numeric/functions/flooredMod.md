# Function: flooredMod()

> **flooredMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:50](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/wrapping.ts#L50)

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
- mod — positive modulo (in `auxiliary/scalar/arithmetic.ts`)
- loop — range wrapping (in `auxiliary/scalar/arithmetic.ts`)

## Since

0.7.0
