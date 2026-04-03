# Function: roundToPlaces()

> **roundToPlaces**(`value`, `places`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:76](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/rounding.ts#L76)

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

## Remarks

Uses the standard `Math.round(value * 10^places) / 10^places` approach.
Due to IEEE 754 binary floating-point representation, some decimal values
cannot be represented exactly. For example, `1.005` is stored as
`1.00499999999999989...`, so `roundToPlaces(1.005, 2)` returns `1.0`
rather than `1.01`. This is inherent to all multiply-round-divide
approaches in binary floating-point arithmetic.

For extreme places values (>308), 10\*\*places overflows to Infinity,
causing the result to be NaN.

## Example

```typescript
roundToPlaces(3.14159, 2); // 3.14
roundToPlaces(3.14159, 4); // 3.1416
roundToPlaces(1234.5, -2); // 1200 (round to hundreds)
```

## Since

0.7.0
