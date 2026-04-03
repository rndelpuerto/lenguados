# Function: formatInterval()

> **formatInterval**(`interval`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:935](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/parse.ts#L935)

Formats an interval as a string.

## Parameters

### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to format

### format

Output format. Defaults to `'brackets'`

`"json"` | `"csv"` | `"brackets"`

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
