# Function: lerpSafe()

> **lerpSafe**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:362](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/safety.ts#L362)

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
lerpSafe(1e308, 2e308, 0.5); // 1.5e308
// Normal lerp might overflow
```

## Since

0.7.0
