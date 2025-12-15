# Function: parseVector2()

> **parseVector2**(`string_`, `out`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/parse.ts:76](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L76)

Parses a string representation of a 2D vector.

## Parameters

### string\_

`string`

Input string to parse.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector containing the parsed values.

## Throws

If the string cannot be parsed.

## Remarks

Supported formats:

- "x,y" (comma-separated)
- "x y" (space-separated)
- "(x,y)" (with parentheses)
- "[x,y]" (with brackets)
- "{x:n, y:n}" (JSON-like)

## Example

```typescript
const v = parseVector2('(1, 2)');
```

## Since

0.1.0
