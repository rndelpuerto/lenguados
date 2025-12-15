# Function: principalAngle()

> **principalAngle**(`angles`): `number`

Defined in: [src/auxiliary/angle/operations.ts:401](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L401)

Finds the principal angle from a set of angles.
The angle that minimizes total angular distance to all others.

## Parameters

### angles

`number`[]

Array of angles in radians.

## Returns

`number`

Principal angle.

## Example

```typescript
principalAngle([0, Math.PI / 4, Math.PI / 2]); // Math.PI / 4 (middle)
principalAngle([-Math.PI, Math.PI]); // Math.PI (same angle)
```

## Since

1.0.0
