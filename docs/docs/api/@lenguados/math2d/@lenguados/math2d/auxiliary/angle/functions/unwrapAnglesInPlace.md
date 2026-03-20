# Function: unwrapAnglesInPlace()

> **unwrapAnglesInPlace**(`angles`, `reference?`): `number`[]

Defined in: [src/auxiliary/angle/unwrapping.ts:91](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L91)

Unwraps angles in-place.

## Parameters

### angles

`number`[]

Array of angles to unwrap (modified in-place)

### reference?

`number`

Optional continuity reference for the first element

## Returns

`number`[]

The modified angles array

## Remarks

More memory efficient than unwrapAngles for large arrays.

## Throws

If input array contains holes (undefined values)

## Example

```typescript
const angles = [0, 3, -3, 0];
unwrapAnglesInPlace(angles);
console.log(angles); // [0, 3, 3.28..., 6.28...]
```

## Since

0.7.0
