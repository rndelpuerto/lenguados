# Class: Matrix3

Defined in: [src/core/matrix3.ts:126](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L126)

Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.

## Remarks

- **Design:** 3×3 column-major matrix stored as 9 elements. Instance methods are
  mutable and chainable; static methods are pure with alloc-free overloads via `out`.
  Supports 2D affine transforms (translation, rotation, scale, shear).
- **Numerics:** Deterministic for cross-platform reproducibility. Uses cofactor
  expansion for inverse computation.
- **Safety:** "Safe" variants return identity matrix instead of throwing on
  singular matrices.

## Example

```typescript
// Static (pure, allocation-controlled)
const product = Matrix3.multiply(a, b);
const inv = Matrix3.inverse(m);

// Instance (mutable, chainable)
matrix.multiply(other).transpose();
```

## Since

0.7.0

## Implements

- [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

## Constructors

### Constructor

> **new Matrix3**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2508](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2508)

Creates identity matrix.

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `Matrix3`

Defined in: [src/core/matrix3.ts:2510](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2510)

Creates from 9 components (column-major).

#### Parameters

##### m00

`number`

##### m01

`number`

##### m02

`number`

##### m10

`number`

##### m11

`number`

##### m12

`number`

##### m20

`number`

##### m21

`number`

##### m22

`number`

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`array`): `Matrix3`

Defined in: [src/core/matrix3.ts:2522](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2522)

Creates from 9-element array.

#### Parameters

##### array

readonly \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`object`): `Matrix3`

Defined in: [src/core/matrix3.ts:2526](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2526)

Creates from plain object.

#### Parameters

##### object

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

#### Returns

`Matrix3`

## Accessor

### column0

#### Get Signature

> **get** **column0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3003](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3003)

Returns the first column as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Column 0 as [m00, m01, m02]

---

### column1

#### Get Signature

> **get** **column1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3014](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3014)

Returns the second column as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Column 1 as [m10, m11, m12]

---

### column2

#### Get Signature

> **get** **column2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3025](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3025)

Returns the third column as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Column 2 as [m20, m21, m22]

---

### diagonal

#### Get Signature

> **get** **diagonal**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2992](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2992)

Returns the diagonal elements as a 3-element array.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Diagonal array [m00, m11, m22]

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2912](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2912)

Returns a new inverted matrix without modifying this one.
Returns identity if singular.

##### Since

0.7.0

##### Returns

`Matrix3`

Inverted matrix

---

### negated

#### Get Signature

> **get** **negated**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2949](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2949)

Returns a new negated matrix without modifying this one.

##### Since

0.7.0

##### Returns

`Matrix3`

Negated matrix

---

### row0

#### Get Signature

> **get** **row0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3036](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3036)

Returns the first row as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Row 0 as [m00, m10, m20]

---

### row1

#### Get Signature

> **get** **row1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3047](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3047)

Returns the second row as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Row 1 as [m01, m11, m21]

---

### row2

#### Get Signature

> **get** **row2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3058](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3058)

Returns the third row as a tuple.

##### Since

0.7.0

##### Returns

\[`number`, `number`, `number`\]

Row 2 as [m02, m12, m22]

---

### translation

#### Get Signature

> **get** **translation**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2981](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2981)

Returns the translation component as a Vector2.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Translation vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2890](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2890)

Returns a new transposed matrix without modifying this one.

##### Since

0.7.0

##### Returns

`Matrix3`

Transposed matrix

---

### upperLeft2x2

#### Get Signature

> **get** **upperLeft2x2**(): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:2970](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2970)

Returns the upper-left 2×2 portion as a Matrix2.

##### Since

0.7.0

##### Returns

[`Matrix2`](Matrix2.md)

Upper-left 2x2 matrix

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix3.ts:3108](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3108)

Adds another matrix to this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3187](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3187)

Adds a scalar to all elements.

#### Parameters

##### scalar

`number`

Value to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3268](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3268)

Divides all elements by a scalar (strict).

#### Parameters

##### scalar

`number`

Divisor

#### Returns

`this`

This for chaining

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Throws

If scalar is near zero

#### Example

```typescript
new Matrix3(4, 8, 12, 2, 6, 10, 14, 16, 18).divideScalar(2); // each element halved
new Matrix3().divideScalar(0); // throws RangeError
```

#### See

- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback for zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-2) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3293](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3293)

Divides all elements by a scalar (safe).

#### Parameters

##### scalar

`number`

Divisor

#### Returns

`this`

This for chaining (sets to zero matrix if scalar is near zero)

#### Example

```typescript
new Matrix3(4, 8, 12, 2, 6, 10, 14, 16, 18).divideScalarSafe(2); // each element halved
new Matrix3().divideScalarSafe(0); // zero matrix (fallback)
```

#### See

[divideScalar](#dividescalar-2) - Throws for zero divisor

#### Since

0.7.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3316](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3316)

Unchecked scalar division for hot paths.

#### Parameters

##### scalar

`number`

Divisor (must be non-zero)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Scalar must be non-zero.

#### See

- [divideScalar](#dividescalar-2) - Throws on zero divisor
- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback on zero divisor

#### Since

0.7.0

---

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix3.ts:3232](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3232)

Fused multiply-add: `this = this * scale + m`.

#### Parameters

##### scale

`number`

