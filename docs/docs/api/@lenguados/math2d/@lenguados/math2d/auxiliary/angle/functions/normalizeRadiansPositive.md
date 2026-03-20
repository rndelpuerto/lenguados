# Function: normalizeRadiansPositive()

> **normalizeRadiansPositive**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:56](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/normalization.ts#L56)

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
