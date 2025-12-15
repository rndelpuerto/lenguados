# Function: formatVector2()

> **formatVector2**(`v`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:131](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L131)

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

0.1.0
