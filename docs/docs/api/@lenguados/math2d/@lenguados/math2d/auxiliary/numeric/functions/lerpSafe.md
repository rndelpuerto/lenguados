# Function: lerpSafe()

> **lerpSafe**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:425](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L425)

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

## See

lerp — standard interpolation (in `auxiliary/scalar/interpolation.ts`)

## Since

0.7.0
