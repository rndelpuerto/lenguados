# Function: principalAngle()

> **principalAngle**(`angles`): `number`

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
principalAngle([0, Math.PI / 4, Math.PI / 2]); // Math.PI / 4 (middle)
principalAngle([-Math.PI, Math.PI]); // Math.PI (same angle)
```

## Since

1.0.0
