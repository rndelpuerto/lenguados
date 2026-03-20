# Function: randomUnitComplex()

> **randomUnitComplex**(`out`, `source`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/random.ts:644](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random.ts#L644)

Generates a random unit complex number (on the unit circle).

## Parameters

### out

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`

### source

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
