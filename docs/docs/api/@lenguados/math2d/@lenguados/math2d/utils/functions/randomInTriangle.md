# Function: randomInTriangle()

> **randomInTriangle**(`a`, `b`, `c`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:507](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L507)

Generates a random point inside a triangle.

## Parameters

### a

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

First vertex of the triangle.

### b

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Second vertex of the triangle.

### c

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Third vertex of the triangle.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a random point inside the triangle.

## Remarks

Uses barycentric coordinates to ensure uniform area distribution.

## Example

```typescript
const p = randomInTriangle(a, b, c);
```

## Since

0.7.0

## See

https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle
