# Function: randomOnCircle()

> **randomOnCircle**(`radius?`, `out?`, `source?`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:136](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random.ts#L136)

Generates a random point on a circle's circumference.

## Parameters

### radius?

`number` = `1`

Circle radius. Defaults to `1`

### out?

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source?

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
