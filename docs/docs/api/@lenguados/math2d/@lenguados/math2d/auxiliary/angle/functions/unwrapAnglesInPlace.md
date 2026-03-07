# Function: unwrapAnglesInPlace()

> **unwrapAnglesInPlace**(`angles`, `reference?`): `number`[]

Defined in: [src/auxiliary/angle/unwrapping.ts:90](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/unwrapping.ts#L90)

Unwraps angles in-place.

## Parameters

### angles

`number`[]

Array of angles to unwrap (modified in-place).

### reference?

`number`

Optional continuity reference for the first element.

## Returns

`number`[]

The modified angles array.

## Remarks

More memory efficient than unwrapAngles for large arrays.

## Example

```typescript
const angles = [0, 3, -3, 0];
unwrapAnglesInPlace(angles);
console.log(angles); // [0, 3, 3.28..., 6.28...]
```

## Throws

If input array contains holes (undefined values).

## Since

0.7.0
