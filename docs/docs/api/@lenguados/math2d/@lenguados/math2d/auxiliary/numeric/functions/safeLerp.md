# Function: safeLerp()

> **safeLerp**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:341](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L341)

Safe linear interpolation that avoids overflow.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor

## Returns

`number`

Interpolated value

## Example

```typescript
// Avoids overflow for large values
safeLerp(1e308, 2e308, 0.5); // 1.5e308
// Normal lerp might overflow
```

## Since

1.0.0
