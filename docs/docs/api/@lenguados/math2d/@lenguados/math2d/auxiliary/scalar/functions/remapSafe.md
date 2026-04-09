# Function: remapSafe()

> **remapSafe**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:161](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L161)

Linear mapping from [inMin, inMax] to [outMin, outMax] (safe).

## Parameters

### value

`number`

Value to remap

### inMin

`number`

Input range minimum

### inMax

`number`

Input range maximum

### outMin

`number`

Output range minimum

### outMax

`number`

Output range maximum

## Returns

`number`

Remapped value, or outMin if input range is degenerate

## Example

```typescript
remapSafe(5, 0, 10, 0, 100); // 50
remapSafe(5, 5, 5, 0, 100); // 0 (degenerate input range)
```

## See

[remap](remap.md) - Throws for degenerate range

## Since

0.7.0
