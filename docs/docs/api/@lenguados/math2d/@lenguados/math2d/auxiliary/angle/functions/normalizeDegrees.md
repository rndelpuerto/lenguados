# Function: normalizeDegrees()

> **normalizeDegrees**(`degrees`): `number`

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
normalizeDegrees(0); // 0
normalizeDegrees(180); // 180
normalizeDegrees(-180); // -180
normalizeDegrees(360); // 0
normalizeDegrees(540); // -180
```

## Since

1.0.0
