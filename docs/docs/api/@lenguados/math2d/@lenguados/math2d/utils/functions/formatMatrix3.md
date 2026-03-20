# Function: formatMatrix3()

> **formatMatrix3**(`m`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:519](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/parse.ts#L519)

Formats a 3x3 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix3`](../../core/type-aliases/ReadonlyMatrix3.md)

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
const text = formatMatrix3(parseMatrix3('1,0,0,0,1,0,0,0,1'));
```

## Since

0.7.0
