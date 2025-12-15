# Function: formatMatrix3()

> **formatMatrix3**(`m`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:495](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L495)

Formats a 3x3 matrix as a string.

## Parameters

### m

[`ReadonlyMatrix3`](../../core/type-aliases/ReadonlyMatrix3.md)

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
const text = formatMatrix3(parseMatrix3('1,0,0,0,1,0,0,0,1'));
```

## Since

0.1.0
