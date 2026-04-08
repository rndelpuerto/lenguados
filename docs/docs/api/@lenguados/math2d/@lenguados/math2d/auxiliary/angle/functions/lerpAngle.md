# Function: lerpAngle()

> **lerpAngle**(`from`, `to`, `t`): `number`

Defined in: [src/auxiliary/angle/interpolation.ts:34](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/interpolation.ts#L34)

Interpolates between angles using shortest path.

## Parameters

### from

`number`

Start angle in radians

### to

`number`

End angle in radians

### t

`number`

Interpolation factor [0, 1]

## Returns

`number`

Interpolated angle

## Remarks

Works for any real t (not only [0, 1]). Extrapolation continues
linearly in angle space and may produce values outside (-PI, PI].

## Example

```typescript
lerpAngle(0, Math.PI / 2, 0.5); // Math.PI / 4
lerpAngle(0, (3 * Math.PI) / 2, 0.5); // -Math.PI / 4 (short path)
lerpAngle(-Math.PI, Math.PI, 0.5); // -Math.PI (angles are equivalent, no arc to traverse)
```

## Since

0.7.0
