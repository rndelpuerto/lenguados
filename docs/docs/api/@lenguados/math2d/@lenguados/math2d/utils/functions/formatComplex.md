# Function: formatComplex()

> **formatComplex**(`c`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:764](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L764)

Formats a complex number as a string.

## Parameters

### c

[`ReadonlyComplex`](../../core/type-aliases/ReadonlyComplex.md)

Complex number to format.

### format

Output format. Defaults to `'math'`.

`"json"` | `"csv"` | `"math"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

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