Scale factor

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix3.ts:3817](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3817)

Computes element-wise modulo in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Divisor matrix

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3839](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3839)

Computes scalar modulo in place.

#### Parameters

##### scalar

`number`

Divisor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:3075](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3075)

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3174](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3174)

Alias for scale.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix3.ts:3493](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3493)

Negates all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:3553](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3553)

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3152](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3152)

Scales all elements by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix3.ts:3130](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3130)

Subtracts another matrix from this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3209](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3209)

Subtracts a scalar from all elements.

#### Parameters

##### scalar

`number`

Value to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:748](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L748)

Component-wise addition `a + b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First addend

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second addend

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with component-wise sums

#### Since

0.7.0

---

### addScalar()

> `static` **addScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:773](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L773)

Adds a scalar to all elements.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### s

`number`

Scalar to add

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with scalar added to each element

#### Since

0.7.0

---

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:994](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L994)

Divides all elements by a scalar (strict).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Divisor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with each element divided by scalar

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Throws

If scalar is near zero

#### Example

```typescript
Matrix3.divideScalar(Matrix3.fromValues(4, 8, 12, 2, 6, 10, 14, 16, 18), 2); // each element halved
Matrix3.divideScalar(Matrix3.IDENTITY, 0); // throws RangeError
```

#### See

- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback for zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-2) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1021](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1021)

Divides all elements by a scalar (safe).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Divisor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with each element divided by scalar, or zero matrix if scalar is near zero

#### Example

```typescript
Matrix3.divideScalarSafe(Matrix3.fromValues(4, 8, 12, 2, 6, 10, 14, 16, 18), 2); // each element halved
Matrix3.divideScalarSafe(Matrix3.IDENTITY, 0); // zero matrix (fallback)
```

#### See

[divideScalar](#dividescalar-2) - Throws for zero divisor

#### Since

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1050](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1050)

Divides all elements by a scalar (unchecked for hot paths).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Divisor (must be non-zero)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with each element divided by scalar

#### Remarks

**Precondition:** Scalar must be non-zero.

#### See

- [divideScalar](#dividescalar-2) - Throws on zero divisor
- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback on zero divisor

#### Since

0.7.0

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:852](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L852)

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to scale

##### scale

`number`

Scale factor

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix equal to `a * scale + b`

#### Remarks

More efficient than separate scale and add operations.

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1070](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1070)

Computes element-wise modulo of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Dividend matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Divisor matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Result matrix with element-wise modulo

#### Since

0.7.0

---

### modScalar()

> `static` **modScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1095](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1095)

Computes scalar modulo on all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Dividend matrix

##### scalar

`number`

Scalar divisor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Result matrix with each element modulo scalar

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:889](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L889)

Matrix multiplication `a × b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Left operand

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Right operand

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix product

#### Example

```typescript
const translate = Matrix3.fromTranslation(10, 20);
const rotate = Matrix3.fromRotation(Math.PI / 4);
const combined = Matrix3.multiply(translate, rotate); // rotate then translate
```

#### Since

0.7.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:965](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L965)

Alias for scale - multiplies all elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Scale factor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Scaled matrix

#### Since

0.7.0

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1119](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1119)

Negates all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Negated matrix

#### Since

0.7.0

---

### premultiply()

> `static` **premultiply**(`left`, `right`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:921](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L921)

Multiplies two matrices in reverse order: `left * right`.

#### Parameters

##### left

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Left matrix (applied second)

##### right

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Right matrix (applied first)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

`left * right`

#### Remarks

Semantically identical to [multiply](#multiply-2)(left, right). The value
of `premultiply` is in the instance method where it reverses the
multiplication order: `this.premultiply(other)` computes `other * this`.

#### Since

0.7.0

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:940](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L940)

Scales all elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Scale factor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Scaled matrix

#### Since

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:798](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L798)

