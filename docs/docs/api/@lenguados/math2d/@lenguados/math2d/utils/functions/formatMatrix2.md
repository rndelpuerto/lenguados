# Function: formatMatrix2()

> **formatMatrix2**(`m`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:384](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/parse.ts#L384)

Formats a 2x2 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix2`](../../core/type-aliases/ReadonlyMatrix2.md)

Matrix to format

### format

Output format. Defaults to `'flat'`

`"json"` | `"flat"` | `"nested"`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

## Remarks

Supported formats: 'flat', 'nested', 'json'.

## Example

```typescript
const text = formatMatrix2(parseMatrix2('1,0,0,1'), 'json');
```

## Since

0.7.0
