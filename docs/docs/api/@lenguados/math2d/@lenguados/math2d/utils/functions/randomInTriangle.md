# Function: randomInTriangle()

> **randomInTriangle**(`a`, `b`, `c`, `out?`, `source?`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:512](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random.ts#L512)

Generates a random point inside a triangle.

## Parameters

### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vertex of the triangle

### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vertex of the triangle

### c

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Third vertex of the triangle

### out?

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a random point inside the triangle

## Remarks

Uses barycentric coordinates to ensure uniform area distribution.

## Example

```typescript
const p = randomInTriangle(a, b, c);
```

## See

[https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle](https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle) - Uniform random point in triangle

## Since

0.7.0