Component-wise subtraction `a - b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Minuend

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Subtrahend

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with component-wise differences

#### Since

0.7.0

---

### subtractScalar()

> `static` **subtractScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:823](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L823)

Subtracts a scalar from all elements.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### s

`number`

Scalar to subtract

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with scalar subtracted from each element

#### Since

0.7.0

## Column/Row

### getColumn()

> **getColumn**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3866](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3866)

Gets a column of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Column index (0, 1, or 2)

#### Returns

\[`number`, `number`, `number`\]

Column as [row0, row1, row2]

#### Throws

RangeError if index is out of bounds

#### Since

0.7.0

---

### getRow()

> **getRow**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3918](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3918)

Gets a row of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Row index (0, 1, or 2)

#### Returns

\[`number`, `number`, `number`\]

Row as [col0, col1, col2]

#### Throws

RangeError if index is out of bounds

#### Since

0.7.0

---

### setColumn()

> **setColumn**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:3885](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3885)

Sets a column of the matrix.

#### Parameters

##### index

`number`

Column index (0, 1, or 2)

##### values

\[`number`, `number`, `number`\]

Column values [row0, row1, row2]

#### Returns

`this`

This for chaining

#### Throws

RangeError if index is out of bounds

#### Since

0.7.0

---

### setRow()

> **setRow**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:3937](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3937)

Sets a row of the matrix.

#### Parameters

##### index

`number`

Row index (0, 1, or 2)

##### values

\[`number`, `number`, `number`\]

Row values [col0, col1, col2]

#### Returns

`this`

This for chaining

#### Throws

RangeError if index is out of bounds

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix3.ts:4162](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4162)

Exact equality with other matrix (bit-identical).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare

#### Returns

`boolean`

True if all components are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/matrix3.ts:4303](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4303)

Tests if any element is infinite (±Infinity).

#### Returns

`boolean`

True if any element is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix3.ts:4281](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4281)

Tests if any element is NaN.

#### Returns

`boolean`

True if any element is NaN

#### Since

0.7.0

---

### isAffine()

> **isAffine**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2871](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2871)

Tests if matrix is affine (bottom row is [0, 0, 1]).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is affine

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4359](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4359)

Tests if this matrix is diagonal (off-diagonal elements ≈ 0).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is diagonal

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix3.ts:4259](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4259)

Tests if all elements are finite.

#### Returns

`boolean`

True if all elements are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4192](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4192)

Tests if this matrix is an identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if this is an identity matrix

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2858](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2858)

Tests if matrix is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if determinant is not near zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4237](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4237)

Tests if all elements are near zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all elements are within epsilon of zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4379](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4379)

Tests if this matrix is orthogonal (M \* M^T = I).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4339](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4339)

Tests if this matrix is skew-symmetric (M = -M^T).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is skew-symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4319](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4319)

Tests if this matrix is symmetric (M = M^T).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if matrix is symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix3.ts:4214](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4214)

Tests if all elements are exactly zero.

#### Returns

`boolean`

True if all elements are zero

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4179](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4179)

Approximate equality with other matrix using relative tolerance.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix3.ts:1555](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1555)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix

#### Returns

`boolean`

True if all components are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1660](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1660)

Tests if any element is infinite (±Infinity).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

#### Returns

`boolean`

True if any element is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1634](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1634)

Tests if any element is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

#### Returns

`boolean`

True if any element is NaN

#### Since

0.7.0

---

### isAffine()

> `static` **isAffine**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2304](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2304)

Tests if a matrix is affine (bottom row is [0, 0, 1]).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is affine

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1772](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1772)

Tests if matrix is diagonal.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if off-diagonal elements are near zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1611](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1611)

Tests if all elements are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

#### Returns

`boolean`

True if all elements are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1685](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1685)

Tests if matrix is identity.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is identity

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1713](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1713)

Tests if matrix is invertible (determinant ≠ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is invertible (non-singular)

#### Remarks

A matrix is invertible when its determinant is non-zero.
This follows the Eigen C++ convention.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1528](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1528)

Tests if all elements are near zero.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all elements are within epsilon of zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isOrthogonal()

> `static` **isOrthogonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1802](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1802)

Tests if a matrix is orthogonal (M \* M^T = I).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal

#### Remarks

Checks full 3×3 orthogonality: all three columns must be unit length and
mutually perpendicular (dot products near zero). Affine matrices with
non-zero translation in the third column will fail this check. For affine
use cases, check the upper-left 2×2 linear part directly via
[Matrix2.isOrthogonal](Matrix2.md#isorthogonal-2).

Uses [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) as default tolerance.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1751](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1751)

Tests if matrix is skew-symmetric (M = -M^T).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is skew-symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1730](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1730)

Tests if matrix is symmetric (M = M^T).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if matrix is symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1504](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1504)

Tests for exact equality with the zero matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

#### Returns

`boolean`

True if all elements are exactly zero

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1584](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1584)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
This scales with value magnitude, making it robust for both small and large values.

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix3.ts:2807](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2807)

Calculates the determinant.

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix3.ts:2835](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2835)

Calculates the Frobenius norm.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²)

#### Since

0.7.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix3.ts:2791](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2791)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians

#### Since

0.7.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2777](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2777)

Extracts scale factors from the matrix (always positive).

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis (always ≥ 0)

#### Remarks

Returns the length of each column vector. Values are always non-negative
since `hypot` computes magnitudes. This does NOT account for determinant
sign (reflection). Use [Matrix3.decompose](#decompose-2) for signed scale that
matches the rotation convention.

#### Since

0.7.0

---

### getTranslation()

> **getTranslation**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2758](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2758)

Extracts translation vector from the matrix.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Translation as Vector2

#### Since

0.7.0

---

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix3.ts:2823](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2823)

Calculates the trace (sum of diagonal).

#### Returns

`number`

Trace value

#### Since

0.7.0

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1859](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1859)

Calculates the determinant.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate determinant of

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1889](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1889)

Calculates the Frobenius norm.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate norm of

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²)

#### Since

0.7.0

---

### getRotation()

> `static` **getRotation**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1970](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1970)

Extracts rotation angle from a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

#### Returns

`number`

Rotation angle in radians

#### Remarks

Computes the angle from the first column vector after normalization.
Returns 0 for matrices with near-zero scale (degenerate rotation).

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
Matrix3.getRotation(m); // ≈ PI/4
```

#### Since

0.7.0

---

### getScale()

> `static` **getScale**(`matrix`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1945](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1945)

Extracts scale factors from a matrix (always positive).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis (always ≥ 0)

#### Remarks

