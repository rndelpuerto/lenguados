# Function: randomInBox()

> **randomInBox**(`minX`, `minY`, `maxX`, `maxY`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:346](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random.ts#L346)

Generates a random point inside an axis-aligned box.

## Parameters

### minX

`number`

Minimum x coordinate.

### minY

`number`

Minimum y coordinate.

### maxX

`number`

Maximum x coordinate.

### maxY

`number`

Maximum y coordinate.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point inside the box.

## Remarks

Each coordinate is sampled independently in [min, max).

## Example

```typescript
const p = randomInBox(-1, -1, 1, 1);
```

## Since

0.1.0
