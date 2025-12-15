# Variable: ITERATIVE_TOLERANCE

> `const` **ITERATIVE_TOLERANCE**: `0.000001` = `1e-6`

Defined in: [src/auxiliary/scalar/constants.ts:54](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/constants.ts#L54)

Tolerance for iterative angle algorithms.

## Remarks

Used in iterative angle operations (like constraint solving) where
a looser tolerance than EPSILON is acceptable for convergence.
Value of 1e-6 provides good balance between precision and performance.

## Constant

## Since

0.14.0
