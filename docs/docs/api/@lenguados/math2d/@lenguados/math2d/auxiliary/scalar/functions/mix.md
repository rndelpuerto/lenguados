# Function: mix()

> **mix**(`x`, `y`, `a`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:272](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L272)

Mix of two values (alias for lerp with better GPU shader compatibility).

## Parameters

### x

`number`

Start value

### y

`number`

End value

### a

`number`

Mix factor [0, 1]

## Returns

`number`

Mixed value

## Example

```typescript
mix(0, 10, 0.5);     // 5
mix(0, 10, 0);       // 0
mix(0, 10, 1);       // 10
```

## Since

1.0.0
