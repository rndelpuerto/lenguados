# Class: SeededRandomSource

Defined in: [src/utils/random-source.ts:213](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L213)

Deterministic random source using xoshiro128++ algorithm.

## Remarks

Uses xoshiro128++ (Blackman & Vigna, 2021) with 4 × uint32 state for
high-quality pseudo-random numbers. State is initialized via SplitMix32
seed expansion. Provides unbiased integer generation via rejection sampling.

## Example

```typescript
const rng = new SeededRandomSource(12345);
const a = rng.next(); // deterministic value in [0, 1)
const b = rng.nextInt(100); // deterministic integer in [0, 100)
```

## Since

0.7.0

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new SeededRandomSource**(`seed?`): `SeededRandomSource`

Defined in: [src/utils/random-source.ts:221](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L221)

Creates a new seeded random source.

#### Parameters

##### seed?

`number`

Initial seed value. Defaults to sub-millisecond timestamp

#### Returns

`SeededRandomSource`

## Accessor

### getState()

> **getState**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/utils/random-source.ts:304](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L304)

Returns the current internal state as a 4-element uint32 array.

#### Returns

\[`number`, `number`, `number`, `number`\]

Copy of the current `[s0, s1, s2, s3]` state

#### Remarks

Useful for saving and restoring random generator state.

#### Since

0.7.0

---

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:245](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L245)

Generates the next random number.

#### Returns

`number`

A random number in [0, 1)

#### Remarks

Uses xoshiro128++ algorithm with 32-bit state for deterministic generation.

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:264](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L264)

Generates a random integer in [0, max).

#### Parameters

##### max

`number`

Exclusive upper bound

#### Returns

`number`

A random integer in [0, max)

#### Remarks

Uses rejection sampling with modulo debiasing to eliminate bias.

#### Throws

If max is not a positive integer

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)

## Configuration

### restoreState()

> **restoreState**(`state`): `void`

Defined in: [src/utils/random-source.ts:318](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L318)

Restores a previously saved state.

#### Parameters

##### state

\[`number`, `number`, `number`, `number`\]

4-element uint32 state array from [getState](#getstate)

#### Returns

`void`

#### Throws

If state is not a 4-element array or is all zeros

#### Since

0.7.0

---

### seed()

> **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:289](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L289)

Re-seeds the generator using SplitMix32 expansion.

#### Parameters

##### seed

`number`

New seed value

#### Returns

`void`

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`seed`](../interfaces/RandomSource.md#seed)
