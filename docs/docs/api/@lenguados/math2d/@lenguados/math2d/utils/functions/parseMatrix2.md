# Function: parseMatrix2()

> **parseMatrix2**(`string_`, `out?`): [`Matrix2`](../../core/classes/Matrix2.md)

Defined in: [src/utils/parse.ts:333](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L333)

Parses a string representation of a 2x2 matrix.

## Parameters

### string\_

`string`

Input string to parse

### out?

[`Matrix2`](../../core/classes/Matrix2.md) = `...`

Optional output matrix to avoid allocation. Defaults to `new Matrix2()`

## Returns

[`Matrix2`](../../core/classes/Matrix2.md)

The `out` matrix containing the parsed values

## Remarks

Supported formats:

- "m00,m01,m10,m11" (row-major, comma-separated)
- "m00 m01 m10 m11" (row-major, space-separated)
- "[[m00,m01],[m10,m11]]" (nested arrays)
- JSON format

## Throws

If the string cannot be parsed

## Example

```typescript
const m = parseMatrix2('1,0,0,1');
```

## Since

0.7.0
