# Class: SeededRandomSource

Seeded random source using a linear congruential generator (LCG).
Based on Park & Miller's "minimal standard" generator.
Provides deterministic pseudo-random numbers when seeded.

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new SeededRandomSource**(`seed?`): `SeededRandomSource`

Create a new seeded random source.

#### Parameters

##### seed?

`number`

Initial seed value (defaults to current time)

#### Returns

`SeededRandomSource`

## Methods

### getState()

> **getState**(): `number`

Get the current internal state.
Useful for saving/restoring random generator state.

#### Returns

`number`

Current state value

---

### next()

> **next**(): `number`

Generate the next random number.
Uses Park & Miller's algorithm with Schrage's method to avoid overflow.

#### Returns

`number`

A random number in [0, 1)

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Generate a random integer.

#### Parameters

##### max

`number`

Exclusive upper bound

#### Returns

`number`

A random integer in [0, max)

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)

---

### seed()

> **seed**(`seed`): `void`

Re-seed the generator.

#### Parameters

##### seed

`number`

New seed value

#### Returns

`void`

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`seed`](../interfaces/RandomSource.md#seed)

---

### setState()

> **setState**(`state`): `void`

Set the internal state directly.
Useful for restoring a previously saved state.

#### Parameters

##### state

`number`

State value to set

#### Returns

`void`
