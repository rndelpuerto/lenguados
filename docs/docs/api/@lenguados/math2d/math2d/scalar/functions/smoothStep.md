# Function: smoothStep()

> **smoothStep**(`edge0`, `edge1`, `x`): `number`

Defined in: [src/scalar.ts:98](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/scalar.ts#L98)

Performs smoothstep interpolation between two edges.
Produces a smooth transition with zero derivatives at the boundaries.
Typically used for eased interpolation between 0 and 1.

## Parameters

### edge0

`number`

Lower edge of the interpolation.

### edge1

`number`

Upper edge of the interpolation.

### x

`number`

Value to interpolate.

## Returns

`number`

Result in [0, 1].

## Example

```ts
// Ease in/out from 0 at x = 0 to 1 at x = 1
smoothStep(0, 1, 0.5); // → 0.5
```
