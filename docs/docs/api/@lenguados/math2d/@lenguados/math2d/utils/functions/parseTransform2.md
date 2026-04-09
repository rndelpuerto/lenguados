# Function: parseTransform2()

> **parseTransform2**(`string_`, `out?`): [`Transform2`](../../core/classes/Transform2.md)

Defined in: [src/utils/parse.ts:589](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/parse.ts#L589)

Parses a string representation of a 2D transform.

## Parameters

### string\_

`string`

Input string to parse

### out?

[`Transform2`](../../core/classes/Transform2.md) = `...`

Optional output transform to avoid allocation. Defaults to `new Transform2()`

## Returns

[`Transform2`](../../core/classes/Transform2.md)

The `out` transform containing the parsed values

## Remarks

Supported formats:

- "px,py,c,s" (position x,y and rotation cos,sin)
- "px py c s" (space-separated)
- JSON format with `p` and `r` properties

## Throws

If the string cannot be parsed

## Example

```typescript
const t = parseTransform2('0,0,1,0');
```

## Since

0.7.0
