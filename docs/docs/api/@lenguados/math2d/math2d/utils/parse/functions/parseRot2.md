# Function: parseRot2()

> **parseRot2**(`string_`, `out`): [`Rotation2`](../../../../index.ts/classes/Rotation2.md)

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

[`Rotation2`](../../../../index.ts/classes/Rotation2.md) = `...`

Optional output rotation (default: new Rot2)

## Returns

[`Rotation2`](../../../../index.ts/classes/Rotation2.md)

Parsed rotation

## Throws

If the string cannot be parsed
