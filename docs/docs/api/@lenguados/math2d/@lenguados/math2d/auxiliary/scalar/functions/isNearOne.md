# Function: isNearOne()

> **isNearOne**(`value`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:101](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/comparison.ts#L101)

Tests if value is near one.

## Parameters

### value

`number`

Value to test

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if |value - 1| <= epsilon

## Remarks

Default tolerance is [EPSILON](../variables/EPSILON.md) (1e-10). Commonly used to verify
normalization constraints (e.g., unit vectors, rotation magnitudes).

## Throws

If epsilon is negative or NaN

## Example

```typescript
isNearOne(0.9999999999); // true (within default epsilon)
isNearOne(0.9); // false
isNearOne(1.01, 0.1); // true (within custom epsilon)
```

## Since

0.7.0
