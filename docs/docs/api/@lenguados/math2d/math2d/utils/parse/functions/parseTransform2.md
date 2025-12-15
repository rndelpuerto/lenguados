# Function: parseTransform2()

> **parseTransform2**(`string_`, `out`): [`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md)

Defined in: [src/utils/parse.ts:436](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/parse.ts#L436)

Parses a string representation of a 2D transform.

Supported formats:
- "px,py,c,s" (position x,y and rotation cos,sin)
- "px py c s" (space-separated)
- JSON format with p and r properties

## Parameters

### string\_

`string`

### out

[`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md) = `...`

Optional output transform (default: new Transform2)

## Returns

[`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md)

Parsed transform

## Throws

If the string cannot be parsed
