# Class: Matrix2

Defined in: [src/core/matrix2.ts:88](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L88)

Column-major 2×2 matrix suitable for WebGL and physics calculations.

## Remarks

- Instance methods mutate `this` for fluent chaining.
- Static helpers are pure and provide optional `out` parameters to eliminate allocations.
- Trigonometric operations rely on [DeterministicMath](../../deterministic/classes/DeterministicMath.md).

## Implements

- [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

## Constructors

### Constructor

> **new Matrix2**(`m00OrSource?`, `m01?`, `m10?`, `m11?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1389](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1389)

Creates a new 2x2 matrix.

#### Parameters

##### m00OrSource?

First component, array, or object source

`number` | [`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md) | \[`number`, `number`, `number`, `number`\]

##### m01?

`number`

Column 0, Row 1 (when first arg is a number)

##### m10?

`number`

Column 1, Row 0 (when first arg is a number)

##### m11?

`number`

Column 1, Row 1 (when first arg is a number)

#### Returns

`Matrix2`

#### Remarks

Supports multiple construction forms:
- No arguments: creates identity matrix
- Four numbers: explicit components (m00, m01, m10, m11)
- Array of 4 numbers: [m00, m01, m10, m11]
- Object with m00, m01, m10, m11 properties

#### Example

```typescript
new Matrix2();                    // Identity: [1,0,0,1]
new Matrix2(1, 2, 3, 4);          // Explicit: m00=1, m01=2, m10=3, m11=4
new Matrix2([1, 2, 3, 4]);        // From array
new Matrix2({ m00: 1, m01: 2, m10: 3, m11: 4 }); // From object
```

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix2.ts:1732](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1732)

Adds another matrix to this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1810](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1810)

Adds a scalar to all components.

#### Parameters

##### scalar

`number`

Scalar to add.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1865](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1865)

Divides all components by a scalar.

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Remarks

Uses safe division; if |scalar| ≤ EPSILON, components become 0.

#### Since

0.9.0

***

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1883](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1883)

Safe scalar division. If |scalar| ≤ EPSILON, sets all components to zero.

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix2.ts:1845](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1845)

Fused multiply-add: `this = this * scale + m`.

#### Parameters

##### scale

`number`

Scale factor.

##### m

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix2.ts:1907](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1907)

Component-wise modulo with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Divisor matrix.

#### Returns

`this`

This matrix for chaining.

#### Remarks

Uses the positive modulo operation (always returns positive results).

#### Since

0.9.0

***

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1924](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1924)

Scalar modulo on all components.

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:1773](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1773)

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to multiply by.

#### Returns

`this`

This matrix for chaining.

#### Example

```typescript
const rot = Matrix2.fromRotation(Math.PI / 4);
const scale = Matrix2.fromScale(2);
rot.multiply(scale); // rot is now rotated then scaled
```

#### Since

0.1.0

***

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1793](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1793)

Scales all matrix components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix2.ts:1749](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1749)

Subtracts another matrix from this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to subtract.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1827](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1827)

Subtracts a scalar from all components.

#### Parameters

##### scalar

`number`

Scalar to subtract.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:389](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L389)

Component-wise addition of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First addend.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second addend.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with components `(a.mXX + b.mXX)`.

#### Since

0.1.0

***

### addScalar()

> `static` **addScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:474](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L474)

Adds a scalar to all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### scalar

`number`

Scalar to add.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with scalar added to all components.

#### Since

0.9.0

***

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:546](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L546)

Divides all matrix components by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### scalar

`number`

Scalar divisor.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with all components divided by scalar.

#### Remarks

Uses safe division; if |scalar| ≤ EPSILON, components become 0.

#### Since

0.9.0

***

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:518](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L518)

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to scale.

##### scale

`number`

Scale factor.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix equal to `a * scale + b`.

#### Remarks

More efficient than separate scale and add operations.

#### Since

0.9.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:419](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L419)

