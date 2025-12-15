# Function: remap()

> **remap**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:163](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L163)

Linear mapping from [inMin, inMax] to [outMin, outMax].

## Parameters

### value

`number`

Value to remap.

### inMin

`number`

Input range minimum.

### inMax

`number`

Input range maximum.

### outMin

`number`

Output range minimum.

### outMax

`number`

Output range maximum.

## Returns

`number`

Remapped value.

## Example

```typescript
remap(5, 0, 10, 0, 100); // 50
remap(75, 0, 100, -1, 1); // 0.5
```

## See

[remapSafe](remapSafe.md) - Returns outMin if ranges are degenerate

## Since

1.0.0
