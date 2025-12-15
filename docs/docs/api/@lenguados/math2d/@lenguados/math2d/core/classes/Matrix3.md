# Class: Matrix3

Defined in: [src/core/matrix3.ts:119](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L119)

Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.

## Remarks

**API Design**
- Instance methods mutate `this` for fluent chaining
- Static helpers are pure and provide optional `out` parameters for allocation control
- Trigonometric operations use [DeterministicMath](../../deterministic/classes/DeterministicMath.md) for cross-platform reproducibility

## Example

```typescript
// Compose transformations
const transform = Matrix3.fromTranslation({ x: 100, y: 50 })
  .rotate(Math.PI / 4)
  .scaleBy(2);

// Apply to point
const worldPoint = transform.transformPoint({ x: 0, y: 0 });
```

## Since

0.1.0

## Implements

- [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

## Constructors

### Constructor

> **new Matrix3**(): `Matrix3`

Defined in: [src/core/matrix3.ts:1788](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1788)

Creates identity matrix.

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `Matrix3`

Defined in: [src/core/matrix3.ts:1790](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1790)

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

Defined in: [src/core/matrix3.ts:1802](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1802)

Creates from 9-element array.

#### Parameters

##### array

readonly \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`object`): `Matrix3`

Defined in: [src/core/matrix3.ts:1806](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1806)

Creates from plain object.

#### Parameters

##### object

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

#### Returns

`Matrix3`

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix3.ts:2317](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2317)

Adds another matrix to this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2396](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2396)

Adds a scalar to all elements.

#### Parameters

##### scalar

`number`

Value to add.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2464](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2464)

Divides all elements by a scalar.

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining.

#### Throws

Error if scalar is near zero.

#### Since

0.9.0

***

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2481](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2481)

Divides all elements by a scalar (safe version).

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining (returns zero matrix if scalar is near zero).

#### Since

0.9.0

***

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix3.ts:2441](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2441)

Fused multiply-add: `this = this * scale + m`.

#### Parameters

##### scale

`number`

Scale factor.

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:2284](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2284)

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2383](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2383)

Alias for scale.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2361](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2361)

Scales all elements by a scalar.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix3.ts:2339](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2339)

Subtracts another matrix from this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2418](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2418)

Subtracts a scalar from all elements.

#### Parameters

##### scalar

`number`

Value to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:559](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L559)

Component-wise addition `a + b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First addend.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second addend.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with component-wise sums.

#### Since

0.1.0

***

### addScalar()

> `static` **addScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:584](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L584)

Adds a scalar to all elements.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### s

`number`

Scalar to add.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with scalar added to each element.

#### Since

0.9.0

***

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:760](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L760)

Divides all elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### scalar

`number`

Divisor.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with each element divided by scalar.

#### Since

0.9.0

***

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:663](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L663)

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to scale.

##### scale

`number`

Scale factor.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix equal to `a * scale + b`.

#### Remarks

More efficient than separate scale and add operations.

#### Since

0.9.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:693](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L693)

Matrix multiplication `a × b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Left operand.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Right operand.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix product.

#### Since

0.1.0

***

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:745](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L745)

Alias for scale - multiplies all elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### scalar

`number`

Scale factor.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Scaled matrix.

#### Since

0.9.0

***

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:778](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L778)

Negates all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Negated matrix.

#### Since

0.1.0

***

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:720](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L720)

Scales all elements by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### scalar

`number`

Scale factor.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Scaled matrix.

#### Since

0.1.0

***

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:609](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L609)

Component-wise subtraction `a - b`.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Minuend.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Subtrahend.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with component-wise differences.

#### Since

0.1.0

***

### subtractScalar()

> `static` **subtractScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:634](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L634)

Subtracts a scalar from all elements.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### s

`number`

Scalar to subtract.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with scalar subtracted from each element.

#### Since

0.9.0

## Batch Operations

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:3185](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3185)

Transforms multiple points efficiently (batch operation).

#### Parameters

##### points

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of points to transform.

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed).

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed points.

#### Remarks

More efficient than calling transformPoint multiple times for large arrays
because it avoids repeated function call overhead.

#### Example

```typescript
const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
const worldVertices = matrix.transformPoints(vertices);
```

