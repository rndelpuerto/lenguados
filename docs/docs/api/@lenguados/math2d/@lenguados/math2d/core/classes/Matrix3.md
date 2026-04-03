# Class: Matrix3

Defined in: [src/core/matrix3.ts:127](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L127)

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

Defined in: [src/core/matrix3.ts:2828](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2828)

Creates identity matrix.

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `Matrix3`

Defined in: [src/core/matrix3.ts:2830](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2830)

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

Defined in: [src/core/matrix3.ts:2842](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2842)

Creates from 9-element array.

#### Parameters

##### array

readonly \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`object`): `Matrix3`

Defined in: [src/core/matrix3.ts:2846](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2846)

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

Defined in: [src/core/matrix3.ts:3348](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3348)

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

Defined in: [src/core/matrix3.ts:3359](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3359)

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

Defined in: [src/core/matrix3.ts:3370](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3370)

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

Defined in: [src/core/matrix3.ts:3337](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3337)

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

Defined in: [src/core/matrix3.ts:3257](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3257)

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

Defined in: [src/core/matrix3.ts:3294](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3294)

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

Defined in: [src/core/matrix3.ts:3381](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3381)

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

Defined in: [src/core/matrix3.ts:3392](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3392)

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

Defined in: [src/core/matrix3.ts:3403](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3403)

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

Defined in: [src/core/matrix3.ts:3326](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3326)

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

Defined in: [src/core/matrix3.ts:3235](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3235)

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

Defined in: [src/core/matrix3.ts:3315](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3315)

Returns the upper-left 2×2 portion as a Matrix2.

##### Since

0.7.0

##### Returns

[`Matrix2`](Matrix2.md)

Upper-left 2x2 matrix

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix3.ts:3453](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3453)

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

Defined in: [src/core/matrix3.ts:3519](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3519)

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

Defined in: [src/core/matrix3.ts:3600](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3600)

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

Defined in: [src/core/matrix3.ts:3625](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3625)

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

Defined in: [src/core/matrix3.ts:3648](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3648)

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

> **fma**(`scalar`, `m`): `this`

Defined in: [src/core/matrix3.ts:3564](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3564)

Fused multiply-add: `this = this * scalar + m`.

#### Parameters

##### scalar

`number`

Scalar multiplier

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

Defined in: [src/core/matrix3.ts:4280](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4280)

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

Defined in: [src/core/matrix3.ts:4302](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4302)

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

Defined in: [src/core/matrix3.ts:3420](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3420)

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

Defined in: [src/core/matrix3.ts:3497](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3497)

Multiplies all elements by a scalar.

#### Parameters

##### scalar

`number`

Scalar multiplier

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix3.ts:3956](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3956)

Negates all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:4016](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4016)

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

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix3.ts:3475](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3475)

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

Defined in: [src/core/matrix3.ts:3541](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3541)

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

Defined in: [src/core/matrix3.ts:793](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L793)

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

> `static` **addScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:818](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L818)

Adds a scalar to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

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

Defined in: [src/core/matrix3.ts:1024](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1024)

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

Defined in: [src/core/matrix3.ts:1051](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1051)

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

Defined in: [src/core/matrix3.ts:1080](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1080)

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

> `static` **fma**(`a`, `scalar`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:897](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L897)

Fused multiply-add: `a * scalar + b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Input matrix

##### scalar

`number`

Scalar multiplier

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix equal to `a * scalar + b`

#### Remarks

More efficient than separate multiplyScalar and add operations.

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1100](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1100)

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

Defined in: [src/core/matrix3.ts:1125](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1125)

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

Defined in: [src/core/matrix3.ts:934](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L934)

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
const translate = Matrix3.fromTranslation({ x: 10, y: 20 });
const rotate = Matrix3.fromRotation(Math.PI / 4);
const combined = Matrix3.multiply(translate, rotate); // rotate then translate
```

#### Since

0.7.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:985](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L985)

Multiplies all matrix elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

`number`

Scalar multiplier

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Matrix with all elements multiplied by scalar

#### Since

0.7.0

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1149](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1149)

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

Defined in: [src/core/matrix3.ts:966](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L966)

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

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:843](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L843)

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

> `static` **subtractScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:868](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L868)

