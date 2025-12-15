# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:216](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L216)

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
pingPong(3, 0, 2);    // 1 (bounces back from 2)
pingPong(5, 0, 2);    // 1 (continues bouncing)
pingPong(-1, 0, 2);   // 1 (bounces from 0)
```

## Since

1.0.0
