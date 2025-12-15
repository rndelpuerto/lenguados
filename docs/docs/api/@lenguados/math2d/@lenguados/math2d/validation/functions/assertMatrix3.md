# Function: assertMatrix3()

> **assertMatrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`, `name?`): `void`

Defined in: [src/validation/assert.ts:442](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L442)

Asserts that Matrix3-like elements are finite.

## Parameters

### m00

`number`

Element at row 0, column 0.

### m01

`number`

Element at row 0, column 1.

### m02

`number`

Element at row 0, column 2.

### m10

`number`

Element at row 1, column 0.

### m11

`number`

Element at row 1, column 1.

### m12

`number`

Element at row 1, column 2.

### m20

`number`

Element at row 2, column 0.

### m21

`number`

Element at row 2, column 1.

### m22

`number`

Element at row 2, column 2.

### name?

`string`

Matrix name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and any element is not finite.

## Remarks

Validates all 9 elements are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Example

```typescript
function createMatrix(elements: number[]): Matrix3 {
 assertMatrix3(
  elements[0],
  elements[1],
  elements[2],
  elements[3],
  elements[4],
  elements[5],
  elements[6],
  elements[7],
  elements[8],
  'input',
 );
 return Matrix3.fromArray(elements);
}
```

## Since

0.1.0
