# Class: MathRandomSource

Defined in: [src/utils/random-source.ts:81](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random-source.ts#L81)

Non-deterministic random source backed by `Math.random`.

## Remarks

This source is not seedable and is not deterministic.

## Since

0.7.0

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

Defined in: [src/utils/random-source.ts:90](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random-source.ts#L90)

Generates a random number using Math.random().

#### Returns

`number`

A random number in [0, 1).

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:103](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/random-source.ts#L103)

Generates a random integer using Math.random().

#### Parameters

##### max

`number`

Exclusive upper bound.

#### Returns

`number`

A random integer in [0, max).

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)
