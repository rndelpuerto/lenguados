# Function: normalizeDegrees()

> **normalizeDegrees**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:92](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/normalization.ts#L92)

Normalizes degrees to [-180, 180).

## Parameters

### degrees

`number`

Angle in degrees.

## Returns

`number`

Normalized angle in [-180, 180).

## Example

```typescript
normalizeDegrees(0); // 0
normalizeDegrees(180); // -180 (range is [-180, 180))
normalizeDegrees(-180); // -180
normalizeDegrees(360); // 0
normalizeDegrees(540); // -180
```

## Since

0.7.0
