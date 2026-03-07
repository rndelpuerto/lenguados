# Function: safePow()

> **safePow**(`base`, `exponent`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:152](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L152)

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

0.7.0
