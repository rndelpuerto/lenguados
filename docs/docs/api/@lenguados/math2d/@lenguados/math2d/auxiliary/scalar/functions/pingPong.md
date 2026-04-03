# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:275](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L275)

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
