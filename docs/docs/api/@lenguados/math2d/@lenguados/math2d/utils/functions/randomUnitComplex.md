# Function: randomUnitComplex()

> **randomUnitComplex**(`out?`, `source?`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/random.ts:646](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random.ts#L646)

Generates a random unit complex number (on the unit circle).

## Parameters

### out?

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Complex`](../../core/classes/Complex.md)

The `out` complex set to a unit-magnitude complex number

## Remarks

Equivalent to generating a random rotation as a complex number.
Uses a uniform distribution over the unit circle.

## Example

```typescript
const c = randomUnitComplex(); // Random unit complex (magnitude = 1)
```

## Since

0.7.0
