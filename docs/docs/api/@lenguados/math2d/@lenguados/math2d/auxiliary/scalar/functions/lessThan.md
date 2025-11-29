# Function: lessThan()

> **lessThan**(`a`, `b`, `epsilon`): `boolean`

Tests if a < b with epsilon tolerance.
Returns true if a < b - epsilon.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if a is less than b beyond tolerance

## Example

```typescript
lessThan(1.0, 2.0); // true
lessThan(1.9999999999, 2.0); // false (within epsilon)
lessThan(1.99, 2.0, 0.1); // false (within custom epsilon)
```

## Since

1.0.0
