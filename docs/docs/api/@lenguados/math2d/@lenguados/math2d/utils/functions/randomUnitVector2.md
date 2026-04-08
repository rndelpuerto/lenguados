# Function: randomUnitVector2()

> **randomUnitVector2**(`out?`, `source?`): [`Vector2`](../../core/classes/Vector2.md)

Defined in: [src/utils/random.ts:105](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random.ts#L105)

Generates a random unit vector.

## Parameters

### out?

[`Vector2`](../../core/classes/Vector2.md) = `...`

Optional output vector to avoid allocation. Defaults to `new Vector2()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Vector2`](../../core/classes/Vector2.md)

The `out` vector set to a unit-length direction

## Remarks

Uses a uniform distribution over the unit circle.

## Example

```typescript
const dir = randomUnitVector2();
```

## Since

0.7.0
