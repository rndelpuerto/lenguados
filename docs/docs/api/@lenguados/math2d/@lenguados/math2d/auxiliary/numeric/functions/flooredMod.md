# Function: flooredMod()

> **flooredMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:48](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L48)

Floored modulo (strict).

## Parameters

### dividend

`number`

Value to divide.

### divisor

`number`

Divisor.

## Returns

`number`

Floored remainder.

## Throws

If divisor is near zero.

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

1.0.0
