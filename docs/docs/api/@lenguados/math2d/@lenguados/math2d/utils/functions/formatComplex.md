# Function: formatComplex()

> **formatComplex**(`c`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:816](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/parse.ts#L816)

Formats a complex number as a string.

## Parameters

### c

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to format

### format

Output format. Defaults to `'math'`

`"json"` | `"csv"` | `"math"`

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
