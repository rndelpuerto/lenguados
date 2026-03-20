# Function: normalizeDegrees()

> **normalizeDegrees**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:77](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/normalization.ts#L77)

Normalizes degrees to [-180, 180).

## Parameters

### degrees

`number`

Angle in degrees

## Returns

`number`

Normalized angle in [-180, 180)

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
