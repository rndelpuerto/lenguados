# Function: safeLerp()

> **safeLerp**(`a`, `b`, `t`): `number`

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
