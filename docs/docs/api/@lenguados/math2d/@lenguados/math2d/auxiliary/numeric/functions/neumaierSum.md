# Function: neumaierSum()

> **neumaierSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:271](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/safety.ts#L271)

Neumaier summation - improved Kahan algorithm.
Even more robust for values of varying magnitudes.

## Parameters

### values

readonly `number`[]

Array of numbers to sum

## Returns

`number`

Sum with minimized error

## Example

```typescript
neumaierSum([1e10, 1, -1e10]); // 1 (exact)
// Naive sum might give 0 due to rounding
```

## Since

0.7.0
