# Class: MathRandomSource

Defined in: [src/utils/random-source.ts:83](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L83)

Non-deterministic random source backed by `Math.random`.

## Remarks

This source is not seedable and is not deterministic.

## Since

0.1.0

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new MathRandomSource**(): `MathRandomSource`

#### Returns

`MathRandomSource`

## Utility

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:92](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L92)

Generates a random number using Math.random().

#### Returns

`number`

A random number in [0, 1).

#### Since

0.1.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:105](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random-source.ts#L105)

Generates a random integer using Math.random().

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
