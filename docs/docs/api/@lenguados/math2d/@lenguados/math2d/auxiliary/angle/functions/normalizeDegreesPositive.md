# Function: normalizeDegreesPositive()

> **normalizeDegreesPositive**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:98](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/normalization.ts#L98)

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
normalizeDegreesPositive(0); // 0
normalizeDegreesPositive(180); // 180
normalizeDegreesPositive(-180); // 180
normalizeDegreesPositive(360); // 0
normalizeDegreesPositive(540); // 180
```

## Since

0.7.0
