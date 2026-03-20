# Function: randomInTriangle()

> **randomInTriangle**(`a`, `b`, `c`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:510](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random.ts#L510)

Generates a random point inside a triangle.

## Parameters

### a

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

First vertex of the triangle

### b

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Second vertex of the triangle

### c

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Third vertex of the triangle

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source

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
