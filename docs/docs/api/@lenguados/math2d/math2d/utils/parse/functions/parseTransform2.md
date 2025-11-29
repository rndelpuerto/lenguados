# Function: parseTransform2()

> **parseTransform2**(`string_`, `out`): [`Transform2`](../../../../index.ts/classes/Transform2.md)

Parses a string representation of a 2D transform.

Supported formats:

- "px,py,c,s" (position x,y and rotation cos,sin)
- "px py c s" (space-separated)
- JSON format with p and r properties

## Parameters

### string\_

`string`

### out

[`Transform2`](../../../../index.ts/classes/Transform2.md) = `...`

Optional output transform (default: new Transform2)

## Returns

[`Transform2`](../../../../index.ts/classes/Transform2.md)

Parsed transform

## Throws

If the string cannot be parsed
