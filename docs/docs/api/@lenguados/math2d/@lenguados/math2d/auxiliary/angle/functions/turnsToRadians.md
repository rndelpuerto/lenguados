# Function: turnsToRadians()

> **turnsToRadians**(`turns`): `number`

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
turnsToRadians(1); // 2 * Math.PI
turnsToRadians(0.5); // Math.PI
turnsToRadians(0.25); // Math.PI / 2
turnsToRadians(2); // 4 * Math.PI
```

## Since

1.0.0
