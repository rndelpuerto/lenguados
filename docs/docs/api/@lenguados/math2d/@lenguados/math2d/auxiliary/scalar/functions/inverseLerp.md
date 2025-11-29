# Function: inverseLerp()

> **inverseLerp**(`a`, `b`, `value`): `number`

Inverse linear interpolation.
Returns t such that lerp(a, b, t) = value.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### value

`number`

Value to find t for

## Returns

`number`

Interpolation factor t

## Example

```typescript
inverseLerp(0, 10, 5); // 0.5
inverseLerp(0, 10, 0); // 0
inverseLerp(0, 10, 10); // 1
inverseLerp(0, 10, 20); // 2 (extrapolation)
```

## Since

1.0.0
