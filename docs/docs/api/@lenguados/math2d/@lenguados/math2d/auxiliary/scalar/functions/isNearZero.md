# Function: isNearZero()

> **isNearZero**(`value`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:46](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/comparison.ts#L46)

Tests if value is near zero.

## Parameters

### value

`number`

Value to test

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if |value| <= epsilon

## Example

```typescript
isNearZero(0.0000000001);   // true (within default epsilon)
isNearZero(0.1);           // false
isNearZero(0.01, 0.1);     // true (within custom epsilon)
```

## Since

1.0.0
