# Interface: RandomSource

Defined in: [src/utils/random-source.ts:31](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random-source.ts#L31)

Defines a uniform random number source with optional seeding.

## Remarks

Implementations must provide uniform distribution in [0, 1).

## Since

0.7.0

## Accessor

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:40](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random-source.ts#L40)

Generates a random number in the range [0, 1).

#### Returns

`number`

A random number in [0, 1)

#### Since

0.7.0

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:51](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random-source.ts#L51)

Generates a random integer in the range [0, max).

#### Parameters

##### max

`number`

Exclusive upper bound (must be positive)

#### Returns

`number`

A random integer in [0, max)

#### Since

0.7.0

---

### seed()?

> `optional` **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:64](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random-source.ts#L64)

Seeds the random number generator when supported.

#### Parameters

##### seed

`number`

Integer seed value

#### Returns

`void`

#### Remarks

Not all sources support seeding (for example, Math.random()).

#### Since

0.7.0
