# Function: randomOnSegment()

> **randomOnSegment**(`start`, `end`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:475](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random.ts#L475)

Generates a random point on a line segment.

## Parameters

### start

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Start point of the segment.

### end

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

End point of the segment.

### out

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a random point on the segment.

## Remarks

Samples uniformly along the segment length.

## Example

```typescript
const p = randomOnSegment(a, b);
```

## Since

0.7.0
