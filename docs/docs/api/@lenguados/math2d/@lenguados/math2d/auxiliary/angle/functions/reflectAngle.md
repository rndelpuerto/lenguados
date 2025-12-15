# Function: reflectAngle()

> **reflectAngle**(`angle`, `axis`): `number`

Defined in: [src/auxiliary/angle/operations.ts:313](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L313)

Reflects angle across axis.

## Parameters

### angle

`number`

Angle to reflect

### axis

`number`

Axis of reflection

## Returns

`number`

Reflected angle

## Example

```typescript
reflectAngle(Math.PI / 4, 0);           // -Math.PI / 4 (reflect across x-axis)
reflectAngle(Math.PI / 4, Math.PI / 2); // 3 * Math.PI / 4 (reflect across y-axis)
reflectAngle(0, Math.PI / 4);           // Math.PI / 2
```

## Since

1.0.0
