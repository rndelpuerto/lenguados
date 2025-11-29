# Function: normalizeRadians()

> **normalizeRadians**(`radians`): `number`

Normalizes an angle to [-PI, PI) range.
Standard signed angle representation.

## Parameters

### radians

`number`

Angle in radians

## Returns

`number`

Normalized angle in [-PI, PI)

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
