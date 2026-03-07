# Function: parseMatrix2()

> **parseMatrix2**(`string_`, `out`): [`Matrix2`](../../core/classes/Matrix2.md)

Defined in: [src/utils/parse.ts:306](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L306)

Parses a string representation of a 2x2 matrix.

## Parameters

### string\_

`string`

Input string to parse.

### out

[`Matrix2`](../../core/classes/Matrix2.md) = `...`

Optional output matrix to avoid allocation. Defaults to `new Matrix2()`.

## Returns

[`Matrix2`](../../core/classes/Matrix2.md)

The `out` matrix containing the parsed values.

## Throws

If the string cannot be parsed.

## Remarks

Supported formats:

- "m00,m01,m10,m11" (row-major, comma-separated)
- "m00 m01 m10 m11" (row-major, space-separated)
- "[[m00,m01],[m10,m11]]" (nested arrays)
- JSON format

## Example

```typescript
const m = parseMatrix2('1,0,0,1');
```

## Since

0.7.0
