# Function: pingPongSafe()

> **pingPongSafe**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:304](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L304)

Ping-pongs value in [min, max] range (safe).

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

Ping-ponged value, or min if range is invalid

## Example

```typescript
pingPongSafe(3, 0, 2); // 1
pingPongSafe(5, 5, 5); // 5 (return min)
```

## See

[pingPong](pingPong.md) — Throws for invalid range

## Since

0.7.0
