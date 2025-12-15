# Class: MathRandomSource

Defined in: [src/utils/random-source.ts:53](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L53)

Default random source using Math.random().
This is not seedable and not deterministic.

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new MathRandomSource**(): `MathRandomSource`

#### Returns

`MathRandomSource`

## Methods

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:58](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L58)

Generate a random number using Math.random().

#### Returns

`number`

A random number in [0, 1)

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

***

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:67](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random-source.ts#L67)

Generate a random integer using Math.random().

#### Parameters

##### max

`number`

Exclusive upper bound

#### Returns

`number`

A random integer in [0, max)

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)