Subtracts a scalar from all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix

##### scalar

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

Defined in: [src/core/matrix3.ts:4329](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4329)

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

Defined in: [src/core/matrix3.ts:4381](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4381)

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

Defined in: [src/core/matrix3.ts:4348](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4348)

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

Defined in: [src/core/matrix3.ts:4400](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4400)

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

Defined in: [src/core/matrix3.ts:4625](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4625)

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

Defined in: [src/core/matrix3.ts:4716](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4716)

Tests if any element is infinite (±Infinity).

#### Returns

`boolean`

True if any element is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix3.ts:4704](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4704)

Tests if any element is NaN.

#### Returns

`boolean`

True if any element is NaN

#### Since

0.7.0

---

### isAffine()

> **isAffine**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3216](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3216)

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

Defined in: [src/core/matrix3.ts:4761](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4761)

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

Defined in: [src/core/matrix3.ts:4692](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4692)

Tests if all elements are finite.

#### Returns

`boolean`

True if all elements are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4655](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4655)

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

Defined in: [src/core/matrix3.ts:3203](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3203)

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

Defined in: [src/core/matrix3.ts:4680](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4680)

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

Defined in: [src/core/matrix3.ts:4774](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4774)

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

Defined in: [src/core/matrix3.ts:4748](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4748)

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

Defined in: [src/core/matrix3.ts:4732](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4732)

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

Defined in: [src/core/matrix3.ts:4667](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4667)

Tests if all elements are exactly zero.

#### Returns

`boolean`

True if all elements are zero

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:4642](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4642)

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

Defined in: [src/core/matrix3.ts:1586](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1586)

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

Defined in: [src/core/matrix3.ts:1691](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1691)

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

Defined in: [src/core/matrix3.ts:1665](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1665)

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

Defined in: [src/core/matrix3.ts:2624](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2624)

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

Defined in: [src/core/matrix3.ts:1803](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1803)

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

Defined in: [src/core/matrix3.ts:1642](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1642)

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

Defined in: [src/core/matrix3.ts:1716](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1716)

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

Defined in: [src/core/matrix3.ts:1744](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1744)

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

Defined in: [src/core/matrix3.ts:1559](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1559)

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

Defined in: [src/core/matrix3.ts:1833](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1833)

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

Defined in: [src/core/matrix3.ts:1782](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1782)

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

Defined in: [src/core/matrix3.ts:1761](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1761)

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

Defined in: [src/core/matrix3.ts:1535](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1535)

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

Defined in: [src/core/matrix3.ts:1615](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1615)

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

Defined in: [src/core/matrix3.ts:3152](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3152)

Calculates the determinant.

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix3.ts:3180](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3180)

Calculates the Frobenius norm.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²)

#### Since

0.7.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix3.ts:3136](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3136)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians

#### Since

0.7.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:3122](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3122)

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

Defined in: [src/core/matrix3.ts:3103](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3103)

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

Defined in: [src/core/matrix3.ts:3168](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3168)

Calculates the trace (sum of diagonal).

#### Returns

`number`

Trace value

#### Since

0.7.0

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1890](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1890)

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

Defined in: [src/core/matrix3.ts:1920](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1920)

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

Defined in: [src/core/matrix3.ts:2001](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2001)

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

Defined in: [src/core/matrix3.ts:1976](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1976)

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

Defined in: [src/core/matrix3.ts:1950](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1950)

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

Defined in: [src/core/matrix3.ts:1907](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1907)

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

Defined in: [src/core/matrix3.ts:152](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L152)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:166](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L166)

Flip horizontally (mirror across Y axis).

#### Since

0.7.0

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:180](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L180)

Flip both axes (equivalent to ROTATE_180).

#### Since

0.7.0

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:173](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L173)

Flip vertically (mirror across X axis).

#### Since

0.7.0

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:145](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L145)

Identity matrix (no transformation).

#### Since

0.7.0

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:194](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L194)

180° rotation.

#### Since

0.7.0

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:201](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L201)

270° counter-clockwise rotation (90° clockwise).

#### Since

0.7.0

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:187](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L187)

90° counter-clockwise rotation.

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:159](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L159)

Zero matrix.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix3.ts:5034](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L5034)

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

