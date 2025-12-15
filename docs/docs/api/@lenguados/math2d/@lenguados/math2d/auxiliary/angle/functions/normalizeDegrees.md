# Function: normalizeDegrees()

> **normalizeDegrees**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:92](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/normalization.ts#L92)

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
normalizeDegrees(0);      // 0
normalizeDegrees(180);    // 180
normalizeDegrees(-180);   // -180
normalizeDegrees(360);    // 0
normalizeDegrees(540);    // -180
```

## Since

1.0.0
