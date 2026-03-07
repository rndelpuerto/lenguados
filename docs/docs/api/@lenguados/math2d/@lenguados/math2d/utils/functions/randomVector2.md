# Function: randomVector2()

> **randomVector2**(`min`, `max`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:75](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L75)

Generates a random 2D vector with components in range [min, max).

## Parameters

### min

`number` = `0`

Minimum component value. Defaults to `0`.

### max

`number` = `1`

Maximum component value (exclusive). Defaults to `1`.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector containing the random components.

## Remarks

Each component is sampled independently with a uniform distribution.

## Example

```typescript
const v = randomVector2(-1, 1);
```

## Since

0.7.0
