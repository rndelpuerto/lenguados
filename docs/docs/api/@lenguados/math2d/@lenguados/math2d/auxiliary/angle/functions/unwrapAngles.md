# Function: unwrapAngles()

> **unwrapAngles**(`angles`, `reference?`): `number`[]

Defined in: [src/auxiliary/angle/unwrapping.ts:37](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/unwrapping.ts#L37)

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

## Example

```typescript
unwrapAngles([0, 3, -3, 0]);           // [0, 3, 3.28..., 6.28...]
unwrapAngles([0, Math.PI, 0]);         // [0, Math.PI, 2*Math.PI]
unwrapAngles([0, 3, 6], -Math.PI);     // [-6.28..., -3.28..., -0.28...]
```

## Throws

If input array contains holes (undefined values)

## Since

1.0.0
