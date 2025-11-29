# Function: normalizeDegreesPositive()

> **normalizeDegreesPositive**(`degrees`): `number`

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

1.0.0
