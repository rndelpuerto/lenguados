# Function: safeDivide()

> **safeDivide**(`numerator`, `denominator`, `epsilon`): `number`

Safe division with fallback to 0.

## Parameters

### numerator

`number`

Dividend

### denominator

`number`

Divisor

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe divisor (default: MIN_SAFE_DIVISOR)

## Returns

`number`

Result or 0 if denominator is too small

## Example

```typescript
safeDivide(10, 2); // 5
safeDivide(10, 0); // 0 (safe fallback)
safeDivide(10, 0.0000000001); // 0 (below epsilon)
safeDivide(10, 0, 0.1); // 0 (custom epsilon)
```

## Since

1.0.0
