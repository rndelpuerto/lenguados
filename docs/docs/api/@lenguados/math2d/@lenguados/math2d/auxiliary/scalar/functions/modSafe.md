# Function: modSafe()

> **modSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:407](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L407)

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
