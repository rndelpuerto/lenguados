# Function: formatMatrix3()

> **formatMatrix3**(`m`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:531](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L531)

Formats a 3x3 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

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
const text = formatMatrix3(parseMatrix3('1,0,0,0,1,0,0,0,1'));
```

## Since

0.7.0
