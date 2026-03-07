# Variable: EPSILON

> `const` **EPSILON**: `1e-10` = `1e-10`

Defined in: [src/auxiliary/scalar/constants.ts:27](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/constants.ts#L27)

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

0.7.0