#### Since

0.9.0

***

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:3205](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3205)

Transforms multiple vectors efficiently (batch operation).

#### Parameters

##### vectors

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of vectors to transform.

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed).

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed vectors.

#### Remarks

Unlike points, vectors are not affected by translation.

#### Since

0.9.0

## Column/Row

### getColumn()

> **getColumn**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2957](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2957)

Gets a column of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Column index (0, 1, or 2).

#### Returns

\[`number`, `number`, `number`\]

Column as [row0, row1, row2].

#### Throws

RangeError if index is out of bounds.

#### Since

0.1.0

***

### getRow()

> **getRow**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3009](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3009)

Gets a row of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Row index (0, 1, or 2).

#### Returns

\[`number`, `number`, `number`\]

Row as [col0, col1, col2].

#### Throws

RangeError if index is out of bounds.

#### Since

0.1.0

***

### setColumn()

> **setColumn**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:2976](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2976)

Sets a column of the matrix.

#### Parameters

##### index

`number`

Column index (0, 1, or 2).

##### values

\[`number`, `number`, `number`\]

Column values [row0, row1, row2].

#### Returns

`this`

This for chaining.

#### Throws

RangeError if index is out of bounds.

#### Since

0.1.0

***

### setRow()

> **setRow**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:3028](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3028)

Sets a row of the matrix.

#### Parameters

##### index

`number`

Row index (0, 1, or 2).

##### values

\[`number`, `number`, `number`\]

Row values [col0, col1, col2].

#### Returns

`this`

This for chaining.

#### Throws

RangeError if index is out of bounds.

#### Since

0.1.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix3.ts:3237](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3237)

Exact equality with other matrix (bit-identical).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

#### Returns

`boolean`

True if all components are exactly identical.

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix3.ts:3356](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3356)

Tests if any element is NaN.

#### Returns

`boolean`

True if any element is NaN.

#### Since

0.9.0

***

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3422](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3422)

Tests if this matrix is diagonal (off-diagonal elements ≈ 0).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is diagonal.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix3.ts:3334](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3334)

Tests if all elements are finite.

#### Returns

`boolean`

True if all elements are finite.

#### Since

0.9.0

***

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3267](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3267)

Tests if this matrix is an identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if this is an identity matrix.

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3455](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3455)

Tests if this matrix is orthogonal (M * M^T = I).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isSingular()

> **isSingular**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3442](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3442)

Tests if this matrix is singular (determinant ≈ 0).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is singular (non-invertible).

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3402](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3402)

Tests if this matrix is skew-symmetric (M = -M^T).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is skew-symmetric.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.9.0

***

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3382](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3382)

Tests if this matrix is symmetric (M = M^T).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if matrix is symmetric.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.9.0

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix3.ts:3289](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3289)

Tests if all elements are exactly zero.

#### Returns

`boolean`

True if all elements are zero.

#### Since

0.9.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3254](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3254)

Approximate equality with other matrix using relative tolerance.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Since

0.9.0

***

### nearZero()

> **nearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3312](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3312)

Tests if all elements are near zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all elements are within epsilon of zero.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix3.ts:1228](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1228)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix.

#### Returns

`boolean`

True if all components are exactly identical.

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1307](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1307)

Tests if any element is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if any element is NaN.

#### Since

0.9.0

***

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1414](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1414)

Tests if matrix is diagonal.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if off-diagonal elements are near zero.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1284](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1284)

Tests if all elements are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if all elements are finite.

#### Since

0.9.0

***

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1331](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1331)

Tests if matrix is identity.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is identity.

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### isOrthogonal()

> `static` **isOrthogonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1435](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1435)

Tests if a matrix is orthogonal (M * M^T = I).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isSingular()

> `static` **isSingular**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1355](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1355)

Tests if matrix is singular (non-invertible).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if determinant is near zero.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1393](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1393)

Tests if matrix is skew-symmetric (M = -M^T).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is skew-symmetric.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.9.0

***

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1372](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1372)

Tests if matrix is symmetric (M = M^T).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if matrix is symmetric.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.9.0

***

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1166)

Tests for exact equality with the zero matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if all elements are exactly zero.

#### Since

