# Function: roundToPlaces()

> **roundToPlaces**(`value`, `places`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:64](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/rounding.ts#L64)

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

0.7.0
