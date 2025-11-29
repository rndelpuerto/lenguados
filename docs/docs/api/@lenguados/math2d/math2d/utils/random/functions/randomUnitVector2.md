# Function: randomUnitVector2()

> **randomUnitVector2**(`out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Generates a random unit vector (direction).

Uses uniform distribution on the unit circle.

## Parameters

### out

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A normalized vector with random direction
