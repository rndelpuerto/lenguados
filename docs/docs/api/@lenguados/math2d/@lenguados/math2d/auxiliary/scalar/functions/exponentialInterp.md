# Function: exponentialInterp()

> **exponentialInterp**(`a`, `b`, `t`, `power`): `number`

Exponential interpolation.
Useful for zoom, scale animations.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor [0, 1]

### power

`number` = `2`

Exponential power (default: 2)

## Returns

`number`

Interpolated value

## Example

```typescript
exponentialInterp(0, 100, 0.5, 2); // 25 (quadratic ease-in)
exponentialInterp(0, 100, 0.5, 3); // 12.5 (cubic ease-in)
```

## Since

1.0.0
