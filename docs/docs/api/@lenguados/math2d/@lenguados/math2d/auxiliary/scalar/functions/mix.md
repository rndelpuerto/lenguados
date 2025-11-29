# Function: mix()

> **mix**(`x`, `y`, `a`): `number`

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
mix(0, 10, 0.5); // 5
mix(0, 10, 0); // 0
mix(0, 10, 1); // 10
```

## Since

1.0.0
