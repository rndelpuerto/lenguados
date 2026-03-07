# Function: randomTransform2()

> **randomTransform2**(`out`, `source`): [`Transform2`](../../core/classes/Transform2.md)

Defined in: [src/utils/random.ts:281](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L281)

Generates a random rigid transform (SE(2)).

## Parameters

### out

[`Transform2`](../../core/classes/Transform2.md) = `...`

Optional output transform to avoid allocation. Defaults to `new Transform2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Transform2`](../../core/classes/Transform2.md)

The `out` transform set to a random rotation and translation.

## Remarks

Rotation is sampled uniformly and translation is sampled inside the unit circle.

## Example

```typescript
const t = randomTransform2();
```

## Since

0.7.0
