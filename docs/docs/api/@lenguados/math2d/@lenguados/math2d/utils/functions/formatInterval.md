# Function: formatInterval()

> **formatInterval**(`interval`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:861](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L861)

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

0.14.0
