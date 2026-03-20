# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:272](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L272)

Ping-pongs value in [min, max] range (strict).

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

## Throws

If range is invalid (max <= min)

## Example

```typescript
pingPong(3, 0, 2); // 1 (bounces back from 2)
pingPong(5, 0, 2); // 1 (continues bouncing)
```

## See

- [pingPongSafe](pingPongSafe.md) - Returns min if invalid
- [pingPongUnchecked](pingPongUnchecked.md) - No validation

## Since

0.7.0
