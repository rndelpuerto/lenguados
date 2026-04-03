# Function: formatVector2()

> **formatVector2**(`v`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:158](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/parse.ts#L158)

Formats a 2D vector as a string.

## Parameters

### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to format

### format

Output format. Defaults to `'csv'`

`"json"` | `"csv"` | `"space"` | `"brackets"`

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
