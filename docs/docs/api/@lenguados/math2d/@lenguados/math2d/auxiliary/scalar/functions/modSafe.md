# Function: modSafe()

> **modSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:404](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L404)

Modulo operation that always returns positive result (safe).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Positive modulo result, or 0 if divisor <= 0

## Example

```typescript
modSafe(7, 3); // 1
modSafe(7, 0); // 0
```

## See

[mod](mod.md) - Throws for non-positive divisor

## Since

0.7.0
