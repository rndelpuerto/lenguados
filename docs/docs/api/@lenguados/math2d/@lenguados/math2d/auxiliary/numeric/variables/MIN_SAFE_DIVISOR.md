# Variable: MIN_SAFE_DIVISOR

> `const` **MIN_SAFE_DIVISOR**: `1e-10` = `EPSILON`

Defined in: [src/auxiliary/numeric/safety.ts:31](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L31)

Minimum safe value for division operations.
Below this value, division results may be unreliable.

## Remarks

Uses the same EPSILON (1e-10) as isNearZero for consistency.
This ensures that `safeDivide` and `isNearZero` have coherent behavior.

## Constant

## Since

0.7.0
