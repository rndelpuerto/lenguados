# Function: randomInRectangle()

> **randomInRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:209](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L209)

Generates a random point inside a rectangle.

Rectangle is centered at origin with given dimensions.

## Parameters

### width

`number`

Rectangle width

### height

`number`

Rectangle height

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A point inside the rectangle