Multiplies two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Product matrix a × b.

#### Since

0.1.0

***

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:459](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L459)

Alias for [scale](#scale-2). Multiplies all components by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to scale.

##### scalar

`number`

Scale factor.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Scaled matrix.

#### Since

0.1.0

***

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:439](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L439)

Scales a matrix by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to scale.

##### scalar

`number`

Scale factor.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Scaled matrix.

#### Since

0.1.0

***

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:404](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L404)

Component-wise subtraction of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Minuend.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Subtrahend.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with components `(a.mXX - b.mXX)`.

#### Since

0.1.0

***

### subtractScalar()

> `static` **subtractScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:494](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L494)

Subtracts a scalar from all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### scalar

`number`

Scalar to subtract.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with scalar subtracted from all components.

#### Since

0.9.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix2.ts:2378](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2378)

Exact equality with other matrix (bit-identical).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to compare.

#### Returns

`boolean`

True if all components are exactly identical.

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1564](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1564)

Tests if this matrix is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance for determinant.

#### Returns

`boolean`

True if determinant is non-zero.

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1577](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1577)

Tests if this matrix is orthogonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if M * M^T = I.

#### Default Value

`EPSILON`

#### Since

0.9.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2395](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2395)

Approximate equality with other matrix using relative tolerance.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix2.ts:1036](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1036)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

Defined in: [src/core/matrix2.ts:1146](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1146)

Tests if any component is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if any component is NaN.

#### Since

0.9.0

***

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1203](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1203)

Tests if a matrix is diagonal (off-diagonal elements ≈ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

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

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1128](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1128)

Tests if all components are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if all components are finite.

#### Since

0.9.0

***

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1078](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1078)

Tests if a matrix is the identity matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

### isSingular()

> `static` **isSingular**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1217](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1217)

Tests if a matrix is singular (determinant ≈ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

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

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1185](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1185)

Tests if a matrix is skew-symmetric (m00 ≈ 0, m11 ≈ 0, m01 ≈ -m10).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

Defined in: [src/core/matrix2.ts:1168](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1168)

Tests if a matrix is symmetric (m01 ≈ m10).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

Defined in: [src/core/matrix2.ts:1096](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1096)

Tests if a matrix is exactly zero.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if all components are zero.

#### Since

0.9.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1055](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1055)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

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

Defined in: [src/core/matrix2.ts:1110](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1110)

Tests if a matrix is approximately zero.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all components are within epsilon of zero.

#### Default Value

`EPSILON`

#### Since

0.9.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix2.ts:1522](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1522)

Calculates the determinant of the matrix.

#### Returns

`number`

Determinant value.

#### Remarks

A determinant of 0 indicates the matrix is singular (non-invertible).
The absolute value represents the area scaling factor.

#### Since

0.1.0

***

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix2.ts:1549](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1549)

Calculates the Frobenius norm.

#### Returns

`number`

Square root of sum of squared elements.

#### Remarks

Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.9.0

***

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix2.ts:1601](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1601)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians.

#### Remarks

Assumes the matrix represents a pure rotation or rotation with uniform scale.

#### Since

0.1.0

***

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1618](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1618)

Extracts scale factors from the matrix.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis.

#### Remarks

Returns the length of each column vector.
Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.1.0

***

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix2.ts:1534](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1534)

Calculates the trace of the matrix.

#### Returns

`number`

Sum of diagonal elements.

#### Since

0.9.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix2.ts:2676](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2676)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding m00, m01, m10, m11.

#### Example

```typescript
const [m00, m01, m10, m11] = Matrix2.IDENTITY;
```

#### Since

0.9.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:181](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L181)

Creates a deep copy of a matrix.

#### Parameters

##### source

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clone.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

A Matrix2 with identical components.

#### Since

