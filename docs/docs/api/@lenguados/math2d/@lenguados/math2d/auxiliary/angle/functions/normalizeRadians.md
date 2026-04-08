# Function: normalizeRadians()

> **normalizeRadians**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:39](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/normalization.ts#L39)

Normalizes an angle to (-PI, PI] range.
Standard signed angle representation matching the mathematical
principal argument Arg(z) and IEEE 754 atan2 output convention.

## Parameters

### radians

`number`

Angle in radians

## Returns

`number`

Normalized angle in (-PI, PI]

## Remarks

Uses (-PI, PI] (PI included, -PI excluded) — the convention used by
IEEE 754 atan2, C standard, MATLAB wrapToPi, Unity, Box2D, and Bullet Physics.
This ensures `normalizeRadians(Math.atan2(y, x)) === Math.atan2(y, x)`.

For very large angles (>1e6 radians), floating-point precision loss in
the modulo operation may produce results that deviate from the
mathematically correct normalized value.

## Example

```typescript
normalizeRadians(0); // 0
normalizeRadians(Math.PI); // Math.PI (PI is included)
normalizeRadians(-Math.PI); // Math.PI (-PI maps to PI)
normalizeRadians(3 * Math.PI); // Math.PI
normalizeRadians(2 * Math.PI); // 0
```

## Since

0.7.0