Defined in: [src/core/matrix3.ts:5018](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L5018)

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

Defined in: [src/core/matrix3.ts:4869](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4869)

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

Defined in: [src/core/matrix3.ts:4974](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4974)

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

Defined in: [src/core/matrix3.ts:4933](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4933)

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

Defined in: [src/core/matrix3.ts:4951](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4951)

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

Defined in: [src/core/matrix3.ts:4998](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4998)

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

Defined in: [src/core/matrix3.ts:262](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L262)

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

Defined in: [src/core/matrix3.ts:292](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L292)

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

Defined in: [src/core/matrix3.ts:749](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L749)

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

Defined in: [src/core/matrix3.ts:595](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L595)

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

Defined in: [src/core/matrix3.ts:497](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L497)

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

Defined in: [src/core/matrix3.ts:323](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L323)

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

### fromReflection()

> `static` **fromReflection**(`normal`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:465](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L465)

Creates a reflection matrix about a line passing through the origin with the given normal.

#### Parameters

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit normal vector of the reflection line

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Reflection matrix

#### Remarks

Implements the Householder reflector `I - 2nn^T`:

```
| 1 - 2*nx*nx   -2*nx*ny      0 |
| -2*nx*ny       1 - 2*ny*ny   0 |
| 0              0              1 |
```

The normal is assumed to be unit length (no normalization is performed).

#### Example

```typescript
// Reflect about Y-axis (normal = (1, 0)) — negates x-coordinates
const reflectY = Matrix3.fromReflection({ x: 1, y: 0 });

// Reflect about X-axis (normal = (0, 1)) — negates y-coordinates
const reflectX = Matrix3.fromReflection({ x: 0, y: 1 });
```

#### Since

0.7.0

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:373](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L373)

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

Defined in: [src/core/matrix3.ts:632](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L632)

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

Defined in: [src/core/matrix3.ts:404](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L404)

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

Defined in: [src/core/matrix3.ts:433](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L433)

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

Defined in: [src/core/matrix3.ts:519](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L519)

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

### fromTransform2Like()

> `static` **fromTransform2Like**(`transform`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:568](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L568)

Creates a matrix from a [ReadonlyTransform2Like](../../types/interfaces/ReadonlyTransform2Like.md) directly.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform with position, rotation, and scale

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

A Matrix3 encoding Scale -> Rotate -> Translate

#### Remarks

