# Function: radiansToTurns()

> **radiansToTurns**(`radians`): `number`

Defined in: [src/auxiliary/angle/conversion.ts:83](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/angle/conversion.ts#L83)

Converts radians to turns (1 turn = TAU radians = 2π radians).

## Parameters

### radians

`number`

Angle in radians

## Returns

`number`

Number of turns

## Example

```typescript
radiansToTurns(2 * Math.PI); // 1
radiansToTurns(Math.PI); // 0.5
radiansToTurns(Math.PI / 2); // 0.25
radiansToTurns(4 * Math.PI); // 2
```

## Since

0.7.0
