# Function: neumaierSum()

> **neumaierSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:276](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L276)

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

## See

[robustSum](robustSum.md) For simpler Kahan summation when values have similar magnitudes

## Since

0.7.0