0.1.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Matrix2`

Defined in: [src/core/matrix2.ts:195](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L195)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix.

##### destination

`Matrix2`

Target matrix to receive the copy.

#### Returns

`Matrix2`

The destination matrix.

#### Since

0.9.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:336](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L336)

Creates a matrix from an array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Array with matrix elements.

##### offset

`number` = `0`

Starting index.

##### columnMajor

`boolean` = `true`

If true, array is column-major.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with components from the array.

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

> `static` **fromColumns**(`col0`, `col1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:296](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L296)

Creates a matrix from column vectors.

#### Parameters

##### col0

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First column.

##### col1

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second column.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with specified columns.

#### Since

0.1.0

***

### fromMatrix()

> `static` **fromMatrix**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:370](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L370)

Creates a matrix from another matrix-like object.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with copied components.

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:210](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L210)

Creates a matrix from a plain object `{ m00, m01, m10, m11 }`.

#### Parameters

##### object

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Plain object with matrix components.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

A Matrix2 with the object's components.

#### Throws

If any component is not finite.

#### Since

0.9.0

***

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:233](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L233)

Creates a matrix from a rotation.

#### Parameters

##### rotation

Rotation object or angle in radians.

`number` | `Readonly`\<[`Rotation2`](Rotation2.md)\>

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Rotation matrix.

#### Example

```typescript
const mat = Matrix2.fromRotation(Math.PI / 3);
```

#### Since

0.1.0

***

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:315](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L315)

Creates a matrix from row vectors.

#### Parameters

##### row0

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First row.

##### row1

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second row.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with specified rows.

#### Since

0.1.0

***

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:258](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L258)

Creates a scaling matrix.

#### Parameters

##### scale

Scale factors as Vector2 or uniform scale.

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Scale matrix.

#### Example

```typescript
const mat1 = Matrix2.fromScale(new Vector2(2, 3));
const mat2 = Matrix2.fromScale(2); // Uniform scale
```

#### Since

0.1.0

***

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:281](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L281)

Creates a shearing matrix.

#### Parameters

##### shear

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Shear factors as Vector2 (x=horizontal, y=vertical).

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Shear matrix.

#### Example

```typescript
const mat = Matrix2.fromShear(new Vector2(0.5, 0));
```

#### Since

0.1.0

***

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:161](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L161)

Creates a matrix from explicit components.

#### Parameters

##### m00

`number`

Component at row 0, column 0.

##### m01

`number`

Component at row 1, column 0.

##### m10

`number`

Component at row 0, column 1.

##### m11

`number`

Component at row 1, column 1.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

A Matrix2 with the specified components.

#### Since

0.1.0

## Interpolation

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2555](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2555)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2569](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2569)

Smooth step interpolation with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix.

##### t

`number`

Interpolation factor [0, 1].

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:911](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L911)

Linear interpolation between two matrices with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix.

##### t

`number`

Interpolation factor [0, 1], clamped.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Interpolated matrix.

#### Example

```typescript
const a = Matrix2.IDENTITY;
const b = Matrix2.fromRotation(Math.PI / 2);
const mid = Matrix2.lerp(a, b, 0.5);
```

#### Since

0.1.0

***

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:968](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L968)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Interpolated matrix.

#### Remarks

This is an alias for `lerp` which already clamps t.
Provided for API symmetry with Vector2.

#### Since

0.9.0

***

### lerpUnclamped()

> `static` **lerpUnclamped**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:938](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L938)

Linear interpolation without clamping t.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix.

##### t

`number`

Interpolation factor (not clamped).

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Interpolated matrix.

#### Since

0.9.0

***

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:992](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L992)

Smooth step interpolation between two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix.

##### t

`number`

Interpolation factor [0, 1].

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Smoothly interpolated matrix.

#### Remarks

Uses the smoothstep formula: 3t² - 2t³

#### Since

0.9.0

## Matrix Operations

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:672](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L672)

Calculates the adjugate (adjoint) matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate adjugate of.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Adjugate matrix.

#### Remarks

