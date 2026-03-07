# Function: pingPong()

> **pingPong**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:252](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L252)

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

0.7.0
