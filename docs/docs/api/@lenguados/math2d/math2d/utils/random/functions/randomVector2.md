# Function: randomVector2()

> **randomVector2**(`min`, `max`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Generates a random 2D vector with components in range [min, max).

## Parameters

### min

`number` = `0`

Minimum value for components (default: 0)

### max

`number` = `1`

Maximum value for components (default: 1)

### out

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A vector with random components
