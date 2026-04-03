# Variable: MIN_SAFE_DIVISOR

> `const` **MIN_SAFE_DIVISOR**: `1e-10` = `1e-10`

Defined in: [src/auxiliary/numeric/safety.ts:38](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L38)

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

For reference, Unreal Engine uses `SMALL_NUMBER = 1e-8` for a similar role,
Ogre3D uses `1e-8`, and Box2D uses `FLT_EPSILON` (~1.19e-7, float32).
Our value of `1e-10` is more conservative, appropriate for double precision.

## Constant

## Since

0.7.0
