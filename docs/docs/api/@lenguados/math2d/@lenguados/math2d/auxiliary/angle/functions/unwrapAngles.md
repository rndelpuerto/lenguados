# Function: unwrapAngles()

> **unwrapAngles**(`angles`, `reference?`): `number`[]

Defined in: [src/auxiliary/angle/unwrapping.ts:79](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/angle/unwrapping.ts#L79)

Unwraps a sequence of angles into a continuous series by
taking shortest-arc steps between consecutive elements.

## Parameters

### angles

`number`[]

Array of angles in radians

### reference?

`number`

Optional continuity reference for the first element

## Returns

`number`[]

New array of unwrapped angles (real-valued)

## Remarks

If `reference` is provided, the first element is chosen equivalent to `angles[0]`
but closest to `reference`.

Note: large real jumps (> PI) will still choose the shortest path and may not
reflect true multi-turn motion—this is by design for continuity.

## Throws

If input array contains holes (undefined values)

## Example

```typescript
unwrapAngles([0, 3, -3, 0]); // [0, 3, 3.28..., 6.28...]
unwrapAngles([0, Math.PI, 0]); // [0, Math.PI, 2 * Math.PI] (continuous CCW)
unwrapAngles([0, 3, 6], -2 * Math.PI); // [-6.28..., -3.28..., -0.28...]
```

## Since

0.7.0
