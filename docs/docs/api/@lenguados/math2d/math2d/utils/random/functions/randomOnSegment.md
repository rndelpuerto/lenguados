# Function: randomOnSegment()

> **randomOnSegment**(`start`, `end`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:324](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L324)

Generate a random point on a line segment.

## Parameters

### start

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

Start point of the segment.

### end

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

End point of the segment.

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector.

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A random point on the segment with uniform distribution.
