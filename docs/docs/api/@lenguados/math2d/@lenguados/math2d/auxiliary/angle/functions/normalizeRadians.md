# Function: normalizeRadians()

> **normalizeRadians**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:28](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/normalization.ts#L28)

Normalizes an angle to [-PI, PI) range.
Standard signed angle representation.

## Parameters

### radians

`number`

Angle in radians.

## Returns

`number`

Normalized angle in [-PI, PI).

## Example

```typescript
normalizeRadians(0); // 0
normalizeRadians(Math.PI); // -Math.PI (range is [-PI, PI))
normalizeRadians(-Math.PI); // -Math.PI
normalizeRadians(3 * Math.PI); // -Math.PI
normalizeRadians(2 * Math.PI); // 0
```

## Since

0.7.0