The adjugate is the transpose of the cofactor matrix.
For a 2x2 matrix [a b; c d], the adjugate is [d -b; -c a].

#### Since

0.1.0

***

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1234](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1234)

Calculates the determinant of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate determinant of.

#### Returns

`number`

Determinant value.

#### Since

0.1.0

***

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1263](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1263)

Calculates the Frobenius norm of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate norm of.

#### Returns

`number`

Square root of sum of squared elements.

#### Remarks

Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.9.0

***

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:581](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L581)

Inverts a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Inverted matrix.

#### Throws

If matrix is singular (determinant ≈ 0).

#### Since

0.1.0

***

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:612](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L612)

Safe inversion. Returns identity if matrix is singular.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Inverted matrix, or identity if singular.

#### Example

```typescript
const singular = new Matrix2(1, 1, 1, 1); // det = 0
const inv = Matrix2.inverseSafe(singular); // Returns IDENTITY
```

#### Since

0.9.0

***

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:648](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L648)

Unchecked inversion for hot paths.

⚠️ **Precondition:** Matrix must be invertible (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert (must be non-singular).

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Inverted matrix.

#### Example

```typescript
// Only use when you're certain the matrix is invertible
if (matrix.isInvertible()) {
  const inv = Matrix2.inverseUnchecked(matrix);
}
```

#### Since

0.9.0

***

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:693](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L693)

Negates all elements of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to negate.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Negated matrix.

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const neg = Matrix2.negate(m);
// neg = Matrix2(-1, -2, -3, -4)
```

#### Since

0.1.0

***

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1247](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1247)

Calculates the trace (sum of diagonal elements) of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate trace of.

#### Returns

`number`

Sum of diagonal elements (m00 + m11).

#### Since

0.9.0

***

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:566](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L566)

Transposes a matrix (swaps rows and columns).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to transpose.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Transposed matrix.

#### Since

0.1.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/matrix2.ts:1466](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1466)

Copies components from another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2`](../type-aliases/ReadonlyMatrix2.md)

Matrix to copy from.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix2.ts:1482](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1482)

Sets this matrix to identity.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

Defined in: [src/core/matrix2.ts:1449](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1449)

Sets the matrix components.

#### Parameters

##### m00

`number`

Column 0, Row 0

##### m01

`number`

Column 0, Row 1

##### m10

`number`

Column 1, Row 0

##### m11

`number`

Column 1, Row 1

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

***

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix2.ts:1498](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1498)

Resets all components to zero.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

## Numeric Transform

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:768](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L768)

Applies absolute value to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with absolute values.

#### Since

0.9.0

***

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:730](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L730)

Applies Math.ceil to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with ceiled elements.

#### Since

0.9.0

***

### clamp()

> `static` **clamp**(`matrix`, `minM`, `maxM`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:848](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L848)

Clamps all matrix components between min and max matrices.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clamp.

##### minM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component minima.

##### maxM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component maxima.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Clamped matrix.

#### Since

0.9.0

***

### clampScalar()

> `static` **clampScalar**(`matrix`, `min`, `max`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:874](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L874)

Clamps all matrix components between scalar min and max.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clamp.

##### min

`number`

Minimum scalar.

##### max

`number`

Maximum scalar.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Clamped matrix.

#### Since

0.9.0

***

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:711](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L711)

Applies Math.floor to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with floored elements.

#### Since

0.9.0

***

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:827](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L827)

Component-wise maximum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with per-component maxima.

#### Since

0.9.0

***

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:807](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L807)

Component-wise minimum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix.

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with per-component minima.

#### Since

0.9.0

***

### round()

> `static` **round**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:749](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L749)

Applies Math.round to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with rounded elements.

#### Since

0.9.0

***

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:787](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L787)

Applies sign function to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with signs (-1, 0, or 1).

#### Since

0.9.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix2.ts:1345](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1345)

