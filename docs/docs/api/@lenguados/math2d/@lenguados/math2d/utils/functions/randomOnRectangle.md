# Function: randomOnRectangle()

> **randomOnRectangle**(`width`, `height`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:380](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random.ts#L380)

Generates a random point on the perimeter of a rectangle.

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

The `out` vector set to a point on the rectangle's perimeter

## Remarks

Samples uniformly along the perimeter length. Width and height should be positive.

## Example

```typescript
const p = randomOnRectangle(3, 2);
```

## Since

0.7.0
