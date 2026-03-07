# Function: isNearZero()

> **isNearZero**(`value`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:50](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/comparison.ts#L50)

Tests if value is near zero.

## Parameters

### value

`number`

Value to test.

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

## Returns

`boolean`

True if |value| <= epsilon.

## Example

```typescript
isNearZero(0.0000000001); // true (within default epsilon)
isNearZero(0.1); // false
isNearZero(0.01, 0.1); // true (within custom epsilon)
```

## Since

0.7.0
