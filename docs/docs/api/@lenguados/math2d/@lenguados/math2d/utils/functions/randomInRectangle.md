# Function: randomInRectangle()

> **randomInRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:316](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random.ts#L316)

Generates a random point inside a rectangle centered at the origin.

## Parameters

### width

`number`

Rectangle width

### height

`number`

Rectangle height

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point inside the rectangle

## Remarks

Each coordinate is sampled uniformly from [-width/2, width/2) and
[-height/2, height/2).

## Example

```typescript
const p = randomInRectangle(4, 2);
```

## Since

0.7.0
