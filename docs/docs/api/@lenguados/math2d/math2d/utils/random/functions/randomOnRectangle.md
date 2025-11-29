# Function: randomOnRectangle()

> **randomOnRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Generates a random point on the perimeter of a rectangle.

Uniform distribution along the perimeter.

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

A point on the rectangle's perimeter
