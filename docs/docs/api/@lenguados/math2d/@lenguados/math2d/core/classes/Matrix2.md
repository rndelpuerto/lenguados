# Class: Matrix2

Defined in: [src/core/matrix2.ts:98](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L98)

Column-major 2×2 matrix suitable for WebGL and physics calculations.

## Remarks

- Instance methods mutate `this` for fluent chaining.
- Static helpers are pure and provide optional `out` parameters to eliminate allocations.
- Trigonometric operations rely on [DeterministicMath](../../deterministic/classes/DeterministicMath.md).

## Since

0.1.0

## Implements

- [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

## Constructors

### Constructor

> **new Matrix2**(`m00OrSource?`, `m01?`, `m10?`, `m11?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1571](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1571)

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
new Matrix2(); // Identity: [1,0,0,1]
new Matrix2(1, 2, 3, 4); // Explicit: m00=1, m01=2, m10=3, m11=4
new Matrix2([1, 2, 3, 4]); // From array
new Matrix2({ m00: 1, m01: 2, m10: 3, m11: 4 }); // From object
```

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix2.ts:1927](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1927)

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

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2005](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2005)

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

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2062](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2062)

Divides all components by a scalar (strict).

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Throws

If scalar is near zero.

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Since

0.9.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2083](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2083)

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

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2107](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2107)

Unchecked scalar division for hot paths.

#### Parameters

##### scalar

`number`

Scalar divisor (must be non-zero).

#### Returns

`this`

This matrix for chaining.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.

#### Since

0.11.0

---

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix2.ts:2040](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2040)

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

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix2.ts:2128](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2128)

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

---

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2145](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2145)

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

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:1968](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1968)

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

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:1988](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1988)

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

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix2.ts:1944](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1944)

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

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2022](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2022)

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

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:412](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L412)

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

---

### addScalar()

> `static` **addScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:497](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L497)

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

---

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:571](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L571)

Divides all matrix components by a scalar (strict).

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

#### Throws

If scalar is near zero.

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Since

0.9.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:595](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L595)

Divides all matrix components by a scalar (safe).

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

Matrix with components divided by scalar, or zero matrix if scalar is near zero.

#### Since

0.11.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:626](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L626)

Divides all matrix components by a scalar (unchecked for hot paths).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### scalar

`number`

Scalar divisor (must be non-zero).

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Matrix with components divided by scalar.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.

#### Since

0.11.0

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:541](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L541)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:442](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L442)

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

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:482](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L482)

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

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:462](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L462)

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

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:427](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L427)

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

---

### subtractScalar()

> `static` **subtractScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:517](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L517)

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

Defined in: [src/core/matrix2.ts:2624](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2624)

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

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1759](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1759)

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

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1772](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1772)

Tests if this matrix is orthogonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if M \* M^T = I.

#### Default Value

`EPSILON`

#### Since

0.9.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2641](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2641)

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

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix2.ts:1112](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1112)

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

---

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1222](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1222)

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

---

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1279](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1279)

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

---

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1204](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1204)

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

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1154](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1154)

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

---

### isNearZero()

> `static` **isNearZero**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1186](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1186)

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

---

### isSingular()

> `static` **isSingular**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1293](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1293)

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

---

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1261](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1261)

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

---

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1244](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1244)

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

---

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1172](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1172)

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

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1131](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1131)

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

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix2.ts:1717](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1717)

Calculates the determinant of the matrix.

#### Returns

`number`

Determinant value.

#### Remarks

A determinant of 0 indicates the matrix is singular (non-invertible).
The absolute value represents the area scaling factor.

#### Since

0.1.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix2.ts:1744](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1744)

Calculates the Frobenius norm.

#### Returns

`number`

Square root of sum of squared elements.

#### Remarks

Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.9.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix2.ts:1796](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1796)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians.

#### Remarks

Assumes the matrix represents a pure rotation or rotation with uniform scale.

#### Since

0.1.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1813](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1813)

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

---

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix2.ts:1729](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1729)

Calculates the trace of the matrix.

#### Returns

`number`

Sum of diagonal elements.

#### Since

