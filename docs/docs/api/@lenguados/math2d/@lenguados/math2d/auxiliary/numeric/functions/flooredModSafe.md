# Function: flooredModSafe()

> **flooredModSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:72](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/wrapping.ts#L72)

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
