# Function: modSafe()

> **modSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:376](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L376)

Modulo operation that always returns positive result (safe).

## Parameters

### dividend

`number`

Value to divide.

### divisor

`number`

Divisor.

## Returns

`number`

Positive modulo result, or 0 if divisor <= 0.

## Example

```typescript
modSafe(7, 3); // 1
modSafe(7, 0); // 0
```

## See

[mod](mod.md) - Throws for non-positive divisor

## Since

0.7.0
