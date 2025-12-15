# Function: neumaierSum()

> **neumaierSum**(`values`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:307](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L307)

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

1.0.0
