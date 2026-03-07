# Function: parseVector2()

> **parseVector2**(`string_`, `out`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/parse.ts:77](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L77)

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

0.7.0
