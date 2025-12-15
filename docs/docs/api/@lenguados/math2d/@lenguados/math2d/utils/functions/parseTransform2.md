# Function: parseTransform2()

> **parseTransform2**(`string_`, `out`): [`Transform2`](../../core/classes/Transform2.md)

Defined in: [src/utils/parse.ts:553](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L553)

Parses a string representation of a 2D transform.

## Parameters

### string\_

`string`

Input string to parse.

### out

[`Transform2`](../../core/classes/Transform2.md) = `...`

Optional output transform to avoid allocation. Defaults to `new Transform2()`.

## Returns

[`Transform2`](../../core/classes/Transform2.md)

The `out` transform containing the parsed values.

## Throws

If the string cannot be parsed.

## Remarks

Supported formats:

- "px,py,c,s" (position x,y and rotation cos,sin)
- "px py c s" (space-separated)
- JSON format with `p` and `r` properties

## Example

```typescript
const t = parseTransform2('0,0,1,0');
```

## Since

0.1.0
