# Function: randomInterval()

> **randomInterval**(`minBound?`, `maxBound?`, `out?`, `source?`): [`Interval`](../../core/classes/Interval.md)

Defined in: [src/utils/random.ts:679](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random.ts#L679)

Generates a random interval within specified bounds.

## Parameters

### minBound?

`number` = `0`

Minimum allowed value for interval.min. Defaults to `0`

### maxBound?

`number` = `1`

Maximum allowed value for interval.max. Defaults to `1`

### out?

[`Interval`](../../core/classes/Interval.md) = `...`

Optional output interval to avoid allocation. Defaults to `new Interval()`

### source?

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Interval`](../../core/classes/Interval.md)

The `out` interval containing random bounds within [minBound, maxBound]

## Remarks

Generates two random values, sorts them, and uses them as min/max.
This ensures min ≤ max invariant is always satisfied.

## Example

```typescript
const i = randomInterval(0, 100); // Random interval within [0, 100]
```

## Since

0.7.0
