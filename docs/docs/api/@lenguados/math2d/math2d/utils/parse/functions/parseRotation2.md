# Function: parseRotation2()

> **parseRotation2**(`string_`, `out`): [`Rotation2`](../../../../@lenguados/math2d/core/classes/Rotation2.md)

Defined in: [src/utils/parse.ts:140](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/parse.ts#L140)

Parses a string representation of a 2D rotation.

Supported formats:
- "angle" (single number in radians)
- "90deg" (with degree suffix)
- "c,s" (cosine,sine components)
- "{c:n, s:n}" (JSON-like)

## Parameters

### string\_

`string`

### out

[`Rotation2`](../../../../@lenguados/math2d/core/classes/Rotation2.md) = `...`

Optional output rotation (default: new Rotation2)

## Returns

[`Rotation2`](../../../../@lenguados/math2d/core/classes/Rotation2.md)

Parsed rotation

## Throws

If the string cannot be parsed
