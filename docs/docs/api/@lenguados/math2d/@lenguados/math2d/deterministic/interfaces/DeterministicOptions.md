# Interface: DeterministicOptions

Defined in: [src/deterministic/deterministic-math.ts:16](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L16)

Options for deterministic math operations

## Properties

### fixedPointScale?

> `optional` **fixedPointScale**: `number`

Defined in: [src/deterministic/deterministic-math.ts:39](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L39)

Fixed-point scale factor (number of fractional bits)

#### Default

```ts
16
```

***

### sqrtIterations?

> `optional` **sqrtIterations**: `number`

Defined in: [src/deterministic/deterministic-math.ts:27](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L27)

Number of Newton-Raphson iterations for sqrt

#### Default

```ts
3
```

***

### tableSize?

> `optional` **tableSize**: `number`

Defined in: [src/deterministic/deterministic-math.ts:21](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L21)

Number of entries in lookup tables (must be power of 2)

#### Default

```ts
65536
```

***

### useFixedPoint?

> `optional` **useFixedPoint**: `boolean`

Defined in: [src/deterministic/deterministic-math.ts:33](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L33)

Use fixed-point arithmetic for intermediate calculations

#### Default

```ts
false
```