0.9.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1257](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1257)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix.

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
This scales with value magnitude, making it robust for both small and large values.

#### Since

0.9.0

***

### nearZero()

> `static` **nearZero**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1190](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1190)

Tests if all elements are near zero.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all elements are within epsilon of zero.

#### Default Value

`EPSILON`

#### Since

0.9.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix3.ts:2052](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2052)

Calculates the determinant.

#### Returns

`number`

Determinant value.

#### Since

0.1.0

***

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix3.ts:2080](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2080)

Calculates the Frobenius norm.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²).

#### Since

0.9.0

***

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix3.ts:2036](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2036)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians.

#### Since

0.1.0

***

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2022](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2022)

Extracts scale factors from the matrix.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis.

#### Remarks

Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.1.0

***

### getTranslation()

> **getTranslation**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2007](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2007)

Extracts translation vector from the matrix.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Translation as Vector2.

#### Since

0.1.0

***

### isAffine()

> **isAffine**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2116](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2116)

Tests if matrix is affine (bottom row is [0, 0, 1]).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is affine.

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2103](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2103)

Tests if matrix is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if determinant is not near zero.

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix3.ts:2068](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2068)

Calculates the trace (sum of diagonal).

#### Returns

`number`

Trace value.

#### Since

0.9.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix3.ts:3736](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3736)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding all 9 elements.

#### Example

```typescript
const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = matrix;
```

#### Since

0.9.0

***

### clone()

> **clone**(): `Matrix3`

Defined in: [src/core/matrix3.ts:3720](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3720)

Creates a deep copy of this matrix.

#### Returns

`Matrix3`

New Matrix3 with identical values.

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 4);
const copy = m.clone();
copy.identity(); // Original unchanged
```

#### Since

0.1.0

***

### toArray()

> **toArray**(`out?`, `offset?`, `columnMajor?`): `number`[]

Defined in: [src/core/matrix3.ts:3583](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3583)

Converts the matrix to an array.

#### Parameters

##### out?

`number`[]

Optional output array.

##### offset?

`number` = `0`

Array offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

`number`[]

Array with matrix elements.

#### Default Value

`0`

#### Default Value

`true`

#### Since

0.1.0

***

### toFloat32Array()

> **toFloat32Array**(`out?`, `offset?`, `columnMajor?`): `Float32Array`

Defined in: [src/core/matrix3.ts:3620](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3620)

Converts the matrix to a Float32Array.

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional output array.

##### offset?

`number` = `0`

Array offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

`Float32Array`

Float32Array with matrix elements.

#### Default Value

`0`

#### Default Value

`true`

#### Since

0.1.0

***

### toJSON()

> **toJSON**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:3676](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3676)

Converts the matrix to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Object suitable for JSON serialization.

#### Since

0.1.0

***

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:3635](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3635)

Extracts the upper-left 2×2 portion as a Matrix2.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix.

#### Returns

[`Matrix2`](Matrix2.md)

Matrix2 containing upper-left 2×2 portion.

#### Since

0.1.0

***

### toObject()

> **toObject**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:3653](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3653)

Converts the matrix to a plain object.

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Object with m00-m22 properties.

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 2);
const obj = m.toObject();
```

#### Since

0.1.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix3.ts:3700](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3700)

Creates a human-readable string representation.

#### Parameters

##### precision

`number` = `4`

Decimal places.

#### Returns

`string`

Formatted string.

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

0.1.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:222](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L222)

Creates a deep copy of a matrix.

#### Parameters

##### source

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clone.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with identical components.

#### Since

0.1.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Matrix3`

Defined in: [src/core/matrix3.ts:246](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L246)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### destination

`Matrix3`

Target matrix to receive the copy.

#### Returns

`Matrix3`

The destination matrix.

#### Since

0.9.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:496](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L496)

Creates a matrix from a flat numeric array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Numeric array with at least 9 elements.

##### offset

`number` = `0`

Index of the first element.

##### columnMajor

`boolean` = `true`

If true, reads column-major; if false, row-major.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 initialized from the array.

#### Default Value

`0`

#### Default Value

`true`

#### Throws

If offset is out of bounds.

#### Since

0.1.0

***

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `col2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:406](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L406)

