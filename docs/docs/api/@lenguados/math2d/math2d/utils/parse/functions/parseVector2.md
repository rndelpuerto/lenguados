# Function: parseVector2()

> **parseVector2**(`string_`, `out`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/parse.ts:62](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/parse.ts#L62)

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

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Parsed vector

## Throws

If the string cannot be parsed
