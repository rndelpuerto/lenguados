# Function: normalizeDegreesPositive()

> **normalizeDegreesPositive**(`degrees`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:105](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/normalization.ts#L105)

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
