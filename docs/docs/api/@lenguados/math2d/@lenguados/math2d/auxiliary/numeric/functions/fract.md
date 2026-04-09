# Function: fract()

> **fract**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:230](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/rounding.ts#L230)

Gets fractional part.

## Parameters

### value

`number`

Value to get fraction from

## Returns

`number`

Fractional part (always positive)

## Remarks

Returns NaN for non-finite inputs (NaN, ±Infinity) because
`Math.floor` returns ±Infinity for ±Infinity and NaN for NaN.

## Example

```typescript
fract(3.7); // 0.7
fract(3.2); // 0.2
fract(-3.7); // 0.3
fract(-3.2); // 0.8
fract(5); // 0
```

## Since

0.7.0
