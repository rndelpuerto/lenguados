# Function: randomGaussianVector2()

> **randomGaussianVector2**(`mean`, `standardDeviation`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

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

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector.

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A vector with Gaussian-distributed components.

## See

https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
