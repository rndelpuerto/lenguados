# Function: normalizeRadians()

> **normalizeRadians**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:28](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/normalization.ts#L28)

Normalizes an angle to [-PI, PI) range.
Standard signed angle representation.

## Parameters

### radians

`number`

Angle in radians.

## Returns

`number`

Normalized angle in [-PI, PI).

## Example

```typescript
normalizeRadians(0); // 0
normalizeRadians(Math.PI); // Math.PI
normalizeRadians(-Math.PI); // -Math.PI
normalizeRadians(3 * Math.PI); // -Math.PI
normalizeRadians(2 * Math.PI); // 0
```

## Since

1.0.0
