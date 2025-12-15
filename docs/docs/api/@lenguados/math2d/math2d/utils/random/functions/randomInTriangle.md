# Function: randomInTriangle()

> **randomInTriangle**(`a`, `b`, `c`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:347](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L347)

Generate a random point inside a triangle with uniform distribution.

Uses barycentric coordinates to ensure uniform sampling.

## Parameters

### a

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

First vertex of the triangle.

### b

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

Second vertex of the triangle.

### c

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

Third vertex of the triangle.

### out

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md) = `...`

Optional output vector.

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

A random point inside the triangle.

## See

https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle
