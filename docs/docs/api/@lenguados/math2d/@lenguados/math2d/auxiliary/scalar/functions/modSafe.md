# Function: modSafe()

> **modSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:407](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L407)

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