Creates a matrix from column vectors.

#### Parameters

##### col0

readonly \[`number`, `number`, `number`\]

First column [m00, m01, m02].

##### col1

readonly \[`number`, `number`, `number`\]

Second column [m10, m11, m12].

##### col2

readonly \[`number`, `number`, `number`\]

Third column [m20, m21, m22].

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with the specified columns.

#### Since

0.9.0

***

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:350](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L350)

Creates a Matrix3 from a Matrix2 (embeds 2×2 in homogeneous coordinates).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source 2×2 matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with the 2×2 matrix in the upper-left.

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:271](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L271)

Creates a matrix from a plain object.

#### Parameters

##### object

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Plain object with m00-m22 properties.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with the object's components.

#### Throws

If any component is not finite.

#### Since

0.9.0

***

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:308](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L308)

Creates a rotation matrix from an angle or Rotation2.

#### Parameters

##### rotation

Angle in radians or a Rotation2Like object.

`number` | [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 representing the rotation.

#### Since

0.1.0

***

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `row2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:437](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L437)

Creates a matrix from row vectors.

#### Parameters

##### row0

readonly \[`number`, `number`, `number`\]

First row [m00, m10, m20].

##### row1

readonly \[`number`, `number`, `number`\]

Second row [m01, m11, m21].

##### row2

readonly \[`number`, `number`, `number`\]

Third row [m02, m12, m22].

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with the specified rows.

#### Since

0.9.0

***

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:332](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L332)

Creates a scale matrix.

#### Parameters

##### scale

Scale factor (uniform) or Vector2 (non-uniform).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 representing the scale.

#### Since

0.1.0

***

### fromTransform()

> `static` **fromTransform**(`translation`, `rotation`, `scale`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:366](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L366)

Creates a transform matrix from translation, rotation, and scale.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector.

##### rotation

`number`

Rotation angle in radians.

##### scale

Scale factor (uniform) or Vector2 (non-uniform).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 representing the combined transform (T × R × S).

#### Since

0.1.0

***

### fromTranslation()

> `static` **fromTranslation**(`translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:294](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L294)

Creates a translation matrix.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 representing the translation.

#### Since

0.1.0

***

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:197](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L197)

Creates a matrix from explicit components.

#### Parameters

##### m00

`number`

Element at row 0, column 0.

##### m01

`number`

Element at row 1, column 0.

##### m02

`number`

Element at row 2, column 0.

##### m10

`number`

Element at row 0, column 1.

##### m11

`number`

Element at row 1, column 1.

##### m12

`number`

Element at row 2, column 1.

##### m20

`number`

Element at row 0, column 2.

##### m21

`number`

Element at row 1, column 2.

##### m22

`number`

Element at row 2, column 2.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 with the specified components.

#### Since

0.1.0

***

### ortho()

> `static` **ortho**(`left`, `right`, `bottom`, `top`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:469](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L469)

Creates an orthographic projection matrix for 2D.

#### Parameters

##### left

`number`

Left boundary.

##### right

`number`

Right boundary.

##### bottom

`number`

Bottom boundary.

##### top

`number`

Top boundary.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

A Matrix3 representing the orthographic projection.

#### Since

0.1.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3489](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3489)

Linear interpolation with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix.

##### t

`number`

Interpolation factor [0, 1], clamped.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3538](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3538)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### lerpUnclamped()

> **lerpUnclamped**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3514](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3514)

Linear interpolation without clamping t.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix.

##### t

`number`

Interpolation factor (not clamped).

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3552](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3552)

Smooth step interpolation in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Target matrix.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1044](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1044)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix.

##### t

`number`

Interpolation factor (clamped).

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Interpolated matrix.

#### Since

0.1.0

***

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1111](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1111)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Interpolated matrix.

#### Remarks

This is an alias for `lerp` which already clamps t.
Provided for API symmetry with Vector2.

#### Since

0.9.0

***

### lerpUnclamped()

> `static` **lerpUnclamped**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1076](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1076)

Linear interpolation without clamping t.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix.

##### t

`number`

Interpolation factor (not clamped).

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Interpolated matrix.

#### Since

0.9.0

***

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1132](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1132)

