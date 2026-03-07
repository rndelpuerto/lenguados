# Function: roundToInt()

> **roundToInt**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:32](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/rounding.ts#L32)

Rounds to nearest integer.
Uses banker's rounding (round half to even).

## Parameters

### value

`number`

Value to round.

## Returns

`number`

Rounded integer.

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

0.7.0
