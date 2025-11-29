# Function: saturate()

> **saturate**(`value`): `number`

Saturates value to [0, 1] range.
Commonly used for colors, interpolation factors.

## Parameters

### value

`number`

Value to saturate

## Returns

`number`

Saturated value in [0, 1]

## Example

```typescript
saturate(-0.5); // 0
saturate(0.5); // 0.5
saturate(1.5); // 1
```

## Since

1.0.0
