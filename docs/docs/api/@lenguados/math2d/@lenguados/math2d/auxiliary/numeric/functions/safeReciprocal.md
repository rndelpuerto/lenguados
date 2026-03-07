# Function: safeReciprocal()

> **safeReciprocal**(`value`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:75](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L75)

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

0.7.0
