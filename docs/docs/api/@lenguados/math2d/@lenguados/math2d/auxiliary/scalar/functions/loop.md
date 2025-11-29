# Function: loop()

> **loop**(`value`, `min`, `max`): `number`

Loops value into [min, max) range.
Unlike clamp, wraps around.

## Parameters

### value

`number`

Value to wrap

### min

`number`

Lower bound (inclusive)

### max

`number`

Upper bound (exclusive)

## Returns

`number`

Wrapped value

## Example

```typescript
loop(-1, 0, 10); // 9
loop(10, 0, 10); // 0
loop(15, 0, 10); // 5
```

## Since

1.0.0
