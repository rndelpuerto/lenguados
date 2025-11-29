# Function: radiansToTurns()

> **radiansToTurns**(`radians`): `number`

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

1.0.0
