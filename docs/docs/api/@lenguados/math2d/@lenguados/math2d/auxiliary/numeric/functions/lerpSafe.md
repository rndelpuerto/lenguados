# Function: lerpSafe()

> **lerpSafe**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:382](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L382)

Safe linear interpolation that avoids overflow.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor

## Returns

`number`

Interpolated value

## Remarks

The distributive form `a*(1-t) + b*t` trades strict monotonicity for
overflow safety. For inputs where `a` and `b` have the same sign and no
overflow risk, standard lerp (`a + (b-a)*t`)
preserves monotonicity.

## Example

```typescript
// Avoids overflow for large values
lerpSafe(1e308, 2e308, 0.5); // 1.5e308
// Normal lerp might overflow
```

## Since

0.7.0