Column 0, Row 0 (typically cosine for rotation, x-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m00`](../../types/interfaces/Matrix2Like.md#m00)

***

### m01

> **m01**: `number`

Defined in: [src/core/matrix2.ts:1350](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1350)

Column 0, Row 1 (typically sine for rotation, y-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m01`](../../types/interfaces/Matrix2Like.md#m01)

***

### m10

> **m10**: `number`

Defined in: [src/core/matrix2.ts:1355](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1355)

Column 1, Row 0 (typically -sine for rotation, x-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m10`](../../types/interfaces/Matrix2Like.md#m10)

***

### m11

> **m11**: `number`

Defined in: [src/core/matrix2.ts:1360](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1360)

Column 1, Row 1 (typically cosine for rotation, y-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m11`](../../types/interfaces/Matrix2Like.md#m11)

***

### EPSILON\_MATRIX

> `readonly` `static` **EPSILON\_MATRIX**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:116](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L116)

Matrix with all elements set to EPSILON (useful for tolerance comparisons).

***

### FLIP\_X

> `readonly` `static` **FLIP\_X**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:130](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L130)

Flip horizontally (mirror across Y axis).

***

### FLIP\_XY

> `readonly` `static` **FLIP\_XY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:136](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L136)

Flip both axes (same as ROTATE_180).

***

### FLIP\_Y

> `readonly` `static` **FLIP\_Y**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:133](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L133)

Flip vertically (mirror across X axis).

***

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:107](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L107)

Identity matrix (no transformation).

***

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:113](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L113)

All-ones matrix.

***

### ROTATE\_180

> `readonly` `static` **ROTATE\_180**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:124](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L124)

180° rotation (same as FLIP_XY).

***

### ROTATE\_270

> `readonly` `static` **ROTATE\_270**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:127](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L127)

270° counter-clockwise rotation (same as 90° clockwise).

***

### ROTATE\_90

> `readonly` `static` **ROTATE\_90**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:121](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L121)

90° counter-clockwise rotation.

***

### SCALE\_2

> `readonly` `static` **SCALE\_2**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:139](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L139)

Uniform scale by 2.

***

### SCALE\_HALF

> `readonly` `static` **SCALE\_HALF**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:142](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L142)

Uniform scale by 0.5.

***

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:110](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L110)

Zero matrix.

***

### column0

#### Get Signature

> **get** **column0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1683](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1683)

Returns the first column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First column vector

***

### column1

#### Get Signature

> **get** **column1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1691](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1691)

Returns the second column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second column vector

***

### diagonal

#### Get Signature

> **get** **diagonal**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1715](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1715)

Returns the diagonal elements as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Diagonal vector (m00, m11)

***

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1655](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1655)

Returns a new inverted matrix without modifying this one.
Returns identity if matrix is singular.

##### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const inv = m.inverted;
// m × inv ≈ identity
```

##### Returns

`Matrix2`

New inverted matrix

***

### negated

#### Get Signature

> **get** **negated**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1675](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1675)

Returns a new negated matrix without modifying this one.

##### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const neg = m.negated;
// neg = Matrix2(-1, -2, -3, -4), m unchanged
```

##### Returns

`Matrix2`

New negated matrix

***

### row0

#### Get Signature

> **get** **row0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1699](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1699)

Returns the first row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First row vector

***

### row1

#### Get Signature

> **get** **row1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1707](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1707)

Returns the second row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second row vector

***

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1639](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1639)

Returns a new transposed matrix without modifying this one.

##### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const t = m.transposed;
// t = Matrix2(1, 3, 2, 4), m unchanged
```

##### Returns

`Matrix2`

New transposed matrix

***

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix2.ts:2083](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2083)

Applies absolute value to all elements.

#### Returns

`this`

This matrix for chaining

***

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix2.ts:2012](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2012)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This matrix for chaining

***

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix2.ts:2059](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2059)

Applies Math.ceil to all elements.

#### Returns

`this`

This matrix for chaining

***

### clamp()

> **clamp**(`minM`, `maxM`): `this`

Defined in: [src/core/matrix2.ts:2135](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2135)

Clamps all components between min and max matrices.

#### Parameters

##### minM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component minima

##### maxM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component maxima

#### Returns

`this`

This matrix for chaining

***

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/core/matrix2.ts:2149](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2149)

Clamps all components between scalar bounds.

#### Parameters

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

#### Returns

`this`

This matrix for chaining

***

### clone()

> **clone**(): `Matrix2`

Defined in: [src/core/matrix2.ts:2660](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2660)

Creates a clone of this matrix.

#### Returns

`Matrix2`

New matrix with same components

***

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix2.ts:2047](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2047)

Applies Math.floor to all elements.

#### Returns

`this`

This matrix for chaining

***

### getColumn()

> **getColumn**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2258](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2258)

Gets a column of the matrix as a vector.

#### Parameters

##### index

`number`

Column index (0 or 1)

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Column vector

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const col0 = m.getColumn(0); // First column
const col1 = m.getColumn(1); // Second column
```

***

### getRow()

> **getRow**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2315](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2315)

Gets a row of the matrix as a vector.

#### Parameters

##### index

`number`

Row index (0 or 1)

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Row vector

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const row0 = m.getRow(0); // First row
const row1 = m.getRow(1); // Second row
```

***

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix2.ts:2452](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2452)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

***

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix2.ts:1952](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1952)

Inverts the matrix in place.

#### Returns

`this`

This matrix for chaining

#### Throws

If matrix is singular (determinant ≈ 0)

***

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix2.ts:1970](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1970)

Safe inversion in place. Sets to identity if singular.

#### Returns

`this`

This matrix for chaining

***

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix2.ts:1999](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1999)

Unchecked inversion for hot paths.

⚠️ **Precondition:** Matrix must be invertible (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
if (matrix.isInvertible()) {
  matrix.inverseUnchecked();
}
```

***

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2492](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2492)

Tests if this matrix is diagonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is diagonal

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix2.ts:2439](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2439)

Tests if all components are finite numbers.

#### Returns

`boolean`

True if all components are finite

***

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2404](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2404)

Tests if this is the identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

***

### isSingular()

> **isSingular**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2501](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2501)

Tests if this matrix is singular (determinant ≈ 0).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is singular

***

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2479](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2479)

Tests if this matrix is skew-symmetric.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is skew-symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

***

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2468](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2468)

Tests if this matrix is symmetric (m01 ≈ m10).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix2.ts:2417](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2417)

Tests if this matrix is exactly zero.

#### Returns

`boolean`

True if all components are zero

***

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2522](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2522)

Linear interpolation with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
const a = Matrix2.IDENTITY.clone();
const b = Matrix2.fromRotation(Math.PI / 2);
a.lerp(b, 0.5); // a is now halfway between identity and b
```

***

### lerpUnclamped()

> **lerpUnclamped**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2537](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2537)

Linear interpolation without clamping t.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix

##### t

`number`

Interpolation factor (not clamped)

#### Returns

`this`

This matrix for chaining

***

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix2.ts:2121](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2121)

Component-wise maximum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

***

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix2.ts:2108](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2108)

Component-wise minimum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

***

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2584](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2584)

Alias for [scale](#scale-2). Multiplies all components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This matrix for chaining

***

### nearZero()

> **nearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2426](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2426)

Tests if this matrix is approximately zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within epsilon of zero

***

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix2.ts:2031](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2031)

Negates all elements of this matrix in place.

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
m.negate();
// m = Matrix2(-1, -2, -3, -4)
```

***

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:2173](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2173)

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to multiply by

#### Returns

`this`

This matrix for chaining

#### Remarks

Unlike `multiply`, this applies the other transformation first.
Useful when building transformation chains in specific order.

#### Example

```typescript
const scale = Matrix2.fromScale(2);
const rot = Matrix2.fromRotation(Math.PI / 4);
scale.premultiply(rot); // scale is now rot × scale
```

