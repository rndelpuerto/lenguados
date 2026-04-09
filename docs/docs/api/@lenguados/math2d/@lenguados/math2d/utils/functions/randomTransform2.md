# Function: randomTransform2()

> **randomTransform2**(`out?`, `source?`): [`Transform2`](../../core/classes/Transform2.md)

Defined in: [src/utils/random.ts:283](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random.ts#L283)

Generates a random rigid transform (SE(2)).

## Parameters

### out?

[`Transform2`](../../core/classes/Transform2.md) = `...`

Optional output transform to avoid allocation. Defaults to `new Transform2()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Transform2`](../../core/classes/Transform2.md)

The `out` transform set to a random rotation and translation

## Remarks

Rotation is sampled uniformly and translation is sampled inside the unit circle.

## Example

```typescript
const t = randomTransform2();
```

## Since

0.7.0
