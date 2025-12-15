# Function: safeDivide()

> **safeDivide**(`numerator`, `denominator`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:54](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L54)

Safe division with fallback to 0.

## Parameters

### numerator

`number`

Dividend.

### denominator

`number`

Divisor.

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe divisor (default: MIN_SAFE_DIVISOR).

## Returns

`number`

Result or 0 if denominator is too small.

## Example

```typescript
safeDivide(10, 2); // 5
safeDivide(10, 0); // 0 (safe fallback)
safeDivide(10, 0.0000000001); // 0 (below epsilon)
safeDivide(10, 0, 0.1); // 0 (custom epsilon)
```

## Since

1.0.0
