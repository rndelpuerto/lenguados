# Function: isQuadrantAngle()

> **isQuadrantAngle**(`radians`, `epsilon`): `boolean`

Tests if an angle represents a quadrant boundary (0, 90, 180, or 270 degrees).

## Parameters

### radians

`number`

Angle in radians

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if angle is near a quadrant boundary

## Example

```typescript
isQuadrantAngle(0); // true
isQuadrantAngle(Math.PI / 2); // true
isQuadrantAngle(Math.PI); // true
isQuadrantAngle(Math.PI / 4); // false
```

## Since

1.0.0