Returns the length of each column vector. Values are always non-negative
since `hypot` computes magnitudes. This does NOT account for determinant
sign (reflection). Use [Matrix3.decompose](#decompose-2) for signed scale.

#### Example

```typescript
const m = Matrix3.fromScaling(new Vector2(2, 3));
Matrix3.getScale(m); // Vector2(2, 3)
Matrix3.getScale(m, out); // writes to out
```

#### Since

0.7.0

---

### getTranslation()

> `static` **getTranslation**(`matrix`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1919](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1919)

Extracts translation from a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Translation vector (m20, m21)

#### Example

```typescript
const m = Matrix3.fromTranslation(new Vector2(10, 20));
Matrix3.getTranslation(m); // Vector2(10, 20)
Matrix3.getTranslation(m, out); // writes to out
```

#### Since

0.7.0

---

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1876](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1876)

Calculates the trace (sum of diagonal).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate trace of

#### Returns

`number`

Trace value

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `9` = `9`

Defined in: [src/core/matrix3.ts:151](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L151)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### EPSILON_MATRIX

> `readonly` `static` **EPSILON_MATRIX**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:172](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L172)

Epsilon matrix (EPSILON in all elements).

#### Since

0.7.0

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:181](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L181)

Flip horizontally (mirror across Y axis).

#### Since

0.7.0

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:195](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L195)

Flip both axes (equivalent to ROTATE_180).

#### Since

0.7.0

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:188](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L188)

Flip vertically (mirror across X axis).

#### Since

0.7.0

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:144](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L144)

Identity matrix (no transformation).

#### Since

0.7.0

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:165](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L165)

All-ones matrix.

#### Since

0.7.0

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:209](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L209)

180° rotation.

#### Since

0.7.0

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:216](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L216)

270° counter-clockwise rotation (90° clockwise).

#### Since

0.7.0

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:202](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L202)

90° counter-clockwise rotation.

#### Since

0.7.0

---

### SCALE_2

> `readonly` `static` **SCALE_2**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:223](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L223)

Uniform scale by 2.

#### Since

0.7.0

---

### SCALE_HALF

> `readonly` `static` **SCALE_HALF**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:230](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L230)

Uniform scale by 0.5.

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:158](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L158)

Zero matrix.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix3.ts:4652](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4652)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding all 9 elements

#### Example

```typescript
const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = matrix;
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Matrix3`

Defined in: [src/core/matrix3.ts:4636](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4636)

Creates a deep copy of this matrix.

#### Returns

`Matrix3`

New Matrix3 with identical values

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
const copy = m.clone();
copy.identity(); // Original unchanged
```

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`, `columnMajor?`): `T` \| \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:4487](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4487)

Writes the matrix to an array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

Array type (number[], Float32Array, Float64Array, etc.)

#### Parameters

##### out?

`T`

Optional output array. If not provided, returns a new number[]

##### offset?

`number` = `0`

Write offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

`T` \| \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

The output array, or a new tuple if no output was provided

#### Remarks

Follows the same pattern as [Vector2.toArray](Vector2.md#toarray) for API consistency.
Accepts any array-like type that supports indexed assignment.

#### Default Value

`0`

#### Default Value

`true`

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:4592](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4592)

Converts the matrix to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Object suitable for JSON serialization

#### Since

0.7.0

---

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:4551](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4551)

Extracts the upper-left 2×2 portion as a Matrix2.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix

#### Returns

[`Matrix2`](Matrix2.md)

Matrix2 containing upper-left 2×2 portion

#### Since

0.7.0

---

### toObject()

> **toObject**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:4569](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4569)

Converts the matrix to a plain object.

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Object with m00-m22 properties

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 2);
const obj = m.toObject();
```

#### Since

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix3.ts:4616](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4616)

Creates a human-readable string representation.

#### Parameters

##### precision

`number` = `4`

Decimal places.

#### Returns

`string`

Formatted string

#### Default Value

`4`

#### Example

```typescript
const m = Matrix3.IDENTITY;
console.log(m.toString());
// Matrix3(
//   1.0000, 0.0000, 0.0000
//   0.0000, 1.0000, 0.0000
//   0.0000, 0.0000, 1.0000
// )
```

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:291](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L291)

Creates a deep copy of a matrix.

#### Parameters

##### source

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clone

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with identical components

#### Example

```typescript
const copy = Matrix3.clone(original);
Matrix3.clone(original, existing); // reuse allocation
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Matrix3`

Defined in: [src/core/matrix3.ts:321](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L321)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### destination

`Matrix3`

Target matrix to receive the copy

#### Returns

`Matrix3`

The destination matrix

#### Example

```typescript
const dest = new Matrix3();
Matrix3.copy(source, dest); // dest now has source's components
```

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:704](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L704)

Creates a matrix from a flat numeric array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Numeric array with at least 9 elements

##### offset

`number` = `0`

Index of the first element.

##### columnMajor

`boolean` = `true`

If true, reads column-major; if false, row-major.

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 initialized from the array

#### Default Value

`0`

#### Default Value

`true`

#### Throws

If offset is out of bounds

#### Example

```typescript
const m = Matrix3.fromArray([1, 0, 0, 0, 1, 0, 5, 10, 1]);
Matrix3.fromArray([1, 0, 0, 0, 1, 0, 5, 10, 1], 0, true, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `col2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:550](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L550)

Creates a matrix from column vectors.

#### Parameters

##### col0

readonly \[`number`, `number`, `number`\]

First column [m00, m01, m02]

##### col1

readonly \[`number`, `number`, `number`\]

Second column [m10, m11, m12]

##### col2

readonly \[`number`, `number`, `number`\]

Third column [m20, m21, m22]

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with the specified columns

#### Example

```typescript
const m = Matrix3.fromColumns([1, 0, 0], [0, 1, 0], [5, 10, 1]);
Matrix3.fromColumns([1, 0, 0], [0, 1, 0], [5, 10, 1], existing); // reuse allocation
```

#### Since

0.7.0

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:482](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L482)

Creates a Matrix3 from a Matrix2 (embeds 2×2 in homogeneous coordinates).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source 2×2 matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with the 2×2 matrix in the upper-left

#### Example

```typescript
const m3 = Matrix3.fromMatrix2(mat2);
Matrix3.fromMatrix2(mat2, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:352](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L352)

Creates a matrix from a plain object.

#### Parameters

##### object

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Plain object with m00-m22 properties

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with the object's components

#### Throws

If any component is not finite

#### Example

```typescript
const m = Matrix3.fromObject({
 m00: 1,
 m01: 0,
 m02: 0,
 m10: 0,
 m11: 1,
 m12: 0,
 m20: 5,
 m21: 10,
 m22: 1,
});
Matrix3.fromObject(obj, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:402](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L402)

Creates a rotation matrix from an angle or Rotation2.

#### Parameters

##### rotation

Angle in radians or a Rotation2Like object

`number` | [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the rotation

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
Matrix3.fromRotation(Math.PI / 2, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `row2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:587](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L587)

