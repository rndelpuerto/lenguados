# Function: formatInterval()

> **formatInterval**(`interval`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:874](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L874)

Formats an interval as a string.

## Parameters

### interval

[`ReadonlyInterval`](../../core/type-aliases/ReadonlyInterval.md)

Interval to format.

### format

Output format. Defaults to `'brackets'`.

`"json"` | `"csv"` | `"brackets"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

## Remarks

Supported formats:

- 'brackets': "[a,b]" (standard interval notation)
- 'csv': "a,b" (comma-separated)
- 'json': '{"min":a,"max":b}'

## Example

```typescript
formatInterval(new Interval(0, 1), 'brackets'); // "[0,1]"
formatInterval(new Interval(-5, 5), 'csv'); // "-5,5"
```

## Since

0.7.0
