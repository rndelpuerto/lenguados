# Function: randomInCircle()

> **randomInCircle**(`radius`, `out?`, `source?`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:195](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random.ts#L195)

Generates a random point inside a circle with given radius.

## Parameters

### radius

`number`

Circle radius (non-negative)

### out?

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point inside the circle

## Remarks

Samples the unit disk and scales by `radius` to keep uniform area density.

## Example

```typescript
const p = randomInCircle(3);
```

## Since

0.7.0
