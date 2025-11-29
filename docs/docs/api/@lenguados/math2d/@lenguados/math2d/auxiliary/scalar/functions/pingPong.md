# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Ping-pongs value in [min, max] range.
Bounces back and forth instead of wrapping.

## Parameters

### value

`number`

Value to ping-pong

### min

`number`

Lower bound

### max

`number`

Upper bound

## Returns

`number`

Ping-ponged value

## Example

```typescript
pingPong(3, 0, 2); // 1 (bounces back from 2)
pingPong(5, 0, 2); // 1 (continues bouncing)
pingPong(-1, 0, 2); // 1 (bounces from 0)
```

## Since

1.0.0
