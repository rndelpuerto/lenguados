# Function: randomOnTriangle()

> **randomOnTriangle**(`a`, `b`, `c`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:554](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random.ts#L554)

Generates a random point on a triangle perimeter.

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

The `out` vector set to a point on the triangle's perimeter

## Remarks

Distributes points uniformly by edge length.

## Example

```typescript
const p = randomOnTriangle(a, b, c);
```

## Since

0.7.0
