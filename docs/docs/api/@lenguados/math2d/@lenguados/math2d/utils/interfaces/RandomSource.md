# Interface: RandomSource

Defined in: [src/utils/random-source.ts:33](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L33)

Defines a uniform random number source with optional seeding.

## Remarks

Implementations must provide uniform distribution in [0, 1).

## Since

0.1.0

## Utility

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:42](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L42)

Generates a random number in the range [0, 1).

#### Returns

`number`

A random number in [0, 1).

#### Since

0.1.0

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:53](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L53)

Generates a random integer in the range [0, max).

#### Parameters

##### max

`number`

Exclusive upper bound (must be positive).

#### Returns

`number`

A random integer in [0, max).

#### Since

0.1.0

---

### seed()?

> `optional` **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:66](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L66)

Seeds the random number generator when supported.

#### Parameters

##### seed

`number`

Integer seed value.

#### Returns

`void`

#### Remarks

Not all sources support seeding (for example, Math.random()).

#### Since

0.1.0
