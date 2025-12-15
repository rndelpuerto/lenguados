# Function: randomOnCircle()

> **randomOnCircle**(`radius`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:96](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L96)

Generates a random point on a circle's circumference.

Uniform distribution along the perimeter.

## Parameters

### radius

`number` = `1`

Circle radius (default: 1)

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A point on the circle
