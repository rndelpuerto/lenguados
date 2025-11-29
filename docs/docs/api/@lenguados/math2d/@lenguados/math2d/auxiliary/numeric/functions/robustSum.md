# Function: robustSum()

> **robustSum**(`values`): `number`

Kahan summation algorithm for improved precision.
Compensates for floating-point errors in large sums.

## Parameters

### values

`number`[]

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

## Since

1.0.0
