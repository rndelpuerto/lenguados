# Function: parseInterval()

> **parseInterval**(`string_`, `out`): [`Interval`](../../core/classes/Interval.md)

Defined in: [src/utils/parse.ts:857](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/parse.ts#L857)

Parses a string representation of an interval.

## Parameters

### string\_

`string`

Input string to parse

### out

[`Interval`](../../core/classes/Interval.md) = `...`

Optional output interval to avoid allocation. Defaults to `new Interval()`

## Returns

[`Interval`](../../core/classes/Interval.md)

The `out` interval containing the parsed values

## Remarks

Supported formats:

- "[a,b]" (standard interval notation)
- "(a,b)" (open interval notation, but creates closed)
- "a,b" (comma-separated)
- "{min:a, max:b}" (JSON-like)

## Throws

If the string cannot be parsed

## Example

```typescript
const i1 = parseInterval('[0,1]'); // [0, 1]
const i2 = parseInterval('-5,5'); // [-5, 5]
const i3 = parseInterval('{"min":0,"max":100}'); // [0, 100]
```

## Since

0.7.0
