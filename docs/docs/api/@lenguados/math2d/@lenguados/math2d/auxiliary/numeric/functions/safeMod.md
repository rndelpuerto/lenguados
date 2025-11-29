# Function: safeMod()

> **safeMod**(`dividend`, `divisor`): `number`

Safe modulo that handles negative divisor.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Modulo result or 0 if divisor is 0

## Remarks

Unlike the % operator, this ensures the result has the same
sign as the divisor (Euclidean modulo).

## Example

```typescript
safeMod(7, 3); // 1
safeMod(-7, 3); // 2 (not -1)
safeMod(7, -3); // -2 (not 1)
safeMod(-7, -3); // -1
safeMod(5, 0); // 0 (safe fallback)
```

## Since

1.0.0
