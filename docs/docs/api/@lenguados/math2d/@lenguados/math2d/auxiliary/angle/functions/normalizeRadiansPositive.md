# Function: normalizeRadiansPositive()

> **normalizeRadiansPositive**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:62](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/normalization.ts#L62)

Normalizes an angle to [0, TAU) range.
Useful for progress, winding calculations.

## Parameters

### radians

`number`

Angle in radians

## Returns

`number`

Normalized angle in [0, TAU)

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
