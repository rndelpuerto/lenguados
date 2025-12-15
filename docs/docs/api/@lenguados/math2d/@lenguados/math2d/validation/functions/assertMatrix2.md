# Function: assertMatrix2()

> **assertMatrix2**(`m00`, `m01`, `m10`, `m11`, `name?`): `void`

Defined in: [src/validation/assert.ts:260](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L260)

Asserts that Matrix2-like components are finite.

## Parameters

### m00

`number`

Element [0,0]

### m01

`number`

Element [0,1]

### m10

`number`

Element [1,0]

### m11

`number`

Element [1,1]

### name?

`string`

Matrix name for error messages

## Returns

`void`

## Throws

If assertions enabled and any element is not finite

## Example

```typescript
function createMatrix(m00: number, m01: number, m10: number, m11: number): Matrix2 {
  assertMatrix2(m00, m01, m10, m11, 'input');
  return new Matrix2(m00, m01, m10, m11);
}
```
