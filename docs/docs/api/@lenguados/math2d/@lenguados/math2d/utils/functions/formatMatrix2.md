# Function: formatMatrix2()

> **formatMatrix2**(`m`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:369](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L369)

Formats a 2x2 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix2`](../../core/type-aliases/ReadonlyMatrix2.md)

Matrix to format.

### format

Output format. Defaults to `'flat'`.

`"json"` | `"flat"` | `"nested"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

## Remarks

Supported formats: 'flat', 'nested', 'json'.

## Example

```typescript
const text = formatMatrix2(parseMatrix2('1,0,0,1'), 'json');
```

## Since

0.7.0
