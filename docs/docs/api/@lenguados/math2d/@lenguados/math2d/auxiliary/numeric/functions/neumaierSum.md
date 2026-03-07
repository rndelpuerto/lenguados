# Function: neumaierSum()

> **neumaierSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:213](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L213)

Neumaier summation - improved Kahan algorithm.
Even more robust for values of varying magnitudes.

## Parameters

### values

`number`[]

Array of numbers to sum.

## Returns

`number`

Sum with minimized error.

## Example

```typescript
neumaierSum([1e10, 1, -1e10]); // 1 (exact)
// Naive sum might give 0 due to rounding
```

## Since

0.7.0
