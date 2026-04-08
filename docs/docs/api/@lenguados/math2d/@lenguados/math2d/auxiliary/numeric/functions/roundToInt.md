# Function: roundToInt()

> **roundToInt**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:33](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/rounding.ts#L33)

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

0.7.0
