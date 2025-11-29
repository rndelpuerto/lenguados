# Function: safeReciprocal()

> **safeReciprocal**(`value`, `epsilon`): `number`

Safe reciprocal (1/x).

## Parameters

### value

`number`

Value to invert

### epsilon

`number` = `MIN_SAFE_DIVISOR`

Minimum safe value (default: MIN_SAFE_DIVISOR)

## Returns

`number`

Reciprocal or 0 if value is too small

## Example

```typescript
safeReciprocal(2); // 0.5
safeReciprocal(0); // 0 (safe fallback)
safeReciprocal(0.00001); // 0 (below epsilon)
```

## Since

1.0.0