0.9.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix2.ts:2937](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2937)

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

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`, `columnMajor?`): \[`number`, `number`, `number`, `number`\] \| `T`

Defined in: [src/core/matrix2.ts:2839](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2839)

Writes the matrix to an array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

Array type (number[], Float32Array, Float64Array, etc.)

#### Parameters

##### out?

`T`

Optional output array. If not provided, returns a new tuple.

##### offset?

`number` = `0`

Write offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

\[`number`, `number`, `number`, `number`\] \| `T`

The output array, or a new tuple if no output was provided.

#### Default Value

`0`

#### Default Value

`true`

#### Remarks

Follows the same pattern as [Vector2.toArray](Vector2.md#toarray) for API consistency.
Accepts any array-like type that supports indexed assignment.

#### Since

0.1.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:191](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L191)

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

---

### copy()

> `static` **copy**(`source`, `destination`): `Matrix2`

Defined in: [src/core/matrix2.ts:205](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L205)

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

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:359](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L359)

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

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:319](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L319)

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

---

### fromMatrix()

> `static` **fromMatrix**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:393](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L393)

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

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:220](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L220)

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

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:256](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L256)

Creates a matrix from a rotation.

#### Parameters

##### rotation

Rotation object (with cos/sin properties) or angle in radians.

`number` | [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Rotation matrix.

#### Remarks

Accepts any object with `cos` and `sin` properties, including:

- Rotation2 instances
- Plain objects `{ cos, sin }`
- Results from `sinCos(angle)`

#### Example

```typescript
// From angle
const mat1 = Matrix2.fromRotation(Math.PI / 3);

// From Rotation2Like
const mat2 = Matrix2.fromRotation({ cos: 0.5, sin: 0.866 });

// From sinCos result
const mat3 = Matrix2.fromRotation(sinCos(Math.PI / 4));
```

#### Since

0.1.0

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:338](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L338)

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

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:281](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L281)

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

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:304](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L304)

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

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:171](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L171)

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

Defined in: [src/core/matrix2.ts:2786](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2786)

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

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2800](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2800)

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

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1014](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1014)

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

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1044](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1044)

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

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1068](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1068)

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

### rotateCS()

> **rotateCS**(`cos`, `sin`): `this`

Defined in: [src/core/matrix2.ts:2458](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2458)

Rotates this matrix using precomputed cosine and sine values in place.

#### Parameters

##### cos

`number`

Cosine of the rotation angle.

##### sin

`number`

Sine of the rotation angle.

#### Returns

`this`

This matrix for chaining.

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m = new Matrix2();
m.rotateCS(rotation.cos, rotation.sin);
```

#### Since

0.12.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:756](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L756)

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

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1310](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1310)

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

---

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1339](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1339)

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

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:665](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L665)

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

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:696](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L696)

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

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:732](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L732)

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

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:777](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L777)

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

---

### rotate()

> `static` **rotate**(`matrix`, `angle`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1435](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1435)

Rotates a matrix by an angle.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to rotate.

##### angle

`number`

Angle in radians.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Rotated matrix.

#### Remarks

Equivalent to `Matrix2.multiply(matrix, Matrix2.fromRotation(angle), out)`
but more efficient as it avoids creating an intermediate matrix.

#### Example

```typescript
const m = Matrix2.fromScale(2, 1);
const rotated = Matrix2.rotate(m, Math.PI / 4);
```

#### Since

0.11.0

---

### rotateCS()

> `static` **rotateCS**(`matrix`, `cos`, `sin`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1466](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1466)

Rotates a matrix using precomputed cosine and sine values.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to rotate.

##### cos

`number`

Cosine of the rotation angle.

##### sin

`number`

Sine of the rotation angle.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Rotated matrix.

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m1 = Matrix2.fromScale(2, 1);
const m2 = Matrix2.fromScale(1, 2);
// Apply same rotation to both matrices efficiently
const r1 = Matrix2.rotateCS(m1, rotation.cos, rotation.sin);
const r2 = Matrix2.rotateCS(m2, rotation.cos, rotation.sin);
```

#### Since

0.12.0

---

### scaleBy()

> `static` **scaleBy**(`matrix`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1503](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1503)

Scales a matrix by per-axis factors.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to scale.

##### scale

Scale factors (Vector2 or uniform number).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Scaled matrix.

#### Remarks

Unlike [scale](#scaleby-3) which multiplies all elements by a scalar,
this method applies non-uniform scaling using a Vector2.

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const scaled = Matrix2.scaleBy(m, { x: 2, y: 0.5 });
```

