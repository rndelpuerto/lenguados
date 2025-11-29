# Function: roundToInt()

> **roundToInt**(`value`): `number`

Rounds to nearest integer.
Uses banker's rounding (round half to even).

## Parameters

### value

`number`

Value to round

## Returns

`number`

Rounded integer

## Remarks

Banker's rounding reduces bias in repeated operations by
rounding 0.5 to the nearest even number.

## Example

```typescript
roundToInt(3.2); // 3
roundToInt(3.7); // 4
roundToInt(3.5); // 4 (rounds to even)
roundToInt(4.5); // 4 (rounds to even)
roundToInt(-2.5); // -2 (rounds to even)
```

## Since

1.0.0
