# Function: parseVector2()

> **parseVector2**(`string_`, `out?`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/parse.ts:101](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L101)

Parses a string representation of a 2D vector.

## Parameters

### string\_

`string`

Input string to parse

### out?

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector containing the parsed values

## Remarks

Supported formats:

- "x,y" (comma-separated)
- "x y" (space-separated)
- "(x,y)" (with parentheses)
- "[x,y]" (with brackets)
- "{x:n, y:n}" (JSON-like)

This function only handles finite numeric values. Non-finite values
(NaN, Infinity, -Infinity) serialized via format functions cannot
be round-tripped through parse functions.

## Throws

If the string cannot be parsed

## Example

```typescript
const v = parseVector2('(1, 2)');
```

## Since

0.7.0
