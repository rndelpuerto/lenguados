# Function: safeReciprocal()

> **safeReciprocal**(`value`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:78](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L78)

Safe reciprocal (1/x).

## Parameters

### value

`number`

Value to invert.

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe value (default: MIN_SAFE_DIVISOR).

## Returns

`number`

Reciprocal or 0 if value is too small.

## Example

```typescript
safeReciprocal(2); // 0.5
safeReciprocal(0); // 0 (safe fallback)
safeReciprocal(0.00001); // 0 (below epsilon)
```

## Since

1.0.0
