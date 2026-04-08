# Function: formatVector2()

> **formatVector2**(`v`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:158](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L158)

Formats a 2D vector as a string.

## Parameters

### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to format

### format?

`"json"` \| `"csv"` \| `"space"` \| `"brackets"`

Output format. Defaults to `'csv'`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

## Remarks

Supported formats: 'csv', 'space', 'json', 'brackets'.

## Example

```typescript
const text = formatVector2(new Vector2(1, 2), 'brackets');
```

## Since

0.7.0
