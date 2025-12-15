# Function: randomInterval()

> **randomInterval**(`minBound`, `maxBound`, `out`, `source`): [`Interval`](../../core/classes/Interval.md)

Defined in: [src/utils/random.ts:672](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random.ts#L672)

Generates a random interval within specified bounds.

## Parameters

### minBound

`number` = `0`

Minimum allowed value for interval.min. Defaults to `0`.

### maxBound

`number` = `1`

Maximum allowed value for interval.max. Defaults to `1`.

### out

[`Interval`](../../core/classes/Interval.md) = `...`

Optional output interval to avoid allocation. Defaults to `new Interval()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Interval`](../../core/classes/Interval.md)

The `out` interval containing random bounds within [minBound, maxBound].

## Remarks

Generates two random values, sorts them, and uses them as min/max.
This ensures min ≤ max invariant is always satisfied.

## Example

```typescript
const i = randomInterval(0, 100); // Random interval within [0, 100]
```

## Since

0.14.0
