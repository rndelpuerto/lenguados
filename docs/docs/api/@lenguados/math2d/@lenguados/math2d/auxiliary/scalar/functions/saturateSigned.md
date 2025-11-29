# Function: saturateSigned()

> **saturateSigned**(`value`): `number`

Saturates value to [-1, 1] range.
Useful for normalized directions.

## Parameters

### value

`number`

Value to saturate

## Returns

`number`

Saturated value in [-1, 1]

## Example

```typescript
saturateSigned(-2); // -1
saturateSigned(0.5); // 0.5
saturateSigned(2); // 1
```

## Since

1.0.0
