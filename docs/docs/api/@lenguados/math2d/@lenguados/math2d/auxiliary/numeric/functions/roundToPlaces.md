# Function: roundToPlaces()

> **roundToPlaces**(`value`, `places`): `number`

Rounds to specific decimal places.

## Parameters

### value

`number`

Value to round

### places

`number`

Number of decimal places

## Returns

`number`

Rounded value

## Example

```typescript
roundToPlaces(3.14159, 2); // 3.14
roundToPlaces(3.14159, 4); // 3.1416
roundToPlaces(1234.5, -2); // 1200 (round to hundreds)
```

## Since

1.0.0
