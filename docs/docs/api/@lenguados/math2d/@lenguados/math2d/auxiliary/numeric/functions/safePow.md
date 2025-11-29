# Function: safePow()

> **safePow**(`base`, `exponent`): `number`

Safe power that handles edge cases.

## Parameters

### base

`number`

Base value

### exponent

`number`

Exponent

## Returns

`number`

Result with special case handling

## Remarks

Handles edge cases like:

- 0^0 returns 1 (following JavaScript convention)
- Negative base with fractional exponent returns NaN
- Prevents overflow/underflow where possible

## Example

```typescript
safePow(2, 3); // 8
safePow(0, 0); // 1 (by convention)
safePow(-2, 0.5); // NaN (complex result)
safePow(10, 1000); // Infinity (overflow)
```

## Since

1.0.0