Unlike [fromTransform2](#fromtransform2), this accepts a single transform object with
position, rotation, and scale properties. The rotation is read as pre-computed
cos/sin values from the transform's rotation component.

#### Example

```typescript
const t = { position: { x: 10, y: 20 }, rotation: { cos: 1, sin: 0 }, scale: { x: 2, y: 2 } };
const m = Matrix3.fromTransform2Like(t);
```

#### Since

0.9.0

---

### fromTranslation()

> `static` **fromTranslation**(`translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:353](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L353)

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

Defined in: [src/core/matrix3.ts:231](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L231)

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

Defined in: [src/core/matrix3.ts:674](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L674)

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

Defined in: [src/core/matrix3.ts:713](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L713)

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

Defined in: [src/core/matrix3.ts:4792](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4792)

Linear interpolation with another matrix in place (unclamped).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor (unclamped, allows extrapolation)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:4819](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4819)

Clamped linear interpolation.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor (clamped to [0, 1] before interpolation)

#### Returns

`this`

This for chaining

#### Remarks

Clamps `t` to [0, 1] before delegating to [lerp](../../auxiliary/scalar/functions/lerp.md).

#### Since

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:4833](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4833)

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

Defined in: [src/core/matrix3.ts:1446](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1446)

Linear interpolation between two matrices (unclamped).

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor (unclamped, allows extrapolation)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Interpolated matrix

#### Remarks

The interpolation factor `t` is NOT clamped — values outside [0, 1] will
extrapolate beyond the input matrices. Use [lerpClamped](#lerpclamped-2) to clamp.
Component-wise lerp between rotation matrices does not produce a valid
rotation matrix. For affine transforms, consider decomposing into
translation/rotation/scale and interpolating each independently.

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1480](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1480)

Clamped linear interpolation.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor (clamped to [0, 1] before interpolation)

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Interpolated matrix

#### Remarks

Clamps `t` to [0, 1] before delegating to [lerp](../../auxiliary/scalar/functions/lerp.md).

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1501](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1501)

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

Defined in: [src/core/matrix3.ts:3982](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3982)

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

Defined in: [src/core/matrix3.ts:4047](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4047)

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

Defined in: [src/core/matrix3.ts:3697](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3697)

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

### inverseAffine()

> **inverseAffine**(): `this`

Defined in: [src/core/matrix3.ts:3834](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3834)

Inverts this affine matrix in place using an optimized path.

#### Returns

`this`

This for chaining

#### Throws

If matrix is not affine or is singular

#### Example

```typescript
Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2).inverseAffine();
```

#### See

- [inverseAffineSafe](#inverseaffinesafe-2) - Returns identity if not affine or singular
- [inverseAffineUnchecked](#inverseaffineunchecked-2) - No validation

#### Since

0.9.0

---

### inverseAffineSafe()

> **inverseAffineSafe**(): `this`

Defined in: [src/core/matrix3.ts:3880](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3880)

Inverts this affine matrix in place (safe version).

#### Returns

`this`

This for chaining (returns identity if not affine or singular)

#### Example

```typescript
Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2).inverseAffineSafe();
```

#### See

[inverseAffine](#inverseaffine-2) - Throws on non-affine or singular

#### Since

0.9.0

---

### inverseAffineUnchecked()

> **inverseAffineUnchecked**(): `this`

Defined in: [src/core/matrix3.ts:3925](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3925)

Inverts this affine matrix in place (unchecked version).

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Matrix must be affine and invertible. No validation is performed.

#### See

- [inverseAffine](#inverseaffine-2) - Throws on non-affine or singular
- [inverseAffineSafe](#inverseaffinesafe-2) - Returns identity on non-affine or singular

#### Since

0.9.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix3.ts:3743](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3743)

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

Defined in: [src/core/matrix3.ts:3790](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3790)

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

Defined in: [src/core/matrix3.ts:4582](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4582)

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

Defined in: [src/core/matrix3.ts:4602](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4602)

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

Defined in: [src/core/matrix3.ts:3665](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3665)

Transposes this matrix in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2019](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2019)

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

Defined in: [src/core/matrix3.ts:2545](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2545)

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

Defined in: [src/core/matrix3.ts:2055](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2055)

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

### inverseAffine()

> `static` **inverseAffine**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2209](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2209)

Optimized inverse for affine matrices (bottom row is [0, 0, 1]).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Affine matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted affine matrix

#### Remarks

Exploits the affine structure to compute the inverse using only the upper-left
2x2 block and translation, avoiding the full 3x3 cofactor expansion.
Throws if the matrix is not affine or if the 2x2 determinant is near zero.

#### Throws

If matrix is not affine or is singular

#### Example

```typescript
const m = Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2);
const inv = Matrix3.inverseAffine(m); // efficient affine inverse
```

#### See

- [inverseAffineSafe](#inverseaffinesafe-2) - Returns identity if not affine or singular
- [inverseAffineUnchecked](#inverseaffineunchecked-2) - No validation

#### Since

0.9.0

---

### inverseAffineSafe()

> `static` **inverseAffineSafe**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2262](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2262)

Safe optimized inverse for affine matrices.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Affine matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted affine matrix or identity if not affine/singular

#### Remarks

Returns identity if the matrix is not affine or if the 2x2 determinant is
near zero (singular).

#### Example

```typescript
Matrix3.inverseAffineSafe(affineMatrix); // efficient affine inverse
Matrix3.inverseAffineSafe(singularMatrix); // identity (fallback)
```

#### See

[inverseAffine](#inverseaffine-2) - Throws on non-affine or singular

#### Since

0.9.0

---

### inverseAffineUnchecked()

> `static` **inverseAffineUnchecked**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2310](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2310)

Unchecked optimized inverse for affine matrices.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Affine matrix to invert

##### out?

`Matrix3`

Optional output matrix

#### Returns

`Matrix3`

Inverted affine matrix

#### Remarks

**Precondition:** Matrix must be affine and invertible. No validation is performed.
Calling with a non-affine or singular matrix produces incorrect results.

#### See

- [inverseAffine](#inverseaffine-2) - Throws on non-affine or singular
- [inverseAffineSafe](#inverseaffinesafe-2) - Returns fallback on non-affine or singular

#### Since

0.9.0

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2105](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2105)

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

Defined in: [src/core/matrix3.ts:2155](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2155)

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

### solveLinearSystem()

> `static` **solveLinearSystem**(`matrix`, `b`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2358](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2358)

Solve the linear system Ax = b using Cramer's rule

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Coefficient matrix A

##### b

readonly \[`number`, `number`, `number`\]

Right-hand side vector as [b0, b1, b2]

#### Returns

\[`number`, `number`, `number`\]

Solution tuple [x0, x1, x2]

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) to test the
determinant. Throws when |det| ≤ EPSILON.

#### Throws

If matrix is singular (determinant near zero)

#### Example

```typescript
// Solve [2 0 0; 0 3 0; 0 0 4] * x = [6, 9, 8]
const A = new Matrix3(2, 0, 0, 0, 3, 0, 0, 0, 4);
const x = Matrix3.solveLinearSystem(A, [6, 9, 8]); // → [3, 3, 2]
```

#### See

- [solveLinearSystemSafe](#solvelinearsystemsafe) - Returns [0, 0, 0] instead of throwing
- [solveLinearSystemUnchecked](#solvelinearsystemunchecked) - No validation, for hot paths

#### Since

0.8.0

---

### solveLinearSystemSafe()

> `static` **solveLinearSystemSafe**(`matrix`, `b`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2403](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2403)

Safe linear system solve. Returns [0, 0, 0] if matrix is singular

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Coefficient matrix A

##### b

readonly \[`number`, `number`, `number`\]

Right-hand side vector as [b0, b1, b2]

#### Returns

\[`number`, `number`, `number`\]

Solution tuple, or [0, 0, 0] if singular

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) to test the
determinant. Returns the zero tuple when |det| ≤ EPSILON.

#### See

- [solveLinearSystem](#solvelinearsystem) - Throws for singular matrices
- [solveLinearSystemUnchecked](#solvelinearsystemunchecked) - No validation, for hot paths

#### Since

0.8.0

---

### solveLinearSystemUnchecked()

> `static` **solveLinearSystemUnchecked**(`matrix`, `b`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2448](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2448)

Unchecked linear system solve for hot paths

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Coefficient matrix A (must be non-singular)

##### b

readonly \[`number`, `number`, `number`\]

Right-hand side vector as [b0, b1, b2]

#### Returns

\[`number`, `number`, `number`\]

Solution tuple [x0, x1, x2]

#### Remarks

**Precondition:** Matrix must be non-singular (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### See

- [solveLinearSystem](#solvelinearsystem) - Throws on singular matrices
- [solveLinearSystemSafe](#solvelinearsystemsafe) - Returns fallback on singular matrices

#### Since

0.8.0

---

### transformPoints()

> `static` **transformPoints**(`matrix`, `points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:2578](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2578)

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

