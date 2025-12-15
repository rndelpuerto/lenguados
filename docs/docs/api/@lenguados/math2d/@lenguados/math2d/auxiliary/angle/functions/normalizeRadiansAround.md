# Function: normalizeRadiansAround()

> **normalizeRadiansAround**(`radians`, `center`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:71](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/normalization.ts#L71)

Normalizes to arbitrary center ± π.
Useful for continuous rotation.

## Parameters

### radians

`number`

Angle in radians.

### center

`number`

Center angle.

## Returns

`number`

Angle equivalent to radians and closest to center.

## Example

```typescript
normalizeRadiansAround(3 * Math.PI, 0); // -Math.PI
normalizeRadiansAround(Math.PI / 2, Math.PI); // Math.PI / 2
normalizeRadiansAround(0, Math.PI); // 2 * Math.PI
```

## Since

1.0.0
