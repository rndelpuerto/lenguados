# Function: formatVector2()

> **formatVector2**(`v`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:134](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L134)

Formats a 2D vector as a string.

## Parameters

### v

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Vector to format.

### format

Output format. Defaults to `'csv'`.

`"json"` | `"csv"` | `"space"` | `"brackets"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

## Remarks

Supported formats: 'csv', 'space', 'json', 'brackets'.

## Example

```typescript
const text = formatVector2(new Vector2(1, 2), 'brackets');
```

## Since

0.7.0
