# Function: randomInUnitCircle()

> **randomInUnitCircle**(`out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:165](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random.ts#L165)

Generates a random point inside a unit circle.

## Parameters

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a point inside the unit circle

## Remarks

Uses sqrt(r) in polar coordinates to achieve uniform area distribution.

## Example

```typescript
const p = randomInUnitCircle();
```

## Since

0.7.0
