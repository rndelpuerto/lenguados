# Function: robustSum()

> **robustSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:244](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L244)

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
