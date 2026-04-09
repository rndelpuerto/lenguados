# Variable: MIN_SAFE_DIVISOR

> `const` **MIN_SAFE_DIVISOR**: `1e-10` = `1e-10`

Defined in: [src/auxiliary/numeric/safety.ts:39](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L39)

Minimum safe value for division operations.
Below this value, division results may produce numerically degenerate outputs
in geometric contexts (normalization, inverse, projection).

## Remarks

Independently defined at `1e-10`. This value matches EPSILON by design
because both represent the application-level threshold below which quantities
are geometrically insignificant for a 2D physics engine. However, they are
separate constants serving different purposes:

- `EPSILON`: geometric comparison tolerance ("are these values approximately equal?")
- `MIN_SAFE_DIVISOR`: division safety threshold ("will dividing by this produce garbage?")

Common values in game engines and graphics libraries range from `1e-8` to
`~1.19e-7` (float32 epsilon). Our value of `1e-10` is more conservative,
appropriate for double-precision arithmetic.

## Constant

## Since

0.7.0
