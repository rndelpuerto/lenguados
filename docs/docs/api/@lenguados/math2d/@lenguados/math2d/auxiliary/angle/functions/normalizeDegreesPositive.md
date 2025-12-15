# Function: normalizeDegreesPositive()

> **normalizeDegreesPositive**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:113](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/normalization.ts#L113)

Normalizes degrees to [0, 360).

## Parameters

### degrees

`number`

Angle in degrees

## Returns

`number`

Normalized angle in [0, 360)

## Example

```typescript
normalizeDegreesPositive(0);      // 0
normalizeDegreesPositive(180);    // 180
normalizeDegreesPositive(-180);   // 180
normalizeDegreesPositive(360);    // 0
normalizeDegreesPositive(540);    // 180
```

## Since

1.0.0
