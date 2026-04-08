# Function: lerpSafe()

> **lerpSafe**(`a`, `b`, `t`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:424](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L424)

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
