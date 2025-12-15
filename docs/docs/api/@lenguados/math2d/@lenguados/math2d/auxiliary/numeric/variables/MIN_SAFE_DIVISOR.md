# Variable: MIN_SAFE_DIVISOR

> `const` **MIN_SAFE_DIVISOR**: `1e-10` = `EPSILON`

Defined in: [src/auxiliary/numeric/safety.ts:34](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L34)

Minimum safe value for division operations.
Below this value, division results may be unreliable.

## Remarks

Uses the same EPSILON (1e-10) as isNearZero for consistency.
This ensures that `safeDivide` and `isNearZero` have coherent behavior.

## Constant

## Since

1.0.0
