# Function: normalizeRadiansAround()

> **normalizeRadiansAround**(`radians`, `center`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:71](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/normalization.ts#L71)

Normalizes to arbitrary center ± π.
Useful for continuous rotation.

## Parameters

### radians

`number`

Angle in radians.

### center

`number`

Center angle.

## Returns

`number`

Angle equivalent to radians and closest to center.

## Example

```typescript
normalizeRadiansAround(3 * Math.PI, 0); // -Math.PI
normalizeRadiansAround(Math.PI / 2, Math.PI); // Math.PI / 2
normalizeRadiansAround(0, Math.PI); // 2 * Math.PI
```

## Since

0.7.0
