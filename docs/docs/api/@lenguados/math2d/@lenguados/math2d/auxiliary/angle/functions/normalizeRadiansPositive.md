# Function: normalizeRadiansPositive()

> **normalizeRadiansPositive**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:50](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/normalization.ts#L50)

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
normalizeRadiansPositive(0);              // 0
normalizeRadiansPositive(Math.PI);        // Math.PI
normalizeRadiansPositive(-Math.PI);       // Math.PI
normalizeRadiansPositive(3 * Math.PI);    // Math.PI
normalizeRadiansPositive(2 * Math.PI);    // 0
```

## Since

1.0.0
