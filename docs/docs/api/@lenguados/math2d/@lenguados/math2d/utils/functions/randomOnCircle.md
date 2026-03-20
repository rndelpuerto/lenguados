# Function: randomOnCircle()

> **randomOnCircle**(`radius`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:134](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random.ts#L134)

Generates a random point on a circle's circumference.

## Parameters

### radius

`number` = `1`

Circle radius. Defaults to `1`

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point on the circle

## Remarks

Uses a uniform distribution along the perimeter. `radius` should be non-negative.

## Example

```typescript
const p = randomOnCircle(2);
```

## Since

0.7.0
