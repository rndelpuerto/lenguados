# Function: formatComplex()

> **formatComplex**(`c`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:816](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L816)

Formats a complex number as a string.

## Parameters

### c

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to format

### format?

`"json"` \| `"csv"` \| `"math"`

Output format. Defaults to `'math'`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

## Remarks

Supported formats:

- 'math': "a+bi" or "a-bi" (standard mathematical notation)
- 'csv': "a,b" (comma-separated)
- 'json': '{"real":a,"imag":b}'

## Example

```typescript
formatComplex(new Complex(3, 4), 'math'); // "3+4i"
formatComplex(new Complex(3, -4), 'math'); // "3-4i"
formatComplex(new Complex(3, 4), 'csv'); // "3,4"
```

## Since

0.7.0
