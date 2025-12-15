# Function: randomOnSegment()

> **randomOnSegment**(`start`, `end`, `out`, `source`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:478](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random.ts#L478)

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

0.1.0
