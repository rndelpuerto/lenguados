# Function: randomOnSegment()

> **randomOnSegment**(`start`, `end`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:479](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random.ts#L479)

Generates a random point on a line segment.

## Parameters

### start

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point of the segment

### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point of the segment

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a random point on the segment

## Remarks

Samples uniformly along the segment length.

## Example

```typescript
const p = randomOnSegment(a, b);
```

## Since

0.7.0
