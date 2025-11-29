# Function: randomTransform2()

> **randomTransform2**(`out`, `source`): [`Transform2`](../../../../index.ts/classes/Transform2.md)

Generates a random rigid transform (SE(2)).

Random rotation with uniform distribution and translation inside unit circle.

## Parameters

### out

[`Transform2`](../../../../index.ts/classes/Transform2.md) = `...`

Optional output transform (default: new Transform2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Transform2`](../../../../index.ts/classes/Transform2.md)

A random transform
