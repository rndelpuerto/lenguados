# Function: randomGaussianVector2()

> **randomGaussianVector2**(`mean`, `standardDeviation`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:290](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L290)

Generate a random 2D vector with Gaussian (normal) distribution.

Uses the Box-Muller transform for generating normally distributed values.
Each component is independently sampled from N(mean, stdDev²).

## Parameters

### mean

`number` = `0`

Mean of the distribution (default 0).

### standardDeviation

`number` = `1`

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector.

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A vector with Gaussian-distributed components.

## See

https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
