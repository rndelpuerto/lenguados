# Function: remap()

> **remap**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:109](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L109)

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

0.7.0
