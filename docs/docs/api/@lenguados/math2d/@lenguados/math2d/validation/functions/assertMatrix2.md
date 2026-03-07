# Function: assertMatrix2()

> **assertMatrix2**(`m00`, `m01`, `m10`, `m11`, `name?`): `void`

Defined in: [src/validation/assert.ts:423](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L423)

Asserts that Matrix2-like elements are finite.

## Parameters

### m00

`number`

Element at row 0, column 0.

### m01

`number`

Element at row 0, column 1.

### m10

`number`

Element at row 1, column 0.

### m11

`number`

Element at row 1, column 1.

### name?

`string`

Matrix name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and any element is not finite.

## Remarks

Validates all 4 elements are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Example

```typescript
function createMatrix(m00: number, m01: number, m10: number, m11: number): Matrix2 {
 assertMatrix2(m00, m01, m10, m11, 'input');
 return new Matrix2(m00, m01, m10, m11);
}
```

## Since

0.7.0
