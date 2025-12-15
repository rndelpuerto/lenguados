# Function: robustSum()

> **robustSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:288](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L288)

Kahan summation algorithm for improved precision.
Compensates for floating-point errors in large sums.

## Parameters

### values

`number`[]

Array of numbers to sum.

## Returns

`number`

Sum with reduced rounding error.

## Example

```typescript
// More accurate than naive sum for many small values
const values = new Array(1000000).fill(0.1);
robustSum(values); // Closer to 100000 than naive sum
```

## Since

1.0.0
