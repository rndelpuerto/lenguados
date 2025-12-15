# Function: reflectAngle()

> **reflectAngle**(`angle`, `axis`): `number`

Defined in: [src/auxiliary/angle/operations.ts:316](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L316)

Reflects angle across axis.

## Parameters

### angle

`number`

Angle to reflect.

### axis

`number`

Axis of reflection.

## Returns

`number`

Reflected angle.

## Example

```typescript
reflectAngle(Math.PI / 4, 0); // -Math.PI / 4 (reflect across x-axis)
reflectAngle(Math.PI / 4, Math.PI / 2); // 3 * Math.PI / 4 (reflect across y-axis)
reflectAngle(0, Math.PI / 4); // Math.PI / 2
```

## Since

1.0.0
