# Function: parseMatrix2()

> **parseMatrix2**(`string_`, `out`): [`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md)

Defined in: [src/utils/parse.ts:238](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/parse.ts#L238)

Parses a string representation of a 2x2 matrix.

Supported formats:
- "m00,m01,m10,m11" (row-major, comma-separated)
- "m00 m01 m10 m11" (row-major, space-separated)
- "[[m00,m01],[m10,m11]]" (nested arrays)
- JSON format

## Parameters

### string\_

`string`

### out

[`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md) = `...`

Optional output matrix (default: new Matrix2)

## Returns

[`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md)

Parsed matrix

## Throws

If the string cannot be parsed