Creates a matrix from row vectors.

#### Parameters

##### row0

readonly \[`number`, `number`, `number`\]

First row [m00, m10, m20]

##### row1

readonly \[`number`, `number`, `number`\]

Second row [m01, m11, m21]

##### row2

readonly \[`number`, `number`, `number`\]

Third row [m02, m12, m22]

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with the specified rows

#### Example

```typescript
const m = Matrix3.fromRows([1, 0, 5], [0, 1, 10], [0, 0, 1]);
Matrix3.fromRows([1, 0, 5], [0, 1, 10], [0, 0, 1], existing); // reuse allocation
```

#### Since

0.7.0

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:433](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L433)

Creates a scale matrix.

#### Parameters

##### scale

Scale factor (uniform) or Vector2 (non-uniform)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the scale

#### Example

```typescript
const m = Matrix3.fromScale(2); // uniform scale
const n = Matrix3.fromScale({ x: 2, y: 3 }); // non-uniform scale
Matrix3.fromScale({ x: 2, y: 3 }, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:462](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L462)

Creates a shear transformation matrix.

#### Parameters

##### shear

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Shear factors (x: horizontal, y: vertical)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Shear matrix

#### Remarks

A shear matrix distorts shapes along one axis:

- shear.x skews horizontally (x += shear.x \* y)
- shear.y skews vertically (y += shear.y \* x)

#### Example

```typescript
const shear = Matrix3.fromShear({ x: 0.5, y: 0 }); // Horizontal shear
const point = Matrix3.apply(shear, { x: 0, y: 1 }); // (0.5, 1)
```

#### Since

0.7.0

---

### fromTransform2()

> `static` **fromTransform2**(`translation`, `rotation`, `scale`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:504](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L504)

Creates a transform matrix from translation, rotation, and scale.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector

##### rotation

`number`

Rotation angle in radians

##### scale

Scale factor (uniform) or Vector2 (non-uniform)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the combined transform (T × R × S)

#### Example

```typescript
const m = Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2);
Matrix3.fromTransform2({ x: 10, y: 20 }, 0, { x: 1, y: 2 }, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromTranslation()

> `static` **fromTranslation**(`translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:382](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L382)

Creates a translation matrix.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the translation

#### Example

```typescript
const m = Matrix3.fromTranslation({ x: 5, y: 10 });
Matrix3.fromTranslation({ x: 5, y: 10 }, existing); // reuse allocation
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:260](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L260)

Creates a matrix from explicit components.

#### Parameters

##### m00

`number`

Element at row 0, column 0

##### m01

`number`

Element at row 1, column 0

##### m02

`number`

Element at row 2, column 0

##### m10

`number`

Element at row 0, column 1

##### m11

`number`

Element at row 1, column 1

##### m12

`number`

Element at row 2, column 1

##### m20

`number`

Element at row 0, column 2

##### m21

`number`

Element at row 1, column 2

##### m22

`number`

Element at row 2, column 2

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 with the specified components

#### Example

```typescript
const m = Matrix3.fromValues(1, 0, 0, 0, 1, 0, 5, 10, 1);
Matrix3.fromValues(1, 0, 0, 0, 1, 0, 5, 10, 1, existing); // reuse allocation
```

#### Since

0.7.0

---

### ortho()

> `static` **ortho**(`left`, `right`, `bottom`, `top`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:629](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L629)

Creates an orthographic projection matrix for 2D.

#### Parameters

##### left

`number`

Left boundary

##### right

`number`

Right boundary

##### bottom

`number`

Bottom boundary

##### top

`number`

Top boundary

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the orthographic projection

#### Throws

If width (right - left) or height (top - bottom) is near zero (degenerate bounds)

#### Example

```typescript
const proj = Matrix3.ortho(0, 800, 0, 600);
Matrix3.ortho(0, 800, 0, 600, existing); // reuse allocation
Matrix3.ortho(5, 5, 0, 600); // throws RangeError (zero width)
```

#### See

[orthoSafe](#orthosafe) - Returns fallback for degenerate bounds

#### Since

0.7.0

---

### orthoSafe()

> `static` **orthoSafe**(`left`, `right`, `bottom`, `top`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:668](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L668)

Creates an orthographic projection matrix (safe version).
Returns identity for degenerate bounds.

#### Parameters

##### left

`number`

Left boundary

##### right

`number`

Right boundary

##### bottom

`number`

Bottom boundary

##### top

`number`

Top boundary

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 representing the orthographic projection, or identity for degenerate bounds

#### Example

```typescript
const proj = Matrix3.orthoSafe(0, 800, 0, 600); // normal projection
Matrix3.orthoSafe(5, 5, 0, 600); // identity (zero width)
```

#### See

[ortho](#ortho) - Throws for degenerate bounds

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:4413](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4413)

Linear interpolation with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:4437](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4437)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:4451](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4451)

