# Function: radiansToGradians()

> **radiansToGradians**(`radians`): `number`

Defined in: [src/auxiliary/angle/conversion.ts:129](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/conversion.ts#L129)

Converts radians to gradians (400 gradians = 2π radians).
Also known as gon or grade.

## Parameters

### radians

`number`

Angle in radians.

## Returns

`number`

Angle in gradians.

## Example

```typescript
radiansToGradians(Math.PI); // 200
radiansToGradians(Math.PI / 2); // 100
radiansToGradians(2 * Math.PI); // 400
radiansToGradians(Math.PI / 4); // 50
```

## Since

1.0.0
