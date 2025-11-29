# Function: randomInBox()

> **randomInBox**(`minX`, `minY`, `maxX`, `maxY`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

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

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A point inside the box
