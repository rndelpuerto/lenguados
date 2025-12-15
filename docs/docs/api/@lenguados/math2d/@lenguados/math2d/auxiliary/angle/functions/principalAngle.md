# Function: principalAngle()

> **principalAngle**(`angles`): `number`

Defined in: [src/auxiliary/angle/operations.ts:398](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L398)

Finds the principal angle from a set of angles.
The angle that minimizes total angular distance to all others.

## Parameters

### angles

`number`[]

Array of angles in radians

## Returns

`number`

Principal angle

## Example

```typescript
principalAngle([0, Math.PI / 4, Math.PI / 2]);       // Math.PI / 4 (middle)
principalAngle([-Math.PI, Math.PI]);                  // Math.PI (same angle)
```

## Since

1.0.0
