# Function: greaterThan()

> **greaterThan**(`a`, `b`, `epsilon`): `boolean`

Tests if a > b with epsilon tolerance.
Returns true if a > b + epsilon.

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

True if a is greater than b beyond tolerance

## Example

```typescript
greaterThan(2.0, 1.0); // true
greaterThan(2.0, 1.9999999999); // false (within epsilon)
greaterThan(2.0, 1.99, 0.1); // false (within custom epsilon)
```

## Since

1.0.0
