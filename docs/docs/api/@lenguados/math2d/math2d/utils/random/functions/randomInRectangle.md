# Function: randomInRectangle()

> **randomInRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

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

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A point inside the rectangle