#### Since

0.11.0

---

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1323](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1323)

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

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:650](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L650)

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

Defined in: [src/core/matrix2.ts:1648](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1648)

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

---

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix2.ts:1677](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1677)

Sets this matrix to identity.

#### Returns

`this`

This matrix for chaining.

#### Since

0.1.0

---

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

Defined in: [src/core/matrix2.ts:1631](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1631)

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

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/matrix2.ts:1665](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1665)

Sets this matrix from array values (column-major order).

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [m00, m01, m10, m11].

##### offset

`number` = `0`

Starting index (default 0).

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix2.ts:1693](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1693)

Resets all components to zero.

#### Returns

`this`

This matrix for chaining.

#### Since

0.9.0

## Numeric Transform

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:871](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L871)

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

---

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:814](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L814)

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

---

### clamp()

> `static` **clamp**(`matrix`, `minM`, `maxM`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:951](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L951)

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

---

### clampScalar()

> `static` **clampScalar**(`matrix`, `min`, `max`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:977](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L977)

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

---

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:795](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L795)

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

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:930](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L930)

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

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:910](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L910)

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

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:833](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L833)

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

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:890](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L890)

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

---

### trunc()

> `static` **trunc**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:852](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L852)

Applies Math.trunc to all matrix elements (rounds towards zero).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix.

##### out?

`Matrix2`

Optional output matrix.

#### Returns

`Matrix2`

Truncated matrix.

#### Since

0.14.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix2.ts:1527](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1527)

Column 0, Row 0 (typically cosine for rotation, x-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m00`](../../types/interfaces/Matrix2Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix2.ts:1532](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1532)

Column 0, Row 1 (typically sine for rotation, y-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m01`](../../types/interfaces/Matrix2Like.md#m01)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix2.ts:1537](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1537)

Column 1, Row 0 (typically -sine for rotation, x-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m10`](../../types/interfaces/Matrix2Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix2.ts:1542](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1542)

Column 1, Row 1 (typically cosine for rotation, y-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m11`](../../types/interfaces/Matrix2Like.md#m11)

---

### EPSILON_MATRIX

> `readonly` `static` **EPSILON_MATRIX**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:126](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L126)

Matrix with all elements set to EPSILON (useful for tolerance comparisons).

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:140](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L140)

Flip horizontally (mirror across Y axis).

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:146](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L146)

Flip both axes (same as ROTATE_180).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:143](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L143)

Flip vertically (mirror across X axis).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:117](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L117)

Identity matrix (no transformation).

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:123](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L123)

All-ones matrix.

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:134](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L134)

180° rotation (same as FLIP_XY).

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:137](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L137)

270° counter-clockwise rotation (same as 90° clockwise).

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:131](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L131)

90° counter-clockwise rotation.

---

### SCALE_2

> `readonly` `static` **SCALE_2**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:149](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L149)

Uniform scale by 2.

---

### SCALE_HALF

> `readonly` `static` **SCALE_HALF**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:152](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L152)

Uniform scale by 0.5.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:120](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L120)

Zero matrix.

---

### column0

#### Get Signature

> **get** **column0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1878](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1878)

Returns the first column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First column vector

---

### column1

#### Get Signature

> **get** **column1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1886](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1886)

Returns the second column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second column vector

---

### diagonal

#### Get Signature

> **get** **diagonal**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1910](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1910)

Returns the diagonal elements as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Diagonal vector (m00, m11)

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1850](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1850)

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

---

### negated

#### Get Signature

> **get** **negated**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1870](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1870)

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

---

### row0

#### Get Signature

> **get** **row0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1894](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1894)

Returns the first row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First row vector

---

### row1

#### Get Signature

> **get** **row1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1902](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1902)

Returns the second row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second row vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1834](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1834)

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

---

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix2.ts:2304](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2304)

Applies absolute value to all elements.

#### Returns

`this`

This matrix for chaining

