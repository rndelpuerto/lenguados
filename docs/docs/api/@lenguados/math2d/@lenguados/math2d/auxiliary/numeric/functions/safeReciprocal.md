# Function: safeReciprocal()

> **safeReciprocal**(`value`, `epsilon`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:70](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L70)

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
safeReciprocal(2);           // 0.5
safeReciprocal(0);           // 0 (safe fallback)
safeReciprocal(0.00001);     // 0 (below epsilon)
```

## Since

1.0.0
