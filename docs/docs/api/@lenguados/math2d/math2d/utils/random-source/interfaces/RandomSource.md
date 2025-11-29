# Interface: RandomSource

Interface for random number generation sources.
Implementations must provide uniform distribution in [0, 1).

## Methods

### next()

> **next**(): `number`

Generate a random number in the range [0, 1).
Must return values with uniform distribution.

#### Returns

`number`

A random number in [0, 1)

---

### nextInt()

> **nextInt**(`max`): `number`

Generate a random integer in the range [0, max).

#### Parameters

##### max

`number`

Exclusive upper bound (must be positive)

#### Returns

`number`

A random integer in [0, max)

---

### seed()?

> `optional` **seed**(`seed`): `void`

Optional: Seed the random number generator.
Not all sources support seeding (e.g., Math.random).

#### Parameters

##### seed

`number`

Integer seed value

#### Returns

`void`
