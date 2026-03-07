# Function: randomInRectangle()

> **randomInRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:315](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L315)

Generates a random point inside a rectangle centered at the origin.

## Parameters

### width

`number`

Rectangle width.

### height

`number`

Rectangle height.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point inside the rectangle.

## Remarks

Each coordinate is sampled uniformly from [-width/2, width/2) and
[-height/2, height/2).

## Example

```typescript
const p = randomInRectangle(4, 2);
```

## Since

0.7.0