Smooth step interpolation in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1414](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1414)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor (clamped)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Interpolated matrix

#### Remarks

Component-wise lerp between rotation matrices does not produce a valid
rotation matrix. For affine transforms, consider decomposing into
translation/rotation/scale and interpolating each independently.

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1449](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1449)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Interpolated matrix

#### Remarks

This is an alias for `lerp` which already clamps t.
Provided for API symmetry with Vector2.

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1470](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1470)

Smooth step interpolation between matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Smoothly interpolated matrix

#### Since

0.7.0

## Matrix Operations

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix3.ts:3519](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3519)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This for chaining

#### Remarks

The adjugate is the transpose of the cofactor matrix.
For a 3×3 matrix, each element is the determinant of the 2×2
minor matrix, with alternating signs.

#### Since

0.7.0

---

### decompose()

> **decompose**(): `object`

Defined in: [src/core/matrix3.ts:3584](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3584)

Decomposes this matrix into translation, rotation, and scale components.

#### Returns

`object`

Object with translation (Vector2), rotation (radians), and scale (Vector2)

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

##### translation

> **translation**: [`Vector2`](Vector2.md)

#### Since

0.7.0

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix3.ts:3365](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3365)

Inverts this matrix in place.

#### Returns

`this`

This for chaining

#### Throws

Error if singular

#### Example

```typescript
Matrix3.fromRotation(Math.PI / 4).inverse(); // rotated back by -PI/4
new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).inverse(); // throws RangeError (singular)
```

#### See

- [inverseSafe](#inversesafe-2) - Returns fallback for singular matrix
- [inverseUnchecked](#inverseunchecked-2) - No validation

#### Since

0.7.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix3.ts:3411](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3411)

Inverts this matrix in place (safe version).

#### Returns

`this`

This for chaining (returns identity if singular)

#### Example

```typescript
Matrix3.fromRotation(Math.PI / 4).inverseSafe(); // rotated back by -PI/4
new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).inverseSafe(); // identity (fallback)
```

#### See

[inverse](#inverse-2) - Throws for singular matrix

#### Since

0.7.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix3.ts:3458](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3458)

Inverts this matrix in place (unchecked version).

#### Returns

`this`

This for chaining

#### Remarks

Assumes matrix is invertible. Use for hot paths when you've already validated.

#### See

- [inverse](#inverse-2) - Throws on singular matrix
- [inverseSafe](#inversesafe-2) - Returns fallback on singular matrix

#### Since

0.7.0

---

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:4119](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4119)

Transforms multiple points efficiently (batch operation).

#### Parameters

##### points

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of points to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed points

#### Remarks

More efficient than calling transformPoint multiple times for large arrays
because it avoids repeated function call overhead.

#### Example

```typescript
const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
const worldVertices = matrix.transformPoints(vertices);
```

#### Since

0.7.0

---

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:4139](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4139)

Transforms multiple vectors efficiently (batch operation).

#### Parameters

##### vectors

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of vectors to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed vectors

#### Remarks

Unlike points, vectors are not affected by translation.

#### Since

0.7.0

---

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix3.ts:3333](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3333)

Transposes this matrix in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1988](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1988)

Calculates the adjugate (adjoint) matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Adjugate matrix (transpose of cofactor matrix)

#### Since

0.7.0

---

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix3.ts:2225](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2225)

Decomposes an affine matrix into translation, rotation, and scale.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to decompose

#### Returns

`object`

Object with translation, rotation (radians), and scale

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

##### translation

> **translation**: [`Vector2`](Vector2.md)

#### Remarks

**Numerical Stability:** For matrices with extremely small scale components
(magnitude < 1e-10), the rotation extraction may be imprecise. If scale
approaches zero, rotation defaults to 0 radians. For matrices with scale
components smaller than ~1e-154, underflow may occur in intermediate
calculations due to IEEE 754 double precision limits.

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2024](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2024)

Inverts a matrix. Throws if singular.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted matrix

#### Throws

If matrix is singular

#### Example

