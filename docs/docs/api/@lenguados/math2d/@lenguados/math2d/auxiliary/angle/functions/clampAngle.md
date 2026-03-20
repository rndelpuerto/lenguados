# Function: clampAngle()

> **clampAngle**(`angle`, `min`, `max`): `number`

Defined in: [src/auxiliary/angle/operations.ts:255](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/operations.ts#L255)

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

Clamped angle in [-PI, PI) range

## Remarks

Clamps to the nearest boundary of the shortest arc between min and max.

## Example

```typescript
clampAngle(Math.PI / 4, 0, Math.PI / 2); // Math.PI / 4 (within range)
clampAngle(-Math.PI / 4, 0, Math.PI / 2); // 0 (clamped to min)
clampAngle(Math.PI, 0, Math.PI / 2); // Math.PI / 2 (clamped to max)
```

## Since

0.7.0
