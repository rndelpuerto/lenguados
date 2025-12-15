# Function: safePow()

> **safePow**(`base`, `exponent`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:223](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L223)

Safe power that handles edge cases.

## Parameters

### base

`number`

Base value.

### exponent

`number`

Exponent.

## Returns

`number`

Result with special case handling.

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
