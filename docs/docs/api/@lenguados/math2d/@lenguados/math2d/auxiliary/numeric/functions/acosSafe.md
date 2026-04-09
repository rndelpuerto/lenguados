# Function: acosSafe()

> **acosSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:136](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L136)

Safe deterministic arc cosine (clamps input to [-1, 1]).

## Parameters

### x

`number`

Any value (will be clamped to [-1, 1])

## Returns

`number`

acos(clamp(x, -1, 1))

## Remarks

Uses deterministic math for cross-platform reproducibility.
Returns PI for x <= -1, 0 for x >= 1, deterministic acos(x) otherwise.

## See

[acos](../../../deterministic/functions/acos.md) from deterministic-kernels — returns NaN for out-of-range inputs

## Since

0.7.0
