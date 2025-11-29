# Function: parseVector2()

> **parseVector2**(`string_`, `out`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Parses a string representation of a 2D vector.

Supported formats:

- "x,y" (comma-separated)
- "x y" (space-separated)
- "(x,y)" (with parentheses)
- "[x,y]" (with brackets)
- "{x:n, y:n}" (JSON-like)

## Parameters

### string\_

`string`

### out

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Parsed vector

## Throws

If the string cannot be parsed