Smooth step interpolation between matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Start matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

End matrix.

##### t

`number`

Interpolation factor.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Smoothly interpolated matrix.

#### Since

0.9.0

## Matrix Operations

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix3.ts:2642](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2642)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This for chaining.

#### Remarks

The adjugate is the transpose of the cofactor matrix.
For a 3×3 matrix, each element is the determinant of the 2×2
minor matrix, with alternating signs.

#### Since

0.9.0

***

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix3.ts:2524](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2524)

Inverts this matrix in place.

#### Returns

`this`

This for chaining.

#### Throws

Error if singular.

#### Since

0.1.0

***

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix3.ts:2562](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2562)

Inverts this matrix in place (safe version).

#### Returns

`this`

This for chaining (returns identity if singular).

#### Since

0.9.0

***

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix3.ts:2581](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2581)

Inverts this matrix in place (unchecked version).

#### Returns

`this`

This for chaining.

#### Remarks

Assumes matrix is invertible. Use for hot paths when you've already validated.

#### Since

0.9.0

***

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix3.ts:2616](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2616)

Negates all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:2676](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2676)

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix3.ts:2501](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2501)

Transposes this matrix in place.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1546](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1546)

Calculates the adjugate (adjoint) matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Adjugate matrix (transpose of cofactor matrix).

#### Since

0.9.0

***

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix3.ts:1738](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1738)

Decomposes an affine matrix into translation, rotation, and scale.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to decompose.

#### Returns

`object`

Object with translation, rotation (radians), and scale.

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

0.1.0

***

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1492](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1492)

Calculates the determinant.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate determinant of.

#### Returns

`number`

Determinant value.

#### Since

0.1.0

***

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1522](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1522)

Calculates the Frobenius norm.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate norm of.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²).

#### Since

0.9.0

***

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1573](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1573)

Inverts a matrix. Throws if singular.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Inverted matrix.

#### Throws

If matrix is singular.

#### Since

0.1.0

***

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1615](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1615)

Safe inverse. Returns identity if singular.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Inverted matrix or identity if singular.

#### Since

0.9.0

***

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1637](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1637)

Unchecked inverse for hot paths. Assumes matrix is invertible.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to invert.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Inverted matrix.

#### Remarks

⚠️ **Precondition:** Matrix must be invertible (non-singular).
Calling with singular matrix produces Infinity/NaN elements.

#### Since

0.9.0

***

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1509](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1509)

Calculates the trace (sum of diagonal).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate trace of.

#### Returns

`number`

Trace value.

#### Since

0.9.0

***

### transformPoint()

> `static` **transformPoint**(`matrix`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1677](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1677)

Transforms a point by the matrix (applies translation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transform matrix.

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform.

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Transformed point.

#### Since

0.1.0

***

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1710](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1710)

Transforms a vector by the matrix (ignores translation).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Transform matrix.

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Transformed vector.

#### Since

0.1.0

***

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1469](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1469)

Transposes a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Transposed matrix.

#### Since

0.1.0

## Mutator

### copy()

> **copy**(`matrix`): `this`

Defined in: [src/core/matrix3.ts:1956](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1956)

Copies from another matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix3.ts:1978](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1978)

Resets to identity matrix.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### set()

> **set**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `this`

Defined in: [src/core/matrix3.ts:1924](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1924)

Sets all matrix elements.

#### Parameters

##### m00

`number`

Element at row 0, column 0.

##### m01

`number`

Element at row 1, column 0.

##### m02

`number`

Element at row 2, column 0.

##### m10

`number`

Element at row 0, column 1.

##### m11

`number`

Element at row 1, column 1.

##### m12

`number`

Element at row 2, column 1.

##### m20

`number`

Element at row 0, column 2.

##### m21

`number`

Element at row 1, column 2.

##### m22

`number`

Element at row 2, column 2.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix3.ts:1990](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1990)

Sets all elements to zero.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

## Numeric Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix3.ts:2775](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2775)

Takes the absolute value of all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix3.ts:2733](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2733)

Ceils all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### clamp()

> **clamp**(`minMatrix`, `maxMatrix`): `this`

Defined in: [src/core/matrix3.ts:2819](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2819)

