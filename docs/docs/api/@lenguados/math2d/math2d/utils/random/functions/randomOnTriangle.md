# Function: randomOnTriangle()

> **randomOnTriangle**(`a`, `b`, `c`, `out`, `source`): [`Vector2`](../../../../@lenguados/math2d/core/classes/Vector2.md)

Defined in: [src/utils/random.ts:380](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L380)

Generate a random point on the perimeter of a triangle.

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

A random point on the triangle's perimeter with uniform distribution by length.
