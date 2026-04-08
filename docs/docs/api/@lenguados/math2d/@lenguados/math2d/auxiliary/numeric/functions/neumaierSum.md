# Function: neumaierSum()

> **neumaierSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:318](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L318)

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
