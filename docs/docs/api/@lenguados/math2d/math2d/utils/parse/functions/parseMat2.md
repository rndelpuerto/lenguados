# Function: parseMat2()

> **parseMat2**(`string_`, `out`): [`Matrix2`](../../../../index.ts/classes/Matrix2.md)

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

[`Matrix2`](../../../../index.ts/classes/Matrix2.md) = `...`

Optional output matrix (default: new Mat2)

## Returns

[`Matrix2`](../../../../index.ts/classes/Matrix2.md)

Parsed matrix

## Throws

If the string cannot be parsed
