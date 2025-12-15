# Interface: RandomSource

Defined in: [src/utils/random-source.ts:25](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L25)

Interface for random number generation sources.
Implementations must provide uniform distribution in [0, 1).

## Methods

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:31](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L31)

Generate a random number in the range [0, 1).
Must return values with uniform distribution.

#### Returns

`number`

A random number in [0, 1)

***

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:38](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L38)

Generate a random integer in the range [0, max).

#### Parameters

##### max

`number`

Exclusive upper bound (must be positive)

#### Returns

`number`

A random integer in [0, max)

***

### seed()?

> `optional` **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:45](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L45)

Optional: Seed the random number generator.
Not all sources support seeding (e.g., Math.random).

#### Parameters

##### seed

`number`

Integer seed value

#### Returns

`void`
