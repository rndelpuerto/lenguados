# Function: safePow()

> **safePow**(`base`, `exponent`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:215](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L215)

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
safePow(2, 3);           // 8
safePow(0, 0);           // 1 (by convention)
safePow(-2, 0.5);        // NaN (complex result)
safePow(10, 1000);       // Infinity (overflow)
```

## Since

1.0.0
