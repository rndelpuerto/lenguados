# Function: randomInBox()

> **randomInBox**(`minX`, `minY`, `maxX`, `maxY`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:229](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L229)

Generates a random point inside an axis-aligned box.

## Parameters

### minX

`number`

Minimum x coordinate

### minY

`number`

Minimum y coordinate

### maxX

`number`

Maximum x coordinate

### maxY

`number`

Maximum y coordinate

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A point inside the box
