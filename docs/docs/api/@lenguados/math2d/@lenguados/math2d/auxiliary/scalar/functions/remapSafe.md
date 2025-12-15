# Function: remapSafe()

> **remapSafe**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:199](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L199)

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

0.14.0
