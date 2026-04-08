# Function: formatMatrix2()

> **formatMatrix2**(`m`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:396](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L396)

Formats a 2x2 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to format

### format?

`"json"` \| `"flat"` \| `"nested"`

Output format. Defaults to `'flat'`

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
