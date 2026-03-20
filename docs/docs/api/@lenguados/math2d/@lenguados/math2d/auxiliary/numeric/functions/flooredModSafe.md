# Function: flooredModSafe()

> **flooredModSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:67](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/wrapping.ts#L67)

Floored modulo (safe).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Floored remainder, or 0 if divisor is zero

## Example

```typescript
flooredModSafe(7, 3); // 1
flooredModSafe(7, 0); // 0 (zero divisor)
```

## See

[flooredMod](flooredMod.md) - Throws if divisor is zero

## Since

0.7.0
