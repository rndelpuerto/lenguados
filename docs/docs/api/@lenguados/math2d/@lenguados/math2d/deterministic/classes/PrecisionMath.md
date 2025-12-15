# Class: PrecisionMath

Defined in: [src/deterministic/precision-math.ts:73](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L73)

High-precision arithmetic operations using error compensation.
These algorithms track and compensate for rounding errors in floating-point arithmetic.

## Example

```typescript
// Kahan summation for accurate sums
const sum = PrecisionMath.kahanSum([0.1, 0.2, 0.3, 0.4]);

// Two-sum for exact error tracking
const { sum, error } = PrecisionMath.twoSum(1e20, 1);
console.log(sum); // 1e20 (lost precision)
console.log(error); // 1 (exact error)
```

## Since

0.1.0

## Constructors

### Constructor

> **new PrecisionMath**(): `PrecisionMath`

#### Returns

`PrecisionMath`

## Precision

### compensatedDot()

> `static` **compensatedDot**(`a`, `b`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:291](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L291)

Compensated dot product of two vectors.

#### Parameters

##### a

readonly `number`[]

First vector.

##### b

readonly `number`[]

Second vector.

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Compensated dot product.

#### Throws

If vectors have different lengths.

#### Since

0.1.0

---

### compensatedProduct()

> `static` **compensatedProduct**(`values`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:261](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L261)

Compensated multiplication using error tracking.

#### Parameters

##### values

readonly `number`[]

Array of numbers to multiply.

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Compensated product.

#### Since

0.1.0

---

### extendedSum()

> `static` **extendedSum**(`values`): [`CompensatedResult`](../interfaces/CompensatedResult.md)

Defined in: [src/deterministic/precision-math.ts:320](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L320)

Extended precision addition using compensation.

#### Parameters

##### values

readonly [`CompensatedResult`](../interfaces/CompensatedResult.md)[]

Values to sum with their errors.

#### Returns

[`CompensatedResult`](../interfaces/CompensatedResult.md)

Sum with combined error.

#### Since

0.1.0

---

### fastTwoSum()

> `static` **fastTwoSum**(`a`, `b`): [`TwoSumResult`](../interfaces/TwoSumResult.md)

Defined in: [src/deterministic/precision-math.ts:198](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L198)

Fast two-sum when |a| >= |b| is known.
More efficient than general two-sum.

#### Parameters

##### a

`number`

Larger operand (by magnitude).

##### b

`number`

Smaller operand (by magnitude).

#### Returns

[`TwoSumResult`](../interfaces/TwoSumResult.md)

Sum and error.

#### Since

0.1.0

---

### kahanSum()

> `static` **kahanSum**(`values`): `number`

Defined in: [src/deterministic/precision-math.ts:108](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L108)

Kahan summation algorithm for accurate sum of many numbers.
Compensates for rounding errors in floating-point addition.

#### Parameters

##### values

readonly `number`[]

Array of numbers to sum.

#### Returns

`number`

Compensated sum.

#### Example

```typescript
// Standard sum loses precision
const standard = [0.1, 0.2, 0.3].reduce((a, b) => a + b, 0);
// Kahan sum maintains precision
const kahan = PrecisionMath.kahanSum([0.1, 0.2, 0.3]);
```

#### Since

0.1.0

---

### neumaierSum()

> `static` **neumaierSum**(`values`): `number`

Defined in: [src/deterministic/precision-math.ts:133](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L133)

Neumaier summation - improved Kahan algorithm.
Better handles cases where values vary greatly in magnitude.

#### Parameters

##### values

readonly `number`[]

Array of numbers to sum.

#### Returns

`number`

Compensated sum.

#### Since

0.1.0

---

### twoProduct()

> `static` **twoProduct**(`a`, `b`): [`TwoProductResult`](../interfaces/TwoProductResult.md)

Defined in: [src/deterministic/precision-math.ts:220](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L220)

Two-product algorithm: exact floating-point multiplication.

#### Parameters

##### a

`number`

First operand.

##### b

`number`

Second operand.

#### Returns

[`TwoProductResult`](../interfaces/TwoProductResult.md)

Product and error such that a \* b = product + error exactly.

#### Remarks

Uses FMA (Fused Multiply-Add) if available, otherwise falls back
to Veltkamp splitting for exact multiplication.

#### Since

0.1.0

---

### twoSum()

> `static` **twoSum**(`a`, `b`): [`TwoSumResult`](../interfaces/TwoSumResult.md)

Defined in: [src/deterministic/precision-math.ts:174](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/precision-math.ts#L174)

Two-sum algorithm: exact floating-point addition.
Returns both the rounded sum and the exact error.

#### Parameters

##### a

`number`

First operand.

##### b

`number`

Second operand.

#### Returns

[`TwoSumResult`](../interfaces/TwoSumResult.md)

Sum and error such that a + b = sum + error exactly.

#### Remarks

Based on Knuth's algorithm. The error term captures the
exact rounding error, allowing for extended precision.

#### Since

0.1.0
