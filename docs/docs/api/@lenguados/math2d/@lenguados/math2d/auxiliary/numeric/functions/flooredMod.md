# Function: flooredMod()

> **flooredMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:43](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/wrapping.ts#L43)

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
