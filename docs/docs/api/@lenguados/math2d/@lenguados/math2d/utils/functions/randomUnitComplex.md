# Function: randomUnitComplex()

> **randomUnitComplex**(`out`, `source`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/random.ts:636](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L636)

Generates a random unit complex number (on the unit circle).

## Parameters

### out

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Complex`](../../core/classes/Complex.md)

The `out` complex set to a unit-magnitude complex number.

## Remarks

Equivalent to generating a random rotation as a complex number.
Uses a uniform distribution over the unit circle.

## Example

```typescript
const c = randomUnitComplex(); // Random unit complex (magnitude = 1)
```

## Since

0.7.0
