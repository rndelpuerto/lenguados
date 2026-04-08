# Function: asinSafe()

> **asinSafe**(`x`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:157](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L157)

Safe deterministic arc sine (clamps input to [-1, 1]).

## Parameters

### x

`number`

Any value (will be clamped to [-1, 1])

## Returns

`number`

asin(clamp(x, -1, 1))

## Remarks

Uses deterministic math for cross-platform reproducibility.
Returns -PI/2 for x <= -1, PI/2 for x >= 1, deterministic asin(x) otherwise.

## See

[asin](../../../deterministic/functions/asin.md) from deterministic-kernels — returns NaN for out-of-range inputs

## Since

0.7.0
