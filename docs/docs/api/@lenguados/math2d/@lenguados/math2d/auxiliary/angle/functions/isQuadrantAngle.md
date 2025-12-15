# Function: isQuadrantAngle()

> **isQuadrantAngle**(`radians`, `epsilon`): `boolean`

Defined in: [src/auxiliary/angle/operations.ts:472](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L472)

Tests if an angle represents a quadrant boundary (0, 90, 180, or 270 degrees).

## Parameters

### radians

`number`

Angle in radians.

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

## Returns

`boolean`

True if angle is near a quadrant boundary.

## Example

```typescript
isQuadrantAngle(0); // true
isQuadrantAngle(Math.PI / 2); // true
isQuadrantAngle(Math.PI); // true
isQuadrantAngle(Math.PI / 4); // false
```

## Since

1.0.0
