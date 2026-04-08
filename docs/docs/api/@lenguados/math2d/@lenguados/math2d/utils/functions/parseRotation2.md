# Function: parseRotation2()

> **parseRotation2**(`string_`, `out?`): [`Rotation2`](../../core/classes/Rotation2.md)

Defined in: [src/utils/parse.ts:209](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L209)

Parses a string representation of a 2D rotation.

## Parameters

### string\_

`string`

Input string to parse

### out?

[`Rotation2`](../../core/classes/Rotation2.md) = `...`

Optional output rotation to avoid allocation. Defaults to `new Rotation2()`

## Returns

[`Rotation2`](../../core/classes/Rotation2.md)

The `out` rotation containing the parsed values

## Remarks

Supported formats:

- "angle" (single number in radians)
- "90deg" (with degree suffix)
- "c,s" (cosine,sine components)
- "{c:n, s:n}" (JSON-like)
- "{cos:n, sin:n}" (JSON-like)

## Throws

If the string cannot be parsed

## Example

```typescript
const r = parseRotation2('90deg');
```

## Since

0.7.0
