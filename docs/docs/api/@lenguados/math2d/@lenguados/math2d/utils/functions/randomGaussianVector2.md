# Function: randomGaussianVector2()

> **randomGaussianVector2**(`mean`, `standardDeviation`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:429](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L429)

Generates a random 2D vector with a normal distribution.

## Parameters

### mean

`number` = `0`

Mean of the distribution. Defaults to `0`.

### standardDeviation

`number` = `1`

Standard deviation. Defaults to `1`.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector with Gaussian-distributed components.

## Remarks

Uses the Box-Muller transform to sample each component independently from
N(mean, standardDeviation^2). `standardDeviation` should be non-negative.

## Example

```typescript
const v = randomGaussianVector2(0, 2);
```

## Since

0.7.0

## See

https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