Defined in: [src/core/matrix3.ts:2603](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2603)

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

Defined in: [src/core/matrix3.ts:1867](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1867)

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

Defined in: [src/core/matrix3.ts:2999](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2999)

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

Defined in: [src/core/matrix3.ts:3049](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3049)

Resets to identity matrix.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `this`

Defined in: [src/core/matrix3.ts:2967](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2967)

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

Defined in: [src/core/matrix3.ts:3022](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3022)

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

### setTranslation()

> **setTranslation**(`translation`): `this`

Defined in: [src/core/matrix3.ts:3084](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3084)

Sets the translation components of this matrix.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector

#### Returns

`this`

This for chaining

#### Remarks

Only modifies m20 and m21 (the translation column), leaving all other
elements unchanged.

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
m.setTranslation({ x: 100, y: 50 });
```

#### Since

0.9.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix3.ts:3061](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L3061)

Sets all elements to zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix3.ts:2805](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2805)

Element at row 0, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m00`](../../types/interfaces/Matrix3Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix3.ts:2807](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2807)

Element at row 1, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m01`](../../types/interfaces/Matrix3Like.md#m01)

---

### m02

> **m02**: `number`

Defined in: [src/core/matrix3.ts:2809](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2809)

Element at row 2, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m02`](../../types/interfaces/Matrix3Like.md#m02)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix3.ts:2811](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2811)

Element at row 0, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m10`](../../types/interfaces/Matrix3Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix3.ts:2813](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2813)

Element at row 1, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m11`](../../types/interfaces/Matrix3Like.md#m11)

---

### m12

> **m12**: `number`

Defined in: [src/core/matrix3.ts:2815](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2815)

Element at row 2, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m12`](../../types/interfaces/Matrix3Like.md#m12)

---

### m20

> **m20**: `number`

Defined in: [src/core/matrix3.ts:2817](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2817)

Element at row 0, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m20`](../../types/interfaces/Matrix3Like.md#m20)

---

### m21

> **m21**: `number`

Defined in: [src/core/matrix3.ts:2819](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2819)

Element at row 1, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m21`](../../types/interfaces/Matrix3Like.md#m21)

---

### m22

> **m22**: `number`

Defined in: [src/core/matrix3.ts:2821](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2821)

Element at row 2, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m22`](../../types/interfaces/Matrix3Like.md#m22)

## Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix3.ts:4147](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4147)

Takes the absolute value of all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix3.ts:4084](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4084)

