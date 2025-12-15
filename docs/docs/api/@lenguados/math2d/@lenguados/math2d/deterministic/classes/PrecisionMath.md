# Class: PrecisionMath

Defined in: [src/deterministic/precision-math.ts:57](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L57)

High-precision arithmetic operations using error compensation.
These algorithms track and compensate for rounding errors in floating-point arithmetic.

## Example

```typescript
// Kahan summation for accurate sums
const sum = PrecisionMath.kahanSum([0.1, 0.2, 0.3, 0.4]);

// Two-sum for exact error tracking
const { sum, error } = PrecisionMath.twoSum(1e20, 1);
console.log(sum);    // 1e20 (lost precision)
console.log(error);  // 1 (exact error)
```

## Constructors

### Constructor

> **new PrecisionMath**(): `PrecisionMath`

#### Returns

`PrecisionMath`

## Methods

### compensatedDot()

> `static` **compensatedDot**(`a`, `b`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:234](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L234)

Compensated dot product of two vectors.

#### Parameters

##### a

readonly `number`[]

First vector

##### b

readonly `number`[]

Second vector

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Compensated dot product

#### Throws

If vectors have different lengths

***

### compensatedProduct()

> `static` **compensatedProduct**(`values`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:208](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L208)

Compensated multiplication using error tracking.

#### Parameters

##### values

readonly `number`[]

Array of numbers to multiply

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Compensated product

***

### extendedSum()

> `static` **extendedSum**(`values`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:259](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L259)

Extended precision addition using compensation.

#### Parameters

##### values

readonly [`CompensatedResult`](../interfaces/CompensatedResult.md)[]

Values to sum with their errors

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Sum with combined error

***

### fastTwoSum()

> `static` **fastTwoSum**(`a`, `b`): [`TwoSumResult`](../interfaces/TwoSumResult.md)

Defined in: [src/deterministic/precision-math.ts:157](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L157)

Fast two-sum when |a| >= |b| is known.
More efficient than general two-sum.

#### Parameters

##### a

`number`

Larger operand (by magnitude)

##### b

`number`

Smaller operand (by magnitude)

#### Returns

[`TwoSumResult`](../interfaces/TwoSumResult.md)

Sum and error

***

### kahanSum()

> `static` **kahanSum**(`values`): `number`

Defined in: [src/deterministic/precision-math.ts:83](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L83)

Kahan summation algorithm for accurate sum of many numbers.
Compensates for rounding errors in floating-point addition.

#### Parameters

##### values

readonly `number`[]

Array of numbers to sum

#### Returns

`number`

Compensated sum

#### Example

```typescript
// Standard sum loses precision
const standard = [0.1, 0.2, 0.3].reduce((a, b) => a + b, 0);
// Kahan sum maintains precision
const kahan = PrecisionMath.kahanSum([0.1, 0.2, 0.3]);
```

***

### neumaierSum()

> `static` **neumaierSum**(`values`): `number`

Defined in: [src/deterministic/precision-math.ts:104](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L104)

Neumaier summation - improved Kahan algorithm.
Better handles cases where values vary greatly in magnitude.

#### Parameters

##### values

readonly `number`[]

Array of numbers to sum

#### Returns

`number`

Compensated sum

***

### twoProduct()

> `static` **twoProduct**(`a`, `b`): [`TwoProductResult`](../interfaces/TwoProductResult.md)

Defined in: [src/deterministic/precision-math.ts:175](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L175)

Two-product algorithm: exact floating-point multiplication.

#### Parameters

##### a

`number`

First operand

##### b

`number`

Second operand

#### Returns

[`TwoProductResult`](../interfaces/TwoProductResult.md)

Product and error such that a * b = product + error exactly

#### Remarks

Uses FMA (Fused Multiply-Add) if available, otherwise falls back
to Veltkamp splitting for exact multiplication.

***

### twoSum()

> `static` **twoSum**(`a`, `b`): [`TwoSumResult`](../interfaces/TwoSumResult.md)

Defined in: [src/deterministic/precision-math.ts:137](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/precision-math.ts#L137)

Two-sum algorithm: exact floating-point addition.
Returns both the rounded sum and the exact error.

#### Parameters

##### a

`number`

First operand

##### b

`number`

Second operand

#### Returns

[`TwoSumResult`](../interfaces/TwoSumResult.md)

Sum and error such that a + b = sum + error exactly

#### Remarks

Based on Knuth's algorithm. The error term captures the
exact rounding error, allowing for extended precision.
