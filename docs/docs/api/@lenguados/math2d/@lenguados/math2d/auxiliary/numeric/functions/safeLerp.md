# Function: safeLerp()

> **safeLerp**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:298](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L298)

Safe linear interpolation that avoids overflow.

## Parameters

### a

`number`

Start value.

### b

`number`

End value.

### t

`number`

Interpolation factor.

## Returns

`number`

Interpolated value.

## Example

```typescript
// Avoids overflow for large values
safeLerp(1e308, 2e308, 0.5); // 1.5e308
// Normal lerp might overflow
```

## Since

0.7.0
