# Function: clampAngle()

> **clampAngle**(`angle`, `min`, `max`): `number`

Defined in: [src/auxiliary/angle/operations.ts:278](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L278)

Clamps angle to arc between min and max.

## Parameters

### angle

`number`

Angle to clamp

### min

`number`

Minimum angle

### max

`number`

Maximum angle

## Returns

`number`

Clamped angle

## Remarks

Clamps to the nearest boundary of the shortest arc between min and max.

## Example

```typescript
clampAngle(Math.PI / 4, 0, Math.PI / 2);      // Math.PI / 4 (within range)
clampAngle(-Math.PI / 4, 0, Math.PI / 2);     // 0 (clamped to min)
clampAngle(Math.PI, 0, Math.PI / 2);          // Math.PI / 2 (clamped to max)
```

## Since

1.0.0
