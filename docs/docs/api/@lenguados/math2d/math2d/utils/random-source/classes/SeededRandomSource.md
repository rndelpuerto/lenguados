# Class: SeededRandomSource

Defined in: [src/utils/random-source.ts:78](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L78)

Seeded random source using a linear congruential generator (LCG).
Based on Park & Miller's "minimal standard" generator.
Provides deterministic pseudo-random numbers when seeded.

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new SeededRandomSource**(`seed?`): `SeededRandomSource`

Defined in: [src/utils/random-source.ts:90](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L90)

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

Defined in: [src/utils/random-source.ts:137](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L137)

Get the current internal state.
Useful for saving/restoring random generator state.

#### Returns

`number`

Current state value

***

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:101](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L101)

Generate the next random number.
Uses Park & Miller's algorithm with Schrage's method to avoid overflow.

#### Returns

`number`

A random number in [0, 1)

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

***

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:119](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L119)

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

***

### seed()

> **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:127](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L127)

Re-seed the generator.

#### Parameters

##### seed

`number`

New seed value

#### Returns

`void`

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`seed`](../interfaces/RandomSource.md#seed)

***

### setState()

> **setState**(`state`): `void`

Defined in: [src/utils/random-source.ts:146](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L146)

Set the internal state directly.
Useful for restoring a previously saved state.

#### Parameters

##### state

`number`

State value to set

#### Returns

`void`
