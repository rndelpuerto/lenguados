# Function: normalizeDegrees()

> **normalizeDegrees**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:83](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/normalization.ts#L83)

Normalizes degrees to (-180, 180].

## Parameters

### degrees

`number`

Angle in degrees

## Returns

`number`

Normalized angle in (-180, 180]

## Example

```typescript
normalizeDegrees(0); // 0
normalizeDegrees(180); // 180 (180 is included)
normalizeDegrees(-180); // 180 (-180 maps to 180)
normalizeDegrees(360); // 0
normalizeDegrees(540); // 180
```

## Since

0.7.0