Clamps all elements to a range in place.

#### Parameters

##### minMatrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Minimum values per element.

##### maxMatrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Maximum values per element.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### clampScalar()

> **clampScalar**(`minValue`, `maxValue`): `this`

Defined in: [src/core/matrix3.ts:2842](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2842)

Clamps all elements to a scalar range in place.

#### Parameters

##### minValue

`number`

Minimum value.

##### maxValue

`number`

Maximum value.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix3.ts:2712](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2712)

Floors all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix3.ts:2886](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2886)

Takes element-wise maximum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix3.ts:2864](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2864)

Takes element-wise minimum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix3.ts:2908](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2908)

Computes element-wise modulo in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Divisor matrix.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2930](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2930)

Computes scalar modulo in place.

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### round()

> **round**(): `this`

Defined in: [src/core/matrix3.ts:2754](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2754)

Rounds all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix3.ts:2796](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2796)

Takes the sign of all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix3.ts:1765](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1765)

Element at row 0, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m00`](../../types/interfaces/Matrix3Like.md#m00)

***

### m01

> **m01**: `number`

Defined in: [src/core/matrix3.ts:1767](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1767)

Element at row 1, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m01`](../../types/interfaces/Matrix3Like.md#m01)

***

### m02

> **m02**: `number`

Defined in: [src/core/matrix3.ts:1769](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1769)

Element at row 2, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m02`](../../types/interfaces/Matrix3Like.md#m02)

***

### m10

> **m10**: `number`

Defined in: [src/core/matrix3.ts:1771](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1771)

Element at row 0, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m10`](../../types/interfaces/Matrix3Like.md#m10)

***

### m11

> **m11**: `number`

Defined in: [src/core/matrix3.ts:1773](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1773)

Element at row 1, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m11`](../../types/interfaces/Matrix3Like.md#m11)

***

### m12

> **m12**: `number`

Defined in: [src/core/matrix3.ts:1775](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1775)

Element at row 2, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m12`](../../types/interfaces/Matrix3Like.md#m12)

***

### m20

> **m20**: `number`

Defined in: [src/core/matrix3.ts:1777](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1777)

Element at row 0, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m20`](../../types/interfaces/Matrix3Like.md#m20)

***

### m21

> **m21**: `number`

Defined in: [src/core/matrix3.ts:1779](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1779)

Element at row 1, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m21`](../../types/interfaces/Matrix3Like.md#m21)

***

### m22

> **m22**: `number`

Defined in: [src/core/matrix3.ts:1781](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1781)

Element at row 2, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m22`](../../types/interfaces/Matrix3Like.md#m22)

***

### EPSILON\_MATRIX

> `readonly` `static` **EPSILON\_MATRIX**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:147](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L147)

Epsilon matrix (EPSILON in all elements).

***

### FLIP\_X

> `readonly` `static` **FLIP\_X**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:152](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L152)

Flip horizontally (mirror across Y axis).

***

### FLIP\_XY

> `readonly` `static` **FLIP\_XY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:158](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L158)

Flip both axes (equivalent to ROTATE_180).

***

### FLIP\_Y

> `readonly` `static` **FLIP\_Y**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:155](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L155)

Flip vertically (mirror across X axis).

***

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:138](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L138)

Identity matrix (no transformation).

***

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:144](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L144)

All-ones matrix.

***

### ROTATE\_180

> `readonly` `static` **ROTATE\_180**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:164](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L164)

180° rotation.

***

### ROTATE\_270

> `readonly` `static` **ROTATE\_270**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:167](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L167)

270° counter-clockwise rotation (90° clockwise).

***

### ROTATE\_90

> `readonly` `static` **ROTATE\_90**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:161](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L161)

90° counter-clockwise rotation.

***

### SCALE\_2

> `readonly` `static` **SCALE\_2**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:170](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L170)

Uniform scale by 2.

***

### SCALE\_HALF

> `readonly` `static` **SCALE\_HALF**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:173](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L173)

Uniform scale by 0.5.

***

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:141](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L141)

Zero matrix.

***

### column0

#### Get Signature

> **get** **column0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2227](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2227)

Returns the first column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 0 as [m00, m01, m02].

***

### column1

#### Get Signature

> **get** **column1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2235](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2235)

Returns the second column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 1 as [m10, m11, m12].

***

### column2

#### Get Signature

> **get** **column2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2243](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2243)

Returns the third column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 2 as [m20, m21, m22].

***

### diagonal

#### Get Signature

> **get** **diagonal**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2219](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2219)

Returns the diagonal elements as a 3-element array.

##### Returns

\[`number`, `number`, `number`\]

Diagonal array [m00, m11, m22].

***

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2151](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2151)

Returns a new inverted matrix without modifying this one.
Returns identity if singular.

##### Returns

`Matrix3`

Inverted matrix.

***

### negated

#### Get Signature

> **get** **negated**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2185](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2185)

Returns a new negated matrix without modifying this one.

##### Returns

`Matrix3`

Negated matrix.

***

### row0

#### Get Signature

> **get** **row0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2251](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2251)

Returns the first row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 0 as [m00, m10, m20].

***

### row1

#### Get Signature

> **get** **row1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2259](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2259)

Returns the second row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 1 as [m01, m11, m21].

***

### row2

#### Get Signature

> **get** **row2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2267](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2267)

Returns the third row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 2 as [m02, m12, m22].

***

### translation

#### Get Signature

> **get** **translation**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2211](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2211)

Returns the translation component as a Vector2.

##### Returns

[`Vector2`](Vector2.md)

Translation vector.

***

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2132](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2132)

Returns a new transposed matrix without modifying this one.

##### Returns

`Matrix3`

Transposed matrix.

***

### upperLeft2x2

#### Get Signature

> **get** **upperLeft2x2**(): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:2203](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L2203)

Returns the upper-left 2×2 portion as a Matrix2.

##### Returns

[`Matrix2`](Matrix2.md)

Upper-left 2x2 matrix.

## Transform

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix3.ts:3082](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3082)

Applies a rotation to this matrix in place.

#### Parameters

##### angle

`number`

Rotation angle in radians.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### scaleBy()

> **scaleBy**(`scaleValue`): `this`

Defined in: [src/core/matrix3.ts:3109](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3109)

Applies a scale transformation to this matrix in place.

#### Parameters

##### scaleValue

Scale factor (scalar or per-axis vector).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:3144](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3144)

Transforms a point by this matrix.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform.

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Transformed point.

#### Remarks

Points are affected by translation (uses homogeneous coordinate w=1).

#### Since

0.1.0

***

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:3161](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3161)

Transforms a vector by this matrix.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Transformed vector.

#### Remarks

Vectors are NOT affected by translation (uses homogeneous coordinate w=0).

#### Since

0.1.0

***

### translate()

> **translate**(`translation`): `this`

Defined in: [src/core/matrix3.ts:3064](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L3064)

Applies a translation to this matrix in place.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:878](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L878)

Applies absolute value to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Absolute-valued matrix.

#### Since

0.9.0

***

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:830](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L830)

Applies Math.ceil to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Ceiled matrix.

#### Since

0.9.0

***

### clamp()

> `static` **clamp**(`m`, `minM`, `maxM`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:978](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L978)

Component-wise clamp between two matrices.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clamp.

##### minM

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Per-component minima.

##### maxM

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Per-component maxima.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Clamped matrix.

#### Since

0.9.0

***

### clampScalar()

> `static` **clampScalar**(`m`, `min`, `max`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1009](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L1009)

Clamps all elements between scalar bounds.

#### Parameters

##### m

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to clamp.

##### min

`number`

Minimum scalar.

##### max

`number`

Maximum scalar.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Clamped matrix.

#### Since

0.9.0

***

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:806](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L806)

Applies Math.floor to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Floored matrix.

#### Since

0.9.0

***

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:952](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L952)

Component-wise maximum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with component-wise maxima.

#### Since

0.9.0

***

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:927](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L927)

Component-wise minimum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

First matrix.

##### b

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Second matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with component-wise minima.

#### Since

0.9.0

***

### round()

> `static` **round**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:854](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L854)

Applies Math.round to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Rounded matrix.

#### Since

0.9.0

***

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:902](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L902)

Applies sign function to all elements.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with signs (-1, 0, or 1).

#### Since

0.9.0
