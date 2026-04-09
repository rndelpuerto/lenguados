# Function: robustSum()

> **robustSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:286](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L286)

Kahan summation algorithm for improved precision.
Compensates for floating-point errors in large sums.

## Parameters

### values

readonly `number`[]

Array of numbers to sum

## Returns

`number`

Sum with reduced rounding error

## Example

```typescript
// More accurate than naive sum for many small values
const values = new Array(1000000).fill(0.1);
robustSum(values); // Closer to 100000 than naive sum
```

## See

[neumaierSum](neumaierSum.md) For improved accuracy with values of varying magnitudes

## Since

0.7.0
