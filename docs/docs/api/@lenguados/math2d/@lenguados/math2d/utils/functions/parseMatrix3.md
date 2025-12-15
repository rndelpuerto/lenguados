# Function: parseMatrix3()

> **parseMatrix3**(`string_`, `out`): [`Matrix3`](../../core/classes/Matrix3.md)

Defined in: [src/utils/parse.ts:411](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L411)

Parses a string representation of a 3x3 matrix.

## Parameters

### string\_

`string`

Input string to parse.

### out

[`Matrix3`](../../core/classes/Matrix3.md) = `...`

Optional output matrix to avoid allocation. Defaults to `new Matrix3()`.

## Returns

[`Matrix3`](../../core/classes/Matrix3.md)

The `out` matrix containing the parsed values.

## Throws

If the string cannot be parsed.

## Remarks

Supported formats:

- "m00,m01,m02,m10,m11,m12,m20,m21,m22" (row-major, comma-separated)
- "m00 m01 m02 m10 m11 m12 m20 m21 m22" (row-major, space-separated)
- "[[m00,m01,m02],[m10,m11,m12],[m20,m21,m22]]" (nested arrays)
- JSON format

## Example

```typescript
const m = parseMatrix3('1,0,0,0,1,0,0,0,1');
```

## Since

0.1.0
