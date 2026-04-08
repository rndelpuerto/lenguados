# Function: isMatrix2Like()

> **isMatrix2Like**(`value`): `value is ReadonlyMatrix2Like`

Defined in: [src/types/index.ts:292](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L292)

Type guard to check if value has 2x2 matrix properties (Matrix2Like).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyMatrix2Like`

True if value conforms to ReadonlyMatrix2Like

## Example

```typescript
const mat = { m00: 1, m01: 0, m10: 0, m11: 1 };
if (isMatrix2Like(mat)) {
 console.log(mat.m00); // TypeScript knows m00 is a number
}
```

## Since

0.7.0
