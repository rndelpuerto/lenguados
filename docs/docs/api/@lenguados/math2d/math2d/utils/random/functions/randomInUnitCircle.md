# Function: randomInUnitCircle()

> **randomInUnitCircle**(`out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Generates a random point inside a unit circle.

Uses rejection sampling or sqrt(r) technique for uniform area distribution.
The sqrt ensures points are not clustered at the center.

## Parameters

### out

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector (default: new Vector2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A point inside the unit circle
