# Function: isNearOne()

> **isNearOne**(`value`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:95](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/comparison.ts#L95)

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

## Example

```typescript
isNearOne(0.9999999999); // true (within default epsilon)
isNearOne(0.9); // false
isNearOne(1.01, 0.1); // true (within custom epsilon)
```

## Since

0.7.0