```typescript
Matrix3.inverse(Matrix3.fromRotation(Math.PI / 4)); // rotated back by -PI/4
Matrix3.inverse(Matrix3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0)); // throws RangeError (singular)
```

#### See

- [inverseSafe](#inversesafe-2) - Returns fallback for singular matrix
- [inverseUnchecked](#inverseunchecked-2) - No validation

#### Since

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2074](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2074)

Safe inverse. Returns identity if singular.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted matrix or identity if singular

#### Example

```typescript
Matrix3.inverseSafe(Matrix3.fromRotation(Math.PI / 4)); // rotated back by -PI/4
Matrix3.inverseSafe(Matrix3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0)); // identity (fallback)
```

#### See

[inverse](#inverse-2) - Throws for singular matrix

#### Since

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2124](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2124)

Unchecked inverse for hot paths. Assumes matrix is invertible.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted matrix

#### Remarks

**Precondition:** Matrix must be invertible (non-singular).
Calling with singular matrix produces Infinity/NaN elements.

#### See

- [inverse](#inverse-2) - Throws on singular matrix
- [inverseSafe](#inversesafe-2) - Returns fallback on singular matrix

#### Since

0.7.0

---

### transformPoints()

> `static` **transformPoints**(`matrix`, `points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:2258](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2258)

Transforms multiple points by a matrix (batch operation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transformation matrix

##### points

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of points to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed points

#### Since

0.7.0

---

### transformVectors()

> `static` **transformVectors**(`matrix`, `vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:2283](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2283)

Transforms multiple vectors by a matrix (batch operation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transformation matrix

##### vectors

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of vectors to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed vectors

#### Remarks

Unlike points, vectors are not affected by translation.

#### Since

0.7.0

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1836](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1836)

Transposes a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Transposed matrix

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`matrix`): `this`

Defined in: [src/core/matrix3.ts:2679](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2679)

Copies from another matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix3.ts:2729](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2729)

Resets to identity matrix.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `this`

Defined in: [src/core/matrix3.ts:2647](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2647)

Sets all matrix elements.

#### Parameters

##### m00

`number`

Element at row 0, column 0

##### m01

`number`

Element at row 1, column 0

##### m02

`number`

Element at row 2, column 0

##### m10

`number`

Element at row 0, column 1

##### m11

`number`

Element at row 1, column 1

##### m12

`number`

Element at row 2, column 1

##### m20

`number`

Element at row 0, column 2

##### m21

`number`

Element at row 1, column 2

##### m22

`number`

Element at row 2, column 2

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/matrix3.ts:2702](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2702)

Sets this matrix from array values (column-major order).

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array with 9 elements

##### offset

`number` = `0`

Starting index (default 0)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix3.ts:2741](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2741)

Sets all elements to zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix3.ts:2485](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2485)

Element at row 0, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m00`](../../types/interfaces/Matrix3Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix3.ts:2487](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2487)

Element at row 1, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m01`](../../types/interfaces/Matrix3Like.md#m01)

---

### m02

> **m02**: `number`

Defined in: [src/core/matrix3.ts:2489](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2489)

Element at row 2, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m02`](../../types/interfaces/Matrix3Like.md#m02)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix3.ts:2491](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2491)

Element at row 0, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m10`](../../types/interfaces/Matrix3Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix3.ts:2493](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2493)

Element at row 1, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m11`](../../types/interfaces/Matrix3Like.md#m11)

---

### m12

> **m12**: `number`

Defined in: [src/core/matrix3.ts:2495](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2495)

Element at row 2, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m12`](../../types/interfaces/Matrix3Like.md#m12)

---

### m20

> **m20**: `number`

Defined in: [src/core/matrix3.ts:2497](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2497)

Element at row 0, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m20`](../../types/interfaces/Matrix3Like.md#m20)

---

### m21

> **m21**: `number`

Defined in: [src/core/matrix3.ts:2499](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2499)

Element at row 1, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m21`](../../types/interfaces/Matrix3Like.md#m21)

---

### m22

> **m22**: `number`

Defined in: [src/core/matrix3.ts:2501](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2501)

Element at row 2, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m22`](../../types/interfaces/Matrix3Like.md#m22)

## Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix3.ts:3684](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3684)

Takes the absolute value of all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix3.ts:3621](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3621)

Ceils all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### clamp()

> **clamp**(`minMatrix`, `maxMatrix`): `this`

Defined in: [src/core/matrix3.ts:3728](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3728)

Clamps all elements to a range in place.

#### Parameters

##### minMatrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Minimum values per element

##### maxMatrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Maximum values per element

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### clampScalar()

> **clampScalar**(`minValue`, `maxValue`): `this`

Defined in: [src/core/matrix3.ts:3751](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3751)

Clamps all elements to a scalar range in place.

#### Parameters

##### minValue

`number`

Minimum value

##### maxValue

`number`

Maximum value

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix3.ts:3600](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3600)

Floors all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix3.ts:3795](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3795)

Takes element-wise maximum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix3.ts:3773](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3773)

Takes element-wise minimum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix3.ts:3991](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3991)

Applies a rotation to this matrix in place.

#### Parameters

##### angle

`number`

Rotation angle in radians

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### rotateCS()

> **rotateCS**(`cos`, `sin`): `this`

Defined in: [src/core/matrix3.ts:4017](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4017)

Applies a rotation to this matrix using precomputed cosine and sine values in place.

#### Parameters

##### cos

`number`

Cosine of the rotation angle

##### sin

`number`

Sine of the rotation angle

#### Returns

`this`

This for chaining

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m = new Matrix3();
m.rotateCS(rotation.cos, rotation.sin);
```

#### Since

0.7.0

---

### round()

> **round**(): `this`

Defined in: [src/core/matrix3.ts:3642](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3642)

Rounds all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### scaleBy()

> **scaleBy**(`scaleValue`): `this`

Defined in: [src/core/matrix3.ts:4043](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4043)

Applies a scale transformation to this matrix in place.

#### Parameters

##### scaleValue

Scale factor (scalar or per-axis vector)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix3.ts:3705](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3705)

