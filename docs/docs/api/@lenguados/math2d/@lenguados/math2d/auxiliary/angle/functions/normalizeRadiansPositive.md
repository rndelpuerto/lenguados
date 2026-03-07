# Function: normalizeRadiansPositive()

> **normalizeRadiansPositive**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:50](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/normalization.ts#L50)

Normalizes an angle to [0, TAU) range.
Useful for progress, winding calculations.

## Parameters

### radians

`number`

Angle in radians.

## Returns

`number`

Normalized angle in [0, TAU).

## Example

```typescript
normalizeRadiansPositive(0); // 0
normalizeRadiansPositive(Math.PI); // Math.PI
normalizeRadiansPositive(-Math.PI); // Math.PI
normalizeRadiansPositive(3 * Math.PI); // Math.PI
normalizeRadiansPositive(2 * Math.PI); // 0
```

## Since

0.7.0
