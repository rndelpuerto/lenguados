# Function: roundToPlaces()

> **roundToPlaces**(`value`, `places`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:52](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/rounding.ts#L52)

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
roundToPlaces(3.14159, 2);     // 3.14
roundToPlaces(3.14159, 4);     // 3.1416
roundToPlaces(1234.5, -2);     // 1200 (round to hundreds)
```

## Since

1.0.0
