# Function: isNearZero()

> **isNearZero**(`value`, `epsilon?`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:71](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/comparison.ts#L71)

Tests if value is near zero.

## Parameters

### value

`number`

Value to test

### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if |value| <= epsilon

## Remarks

Default tolerance is [EPSILON](../variables/EPSILON.md) (1e-10). Used by core type operations
(normalization, inverse, projection) to detect geometrically degenerate inputs.

## Throws

If epsilon is negative or NaN

## Example

```typescript
isNearZero(0.0000000001); // true (within default epsilon)
isNearZero(0.1); // false
isNearZero(0.01, 0.1); // true (within custom epsilon)
```

## Since

0.7.0
