# Variable: EPSILON

> `const` **EPSILON**: `1e-10` = `1e-10`

Defined in: [src/auxiliary/scalar/constants.ts:27](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/scalar/constants.ts#L27)

Default epsilon for floating-point comparisons.

## Remarks

This value (1e-10) provides a good balance between:

- Precision: Can distinguish values differing by more than 1e-10
- Robustness: Absorbs typical floating-point rounding errors

For physics simulations, this is sufficient for most 2D calculations.
Consider using relative tolerance (relativeEquals) for values with
widely varying magnitudes.

## Constant

## Since

0.5.0
