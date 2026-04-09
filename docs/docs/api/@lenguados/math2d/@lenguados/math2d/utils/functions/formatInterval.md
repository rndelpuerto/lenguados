# Function: formatInterval()

> **formatInterval**(`interval`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:935](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/parse.ts#L935)

Formats an interval as a string.

## Parameters

### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to format

### format?

`"json"` \| `"csv"` \| `"brackets"`

Output format. Defaults to `'brackets'`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

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