---

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix2.ts:2233](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2233)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This matrix for chaining

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix2.ts:2280](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2280)

Applies Math.ceil to all elements.

#### Returns

`this`

This matrix for chaining

---

### clamp()

> **clamp**(`minM`, `maxM`): `this`

Defined in: [src/core/matrix2.ts:2356](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2356)

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

---

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/core/matrix2.ts:2370](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2370)

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

---

### clone()

> **clone**(): `Matrix2`

Defined in: [src/core/matrix2.ts:2921](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2921)

Creates a clone of this matrix.

#### Returns

`Matrix2`

New matrix with same components

---

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix2.ts:2268](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2268)

Applies Math.floor to all elements.

#### Returns

`this`

This matrix for chaining

---

### getColumn()

> **getColumn**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2504](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2504)

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

---

### getRow()

> **getRow**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2561](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2561)

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

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix2.ts:2698](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2698)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix2.ts:2173](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2173)

Inverts the matrix in place.

#### Returns

`this`

This matrix for chaining

#### Throws

If matrix is singular (determinant ≈ 0)

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix2.ts:2191](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2191)

Safe inversion in place. Sets to identity if singular.

#### Returns

`this`

This matrix for chaining

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix2.ts:2220](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2220)

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

---

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2738](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2738)

Tests if this matrix is diagonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is diagonal

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix2.ts:2685](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2685)

Tests if all components are finite numbers.

#### Returns

`boolean`

True if all components are finite

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2650](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2650)

Tests if this is the identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2672](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2672)

Tests if this matrix is approximately zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within epsilon of zero

---

### isSingular()

> **isSingular**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2747](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2747)

Tests if this matrix is singular (determinant ≈ 0).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is singular

---

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2725](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2725)

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

---

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2714](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2714)

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

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix2.ts:2663](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2663)

Tests if this matrix is exactly zero.

#### Returns

`boolean`

True if all components are zero

---

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2768](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2768)

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

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix2.ts:2342](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2342)

Component-wise maximum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

---

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix2.ts:2329](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2329)

Component-wise minimum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2815](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2815)

Alias for [scale](#scale-2). Multiplies all components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This matrix for chaining

---

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix2.ts:2252](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2252)

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

---

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:2394](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2394)

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

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix2.ts:2432](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2432)

Rotates this matrix by an angle in place.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`this`

This matrix for chaining

---

### round()

> **round**(): `this`

Defined in: [src/core/matrix2.ts:2292](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2292)

Applies Math.round to all elements.

#### Returns

`this`

This matrix for chaining

---

### scaleBy()

> **scaleBy**(`scale`): `this`

Defined in: [src/core/matrix2.ts:2473](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2473)

Scales this matrix by per-axis factors.

#### Parameters

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This matrix for chaining

---

### setColumn()

> **setColumn**(`index`, `column`): `this`

Defined in: [src/core/matrix2.ts:2530](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2530)

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

---

### setRow()

> **setRow**(`index`, `row`): `this`

Defined in: [src/core/matrix2.ts:2587](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2587)

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

---

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix2.ts:2316](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2316)

Applies sign function to all elements.

#### Returns

`this`

This matrix for chaining

---

### toFloat32Array()

> **toFloat32Array**(`out?`, `offset?`, `columnMajor?`): `Float32Array`

Defined in: [src/core/matrix2.ts:2873](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2873)

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

---

### toJSON()

> **toJSON**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2891](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2891)

Alias for toObject (JSON serialization).

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with matrix components.

---

### toObject()

> **toObject**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2883](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2883)

Converts to a plain object.

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with m00, m01, m10, m11 properties.

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix2.ts:2900](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2900)

Converts to string representation.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

String representation

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2422](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2422)

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

---

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix2.ts:2161](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2161)

Transposes the matrix in place.

#### Returns

`this`

This matrix for chaining

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/matrix2.ts:2909](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L2909)

Applies Math.trunc to all elements (rounds towards zero).

#### Returns

`this`

This for chaining.

---

### compose()

> `static` **compose**(`rotation`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1360](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1360)

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

---

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix2.ts:1386](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1386)

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

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1402](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix2.ts#L1402)

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)
