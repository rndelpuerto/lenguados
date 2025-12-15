# Function: randomTransform2()

> **randomTransform2**(`out`, `source`): [`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md)

Defined in: [src/utils/random.ts:189](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L189)

Generates a random rigid transform (SE(2)).

Random rotation with uniform distribution and translation inside unit circle.

## Parameters

### out

[`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md) = `...`

Optional output transform (default: new Transform2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Transform2`](../../../../@lenguados/math2d/core/classes/Transform2.md)

A random transform
