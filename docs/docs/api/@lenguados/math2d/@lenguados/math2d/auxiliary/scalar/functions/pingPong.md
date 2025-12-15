# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:300](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L300)

Ping-pongs value in [min, max] range (strict).

## Parameters

### value

`number`

Value to ping-pong.

### min

`number`

Lower bound.

### max

`number`

Upper bound.

## Returns

`number`

Ping-ponged value.

## Throws

If range is invalid (max <= min).

## See

- [pingPongSafe](pingPongSafe.md) - Returns min if invalid
- [pingPongUnchecked](pingPongUnchecked.md) - No validation

## Example

```typescript
pingPong(3, 0, 2); // 1 (bounces back from 2)
pingPong(5, 0, 2); // 1 (continues bouncing)
```

## Since

1.0.0
