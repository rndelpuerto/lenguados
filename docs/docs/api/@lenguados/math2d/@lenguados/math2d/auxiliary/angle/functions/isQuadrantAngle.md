# Function: isQuadrantAngle()

> **isQuadrantAngle**(`radians`, `epsilon`): `boolean`

Defined in: [src/auxiliary/angle/operations.ts:469](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L469)

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
isQuadrantAngle(0);                   // true
isQuadrantAngle(Math.PI / 2);         // true
isQuadrantAngle(Math.PI);             // true
isQuadrantAngle(Math.PI / 4);         // false
```

## Since

1.0.0
