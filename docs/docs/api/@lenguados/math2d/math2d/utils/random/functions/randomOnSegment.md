# Function: randomOnSegment()

> **randomOnSegment**(`start`, `end`, `out`, `source`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Generate a random point on a line segment.

## Parameters

### start

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

Start point of the segment.

### end

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

End point of the segment.

### out

[`Vector2`](../../../../index.ts/classes/Vector2.md) = `...`

Optional output vector.

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

A random point on the segment with uniform distribution.