Ceils all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### clamp()

> **clamp**(`minMatrix`, `maxMatrix`): `this`

Defined in: [src/core/matrix3.ts:4191](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4191)

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

Defined in: [src/core/matrix3.ts:4214](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4214)

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

Defined in: [src/core/matrix3.ts:4063](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4063)

Floors all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix3.ts:4258](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4258)

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

Defined in: [src/core/matrix3.ts:4236](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4236)

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

Defined in: [src/core/matrix3.ts:4454](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4454)

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

Defined in: [src/core/matrix3.ts:4480](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4480)

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

Defined in: [src/core/matrix3.ts:4105](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4105)

Rounds all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### scaleBy()

> **scaleBy**(`scaleValue`): `this`

Defined in: [src/core/matrix3.ts:4506](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4506)

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

Defined in: [src/core/matrix3.ts:4168](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4168)

Takes the sign of all elements in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:4541](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4541)

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

Defined in: [src/core/matrix3.ts:4558](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4558)

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

Defined in: [src/core/matrix3.ts:4436](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4436)

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

Defined in: [src/core/matrix3.ts:4126](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L4126)

Applies Math.trunc to all elements in place (rounds towards zero).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1273](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1273)

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

Defined in: [src/core/matrix3.ts:1201](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1201)

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

Defined in: [src/core/matrix3.ts:1373](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1373)

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

Defined in: [src/core/matrix3.ts:1404](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1404)

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

Defined in: [src/core/matrix3.ts:1177](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1177)

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

Defined in: [src/core/matrix3.ts:1347](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1347)

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

Defined in: [src/core/matrix3.ts:1322](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1322)

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

Defined in: [src/core/matrix3.ts:2695](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2695)

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
const m = Matrix3.fromTranslation({ x: 100, y: 50 });
const rotated = Matrix3.rotate(m, Math.PI / 4);
```

#### Since

0.7.0

---

### rotateCS()

> `static` **rotateCS**(`matrix`, `cos`, `sin`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2726](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2726)

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
const m1 = Matrix3.fromTranslation({ x: 100, y: 50 });
const m2 = Matrix3.fromTranslation({ x: 200, y: 100 });
// Apply same rotation to both matrices efficiently
const r1 = Matrix3.rotateCS(m1, rotation.cos, rotation.sin);
const r2 = Matrix3.rotateCS(m2, rotation.cos, rotation.sin);
```

#### Since

0.7.0

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1225](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1225)

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

Defined in: [src/core/matrix3.ts:2773](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2773)

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
const m = Matrix3.fromTranslation({ x: 100, y: 50 });
const scaled = Matrix3.scaleBy(m, { x: 2, y: 0.5 });
```

#### Since

0.7.0

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1297](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1297)

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

Defined in: [src/core/matrix3.ts:2484](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2484)

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

Defined in: [src/core/matrix3.ts:2517](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2517)

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

Defined in: [src/core/matrix3.ts:2653](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L2653)

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

Defined in: [src/core/matrix3.ts:1249](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix3.ts#L1249)

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
