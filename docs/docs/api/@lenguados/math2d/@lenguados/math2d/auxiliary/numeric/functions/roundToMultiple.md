# Function: roundToMultiple()

> **roundToMultiple**(`value`, `multiple`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:85](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/rounding.ts#L85)

Rounds to nearest multiple.

## Parameters

### value

`number`

Value to round.

### multiple

`number`

Multiple to round to.

## Returns

`number`

Rounded value.

## Example

```typescript
roundToMultiple(7, 5); // 5
roundToMultiple(8, 5); // 10
roundToMultiple(23, 10); // 20
roundToMultiple(1.7, 0.5); // 1.5
```

## Since

0.7.0