***

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix2.ts:2211](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2211)

Rotates this matrix by an angle in place.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`this`

This matrix for chaining

***

### round()

> **round**(): `this`

Defined in: [src/core/matrix2.ts:2071](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2071)

Applies Math.round to all elements.

#### Returns

`this`

This matrix for chaining

***

### scaleBy()

> **scaleBy**(`scale`): `this`

Defined in: [src/core/matrix2.ts:2227](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2227)

Scales this matrix by per-axis factors.

#### Parameters

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This matrix for chaining

***

### setColumn()

> **setColumn**(`index`, `column`): `this`

Defined in: [src/core/matrix2.ts:2284](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2284)

Sets a column of the matrix from a vector.

#### Parameters

##### index

`number`

Column index (0 or 1)

##### column

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to set as column

#### Returns

`this`

This matrix for chaining

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = new Matrix2();
m.setColumn(0, new Vector2(2, 0)); // Set first column
```

***

### setRow()

> **setRow**(`index`, `row`): `this`

Defined in: [src/core/matrix2.ts:2341](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2341)

Sets a row of the matrix from a vector.

#### Parameters

##### index

`number`

Row index (0 or 1)

##### row

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to set as row

#### Returns

`this`

This matrix for chaining

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = new Matrix2();
m.setRow(0, new Vector2(2, 0)); // Set first row
```

***

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix2.ts:2095](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2095)

Applies sign function to all elements.

#### Returns

`this`

This matrix for chaining

***

### toArray()

> **toArray**(`out?`, `offset?`, `columnMajor?`): `number`[]

Defined in: [src/core/matrix2.ts:2599](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2599)

Converts to array form.

#### Parameters

##### out?

`number`[]

Optional array to fill

##### offset?

`number` = `0`

Starting index (default: 0)

##### columnMajor?

`boolean` = `true`

If true, use column-major order (default: true)

#### Returns

`number`[]

Array with matrix elements

***

### toFloat32Array()

> **toFloat32Array**(`out?`, `offset?`, `columnMajor?`): `Float32Array`

Defined in: [src/core/matrix2.ts:2624](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2624)

Converts to Float32Array.

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional array to fill

##### offset?

`number` = `0`

Starting index (default: 0)

##### columnMajor?

`boolean` = `true`

If true, use column-major order (default: true)

#### Returns

`Float32Array`

Float32Array with matrix elements

***

### toJSON()

> **toJSON**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2642](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2642)

Alias for toObject (JSON serialization).

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with matrix components.

***

### toObject()

> **toObject**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2634](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2634)

Converts to a plain object.

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with m00, m01, m10, m11 properties.

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix2.ts:2651](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2651)

Converts to string representation.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

String representation

***

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2201](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L2201)

Transforms a vector by this matrix.

#### Parameters

##### vector

[`ReadonlyVector2`](../type-aliases/ReadonlyVector2.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output object

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Example

```typescript
const mat = Matrix2.fromRotation(Math.PI / 2);
const v = new Vector2(1, 0);
const rotated = mat.transformVector(v); // Vector2(0, 1)
```

***

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix2.ts:1940](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1940)

Transposes the matrix in place.

#### Returns

`this`

This matrix for chaining

***

### compose()

> `static` **compose**(`rotation`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1284](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1284)

Composes a matrix from rotation angle and scale.

#### Parameters

##### rotation

`number`

Rotation angle in radians

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Composed transformation matrix

#### Example

```typescript
const m = Matrix2.compose(Math.PI / 4, new Vector2(2, 1));
```

***

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix2.ts:1310](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1310)

Decomposes a matrix into rotation and scale components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to decompose

#### Returns

`object`

Object with rotation (radians) and scale (Vector2)

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4).scaleBy(new Vector2(2, 1));
const { rotation, scale } = Matrix2.decompose(m);
```

***

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1326](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix2.ts#L1326)

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)
