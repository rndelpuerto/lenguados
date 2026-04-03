# Class: MathRandomSource

Defined in: [src/utils/random-source.ts:88](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random-source.ts#L88)

Non-deterministic random source backed by `Math.random`.

## Remarks

This source is not seedable and is not deterministic.

## Example

```typescript
const rng = new MathRandomSource();
const value = rng.next(); // random number in [0, 1)
const index = rng.nextInt(10); // random integer in [0, 10)
```

## Since

0.7.0

## Implements

- [`RandomSource`](../interfaces/RandomSource.md)

## Constructors

### Constructor

> **new MathRandomSource**(): `MathRandomSource`

#### Returns

`MathRandomSource`

## Accessor

### next()

> **next**(): `number`

Defined in: [src/utils/random-source.ts:97](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random-source.ts#L97)

Generates a random number using Math.random().

#### Returns

`number`

A random number in [0, 1)

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`next`](../interfaces/RandomSource.md#next)

---

### nextInt()

> **nextInt**(`max`): `number`

Defined in: [src/utils/random-source.ts:110](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random-source.ts#L110)

Generates a random integer using Math.random().

#### Parameters

##### max

`number`

Exclusive upper bound

#### Returns

`number`

A random integer in [0, max)

#### Since

0.7.0

#### Implementation of

[`RandomSource`](../interfaces/RandomSource.md).[`nextInt`](../interfaces/RandomSource.md#nextint)
