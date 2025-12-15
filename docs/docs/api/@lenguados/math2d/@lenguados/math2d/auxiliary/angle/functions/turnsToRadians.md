# Function: turnsToRadians()

> **turnsToRadians**(`turns`): `number`

Defined in: [src/auxiliary/angle/conversion.ts:63](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/conversion.ts#L63)

Converts turns to radians (1 turn = TAU radians = 2π radians).

## Parameters

### turns

`number`

Number of turns

## Returns

`number`

Angle in radians

## Example

```typescript
turnsToRadians(1);      // 2 * Math.PI
turnsToRadians(0.5);    // Math.PI
turnsToRadians(0.25);   // Math.PI / 2
turnsToRadians(2);      // 4 * Math.PI
```

## Since

1.0.0
