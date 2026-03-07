# Function: smoothStep()

> **smoothStep**(`edge0`, `edge1`, `x`): `number`

Defined in: [src/auxiliary/scalar/interpolation.ts:153](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/interpolation.ts#L153)

Cubic Hermite interpolation (smooth step).
Maps [edge0, edge1] to [0, 1] with smooth curve.

## Parameters

### edge0

`number`

Lower edge.

### edge1

`number`

Upper edge.

### x

`number`

Input value.

## Returns

`number`

Result in [0, 1].

## Remarks

Produces a smooth transition with zero derivatives at the boundaries.
Typically used for eased interpolation between 0 and 1.

## Example

```typescript
smoothStep(0, 1, 0.5); // 0.5
smoothStep(0, 10, 5); // 0.5
smoothStep(0, 10, -5); // 0 (clamped)
smoothStep(0, 10, 15); // 1 (clamped)
```

## Since

0.7.0