Takes the sign of all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:4078](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4078)

Transforms a point by this matrix.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Remarks

Points are affected by translation (uses homogeneous coordinate w=1).

#### Since

0.7.0

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:4095](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L4095)

Transforms a vector by this matrix.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Remarks

Vectors are NOT affected by translation (uses homogeneous coordinate w=0).

#### Since

0.7.0

---

### translate()

> **translate**(`translation`): `this`

Defined in: [src/core/matrix3.ts:3973](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3973)

Applies a translation to this matrix in place.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/matrix3.ts:3663](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L3663)

Applies Math.trunc to all elements in place (rounds towards zero).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1243](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1243)

Applies absolute value to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Absolute-valued matrix

#### Since

0.7.0

---

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1171](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1171)

Applies Math.ceil to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Ceiled matrix

#### Since

0.7.0

---

### clamp()

> `static` **clamp**(`m`, `minM`, `maxM`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1343](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1343)

Component-wise clamp between two matrices.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clamp

##### minM

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Per-component minima

##### maxM

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Per-component maxima

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Clamped matrix

#### Since

0.7.0

---

### clampScalar()

> `static` **clampScalar**(`m`, `min`, `max`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1374](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1374)

Clamps all elements between scalar bounds.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clamp

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Clamped matrix

#### Since

0.7.0

---

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1147](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1147)

Applies Math.floor to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Floored matrix

#### Since

0.7.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1317](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1317)

Component-wise maximum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with component-wise maxima

#### Since

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1292](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1292)

Component-wise minimum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with component-wise minima

#### Since

0.7.0

---

### rotate()

> `static` **rotate**(`matrix`, `angle`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2375](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2375)

Applies a rotation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to rotate

##### angle

`number`

Rotation angle in radians

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Rotated matrix

#### Remarks

Equivalent to `Matrix3.multiply(matrix, Matrix3.fromRotation(angle), out)`
but more efficient as it avoids creating an intermediate matrix.

#### Example

```typescript
const m = Matrix3.fromTranslation(100, 50);
const rotated = Matrix3.rotate(m, Math.PI / 4);
```

#### Since

0.7.0

---

### rotateCS()

> `static` **rotateCS**(`matrix`, `cos`, `sin`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2406](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2406)

Rotates a matrix using precomputed cosine and sine values.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to rotate

##### cos

`number`

Cosine of the rotation angle

##### sin

`number`

Sine of the rotation angle

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Rotated matrix

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m1 = Matrix3.fromTranslation(100, 50);
const m2 = Matrix3.fromTranslation(200, 100);
// Apply same rotation to both matrices efficiently
const r1 = Matrix3.rotateCS(m1, rotation.cos, rotation.sin);
const r2 = Matrix3.rotateCS(m2, rotation.cos, rotation.sin);
```

#### Since

0.7.0

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1195](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1195)

Applies Math.round to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Rounded matrix

#### Since

0.7.0

---

### scaleBy()

> `static` **scaleBy**(`matrix`, `scaleValue`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2453](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2453)

Applies a scale transformation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to scale

##### scaleValue

Scale factor (scalar or per-axis vector)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Scaled matrix

#### Remarks

Equivalent to `Matrix3.multiply(matrix, Matrix3.fromScale(scaleValue), out)`
but more efficient as it avoids creating an intermediate matrix.

#### Example

```typescript
const m = Matrix3.fromTranslation(100, 50);
const scaled = Matrix3.scaleBy(m, { x: 2, y: 0.5 });
```

#### Since

0.7.0

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1267](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1267)

Applies sign function to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with signs (-1, 0, or 1)

#### Since

0.7.0

---

### transformPoint()

> `static` **transformPoint**(`matrix`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2164](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2164)

Transforms a point by the matrix (applies translation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transform matrix

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Since

0.7.0

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2197](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2197)

Transforms a vector by the matrix (ignores translation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transform matrix

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Since

0.7.0

---

### translate()

> `static` **translate**(`matrix`, `translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2333](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L2333)

Applies a translation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to translate

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Translated matrix

#### Remarks

Equivalent to `Matrix3.multiply(matrix, Matrix3.fromTranslation(translation), out)`
but more efficient as it avoids creating an intermediate matrix.

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
const translated = Matrix3.translate(m, { x: 100, y: 50 });
```

#### Since

0.7.0

---

### trunc()

> `static` **trunc**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1219](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/matrix3.ts#L1219)

Applies Math.trunc to all elements (rounds towards zero).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Truncated matrix

#### Since

0.7.0
