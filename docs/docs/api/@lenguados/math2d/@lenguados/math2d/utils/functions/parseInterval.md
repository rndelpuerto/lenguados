# Function: parseInterval()

> **parseInterval**(`string_`, `out?`): [`Interval`](../../core/classes/Interval.md)

Defined in: [src/utils/parse.ts:869](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L869)

Parses a string representation of an interval.

## Parameters

### string\_

`string`

Input string to parse

### out?

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
