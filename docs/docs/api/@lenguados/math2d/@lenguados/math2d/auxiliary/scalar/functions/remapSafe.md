# Function: remapSafe()

> **remapSafe**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:145](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L145)

Linear mapping from [inMin, inMax] to [outMin, outMax] (safe).

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

Remapped value, or outMin if input range is degenerate.

## Example

```typescript
remapSafe(5, 0, 10, 0, 100); // 50
remapSafe(5, 5, 5, 0, 100); // 0 (degenerate input range)
```

## See

[remap](remap.md) - Returns midpoint for degenerate range

## Since

0.7.0
