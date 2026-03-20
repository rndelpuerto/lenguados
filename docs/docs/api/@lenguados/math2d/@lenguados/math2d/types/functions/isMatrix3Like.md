# Function: isMatrix3Like()

> **isMatrix3Like**(`value`): `value is ReadonlyMatrix3Like`

Defined in: [src/types/index.ts:336](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/types/index.ts#L336)

Type guard to check if value has 3x3 matrix properties (Matrix3Like).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyMatrix3Like`

True if value conforms to ReadonlyMatrix3Like

## Example

```typescript
const mat = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: 1 };
if (isMatrix3Like(mat)) {
 console.log(mat.m00); // TypeScript knows m00 is a number
}
```

## Since

0.7.0
