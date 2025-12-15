# Class: SeededRandomSource

Defined in: [src/utils/random-source.ts:121](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L121)

Deterministic random source using a linear congruential generator (LCG).

## Remarks

Based on Park and Miller's "minimal standard" generator and provides
deterministic pseudo-random numbers when seeded.

## Since

0.1.0

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new SeededRandomSource**(`seed?`): `SeededRandomSource`

Defined in: [src/utils/random-source.ts:134](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L134)

Creates a new seeded random source.

#### Parameters

##### seed?

`number`

Initial seed value. Defaults to the current time.

#### Returns

`SeededRandomSource`

## Utility

### getState()

> **getState**(): `number`

Defined in: [src/utils/random-source.ts:201](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L201)

Returns the current internal state.

#### Returns

`number`

Current state value.

#### Remarks

Useful for saving and restoring random generator state.

#### Since

0.1.0

---

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:151](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L151)

Generates the next random number.

#### Returns

`number`

A random number in [0, 1).

#### Remarks

Uses Park and Miller's algorithm with Schrage's method to avoid overflow.

#### Since

0.1.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:173](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L173)

Generates a random integer.

#### Parameters

##### max

`number`

Exclusive upper bound.

#### Returns

`number`

A random integer in [0, max).

#### Since

0.1.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)

---

### seed()

> **seed**(`seed`): `void`

Defined in: [src/utils/random-source.ts:185](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L185)

Re-seeds the generator.

#### Parameters

##### seed

`number`

New seed value.

#### Returns

`void`

#### Since

0.1.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`seed`](../interfaces/RandomSource.md#seed)

---

### setState()

> **setState**(`state`): `void`

Defined in: [src/utils/random-source.ts:218](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L218)

Sets the internal state directly.

#### Parameters

##### state

`number`

State value to set.

#### Returns

`void`

#### Remarks

Useful for restoring a previously saved state.

#### Throws

If `state` is outside [1, M - 1].

#### Since

0.1.0
