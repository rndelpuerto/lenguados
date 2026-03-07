# Class: Matrix2

Defined in: [src/core/matrix2.ts:103](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L103)

Column-major 2×2 matrix suitable for WebGL and physics calculations.

## Remarks

**Data Layout**: Stores elements in **Column-Major Memory Layout** (standard for WebGL and Three.js).
Example memory sequence:

- Column 0: `m00`, `m10`
- Column 1: `m01`, `m11`

**API Design**:

- Instance methods mutate `this` for fluent chaining.
- Static helpers are pure and provide optional `out` parameters to eliminate allocations.
- Trigonometric operations rely on deterministic kernels.

## Since

0.7.0

## Implements

- [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

## Constructors

### Constructor

> **new Matrix2**(`m00OrSource?`, `m01?`, `m10?`, `m11?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1631](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1631)

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

#### Throws

If array has less than 4 elements.

#### Throws

If arguments are invalid.

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

Defined in: [src/core/matrix2.ts:1988](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1988)

Adds another matrix to this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2066](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2066)

Adds a scalar to all components.

#### Parameters

##### scalar

`number`

Scalar to add.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2123](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2123)

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

0.7.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2144](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2144)

Safe scalar division. If |scalar| ≤ EPSILON, sets all components to zero.

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2168](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2168)

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

0.7.0

---

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix2.ts:2101](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2101)

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

0.7.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix2.ts:2189](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2189)

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

0.7.0

---

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2206](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2206)

Scalar modulo on all components.

#### Parameters

##### scalar

`number`

Scalar divisor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:2029](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2029)

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

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2049](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2049)

Scales all matrix components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix2.ts:2005](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2005)

Subtracts another matrix from this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to subtract.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2083](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2083)

Subtracts a scalar from all components.

#### Parameters

##### scalar

`number`

Scalar to subtract.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:881](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L881)

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

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:415](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L415)

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

0.7.0

---

### addScalar()

> `static` **addScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:507](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L507)

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

0.7.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:766](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L766)

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

0.7.0

---

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:824](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L824)

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

0.7.0

---

### clamp()

> `static` **clamp**(`matrix`, `minM`, `maxM`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:961](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L961)

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

0.7.0

---

### clampScalar()

> `static` **clampScalar**(`matrix`, `min`, `max`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:987](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L987)

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

0.7.0

---

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:581](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L581)

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

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:605](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L605)

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

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:636](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L636)

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

0.7.0

---

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:805](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L805)

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

0.7.0

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:551](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L551)

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

0.7.0

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:675](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L675)

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

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:706](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L706)

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

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:742](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L742)

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

0.7.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:940](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L940)

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

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:920](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L920)

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

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:452](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L452)

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

#### Example

```typescript
const rot = Matrix2.fromRotation(Math.PI / 2); // 90° rotation
const scl = Matrix2.fromScale(2, 2); // uniform scale
const combined = Matrix2.multiply(rot, scl); // rotate then scale
```

#### Since

0.7.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:492](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L492)

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

0.7.0

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:787](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L787)

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

0.7.0

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:843](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L843)

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

0.7.0

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:472](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L472)

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

0.7.0

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:900](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L900)

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

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:430](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L430)

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

0.7.0

---

### subtractScalar()

> `static` **subtractScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:527](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L527)

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

0.7.0

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:660](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L660)

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

0.7.0

---

### trunc()

> `static` **trunc**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:862](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L862)

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

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix2.ts:2686](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2686)

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

0.7.0

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1820](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1820)

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

0.7.0

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1833](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1833)

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

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2703](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2703)

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

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix2.ts:1122](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1122)

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

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1253](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1253)

Tests if any component is infinite (±Infinity).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if any component is ±Infinity.

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1232](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1232)

Tests if any component is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if any component is NaN.

#### Since

0.7.0

---

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1306](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1306)

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

0.7.0

---

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1214](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1214)

Tests if all components are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if all components are finite.

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1164](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1164)

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

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1324](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1324)

Tests if a matrix is invertible (determinant ≠ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is invertible (non-singular).

#### Default Value

`EPSILON`

#### Remarks

A matrix is invertible when its determinant is non-zero.
This follows the Eigen C++ convention.

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1196](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1196)

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

0.7.0

---

### isOrthogonal()

> `static` **isOrthogonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1342](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1342)

Tests if a matrix is orthogonal (M \* M^T = I).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal.

#### Default Value

`EPSILON`

#### Remarks

An orthogonal matrix has columns that are orthonormal (unit length and perpendicular).
Orthogonal matrices represent pure rotations/reflections and preserve distances/angles.

#### Since

0.7.0

---

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1288](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1288)

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

0.7.0

---

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1271](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1271)

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

0.7.0

---

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1182](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1182)

Tests if a matrix is exactly zero.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test.

#### Returns

`boolean`

True if all components are zero.

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1141](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1141)

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

0.7.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix2.ts:1778](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1778)

Calculates the determinant of the matrix.

#### Returns

`number`

Determinant value.

#### Remarks

A determinant of 0 indicates the matrix is singular (non-invertible).
The absolute value represents the area scaling factor.

#### Since

0.7.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix2.ts:1805](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1805)

Calculates the Frobenius norm.

#### Returns

`number`

Square root of sum of squared elements.

#### Remarks

Uses deterministic sqrt for cross-platform reproducibility.

#### Since

0.7.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix2.ts:1857](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1857)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians.

#### Remarks

Assumes the matrix represents a pure rotation or rotation with uniform scale.

#### Since

0.7.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1874](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1874)

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

0.7.0

---

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix2.ts:1790](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1790)

Calculates the trace of the matrix.

#### Returns

`number`

Sum of diagonal elements.

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `4` = `4`

Defined in: [src/core/matrix2.ts:124](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L124)

Number of elements when serialized to an array.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix2.ts:3039](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L3039)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding m00, m01, m10, m11.

#### Example

```typescript
const [m00, m01, m10, m11] = Matrix2.IDENTITY;
```

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`, `columnMajor?`): \[`number`, `number`, `number`, `number`\] \| `T`

Defined in: [src/core/matrix2.ts:2900](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2900)

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

0.7.0

---

### toMatrix3Like()

> **toMatrix3Like**(`out?`): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix2.ts:2973](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2973)

Converts this matrix to a Matrix3Like (embeds in homogeneous coordinates).

#### Parameters

##### out?

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Optional output object to populate.

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Matrix3Like representation (plain object or provided out).

#### Remarks

Returns a `Matrix3Like` object, not a `Matrix3` instance, to avoid
circular dependencies. If you need a full `Matrix3` instance, use:

```typescript
const mat3 = Matrix3.fromMatrix2(this);
```

The 2×2 matrix is embedded in the upper-left corner:

```
[ m00  m10  0 ]
[ m01  m11  0 ]
[  0    0   1 ]
```

#### Example

```typescript
const m2 = Matrix2.fromRotation(Math.PI / 4);
const m3Like = m2.toMatrix3Like();
// m3Like represents the same rotation in homogeneous coordinates
```

#### Since

0.9.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:198](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L198)

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

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Matrix2`

Defined in: [src/core/matrix2.ts:212](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L212)

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

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:362](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L362)

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

0.7.0

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:322](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L322)

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

0.7.0

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:396](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L396)

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

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:227](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L227)

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

0.7.0

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:259](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L259)

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

0.7.0

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:341](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L341)

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

0.7.0

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:284](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L284)

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

0.7.0

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:307](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L307)

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

0.7.0

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:178](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L178)

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

0.7.0

## Interpolation

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2847](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2847)

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

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2861](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2861)

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

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1024](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1024)

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

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1054](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1054)

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

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1078](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1078)

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

0.7.0

## Matrix Operations

### rotateCS()

> **rotateCS**(`cos`, `sin`): `this`

Defined in: [src/core/matrix2.ts:2520](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2520)

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

0.7.0

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1368](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1368)

Calculates the determinant of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate determinant of.

#### Returns

`number`

Determinant value.

#### Since

0.7.0

---

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1397](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1397)

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

0.7.0

---

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1381](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1381)

Calculates the trace (sum of diagonal elements) of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate trace of.

#### Returns

`number`

Sum of diagonal elements (m00 + m11).

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/matrix2.ts:1709](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1709)

Copies components from another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2`](../type-aliases/ReadonlyMatrix2.md)

Matrix to copy from.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix2.ts:1738](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1738)

Sets this matrix to identity.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

---

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

Defined in: [src/core/matrix2.ts:1692](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1692)

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

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/matrix2.ts:1726](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1726)

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

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix2.ts:1754](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1754)

Resets all components to zero.

#### Returns

`this`

This matrix for chaining.

#### Since

0.7.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix2.ts:1585](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1585)

Column 0, Row 0 (typically cosine for rotation, x-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m00`](../../types/interfaces/Matrix2Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix2.ts:1590](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1590)

Column 0, Row 1 (typically sine for rotation, y-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m01`](../../types/interfaces/Matrix2Like.md#m01)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix2.ts:1595](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1595)

Column 1, Row 0 (typically -sine for rotation, x-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m10`](../../types/interfaces/Matrix2Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix2.ts:1600](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1600)

Column 1, Row 1 (typically cosine for rotation, y-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m11`](../../types/interfaces/Matrix2Like.md#m11)

---

### EPSILON_MATRIX

> `readonly` `static` **EPSILON_MATRIX**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:133](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L133)

Matrix with all elements set to EPSILON (useful for tolerance comparisons).

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:147](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L147)

Flip horizontally (mirror across Y axis).

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:153](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L153)

Flip both axes (same as ROTATE_180).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:150](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L150)

Flip vertically (mirror across X axis).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:117](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L117)

Identity matrix (no transformation).

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:130](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L130)

All-ones matrix.

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:141](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L141)

180° rotation (same as FLIP_XY).

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:144](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L144)

270° counter-clockwise rotation (same as 90° clockwise).

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:138](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L138)

90° counter-clockwise rotation.

---

### SCALE_2

> `readonly` `static` **SCALE_2**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:156](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L156)

Uniform scale by 2.

---

### SCALE_HALF

> `readonly` `static` **SCALE_HALF**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:159](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L159)

Uniform scale by 0.5.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:127](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L127)

Zero matrix.

---

### column0

#### Get Signature

> **get** **column0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1939](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1939)

Returns the first column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First column vector

---

### column1

#### Get Signature

> **get** **column1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1947](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1947)

Returns the second column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second column vector

---

### diagonal

#### Get Signature

> **get** **diagonal**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1971](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1971)

Returns the diagonal elements as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Diagonal vector (m00, m11)

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1911](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1911)

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

Defined in: [src/core/matrix2.ts:1931](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1931)

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

Defined in: [src/core/matrix2.ts:1955](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1955)

Returns the first row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First row vector

---

### row1

#### Get Signature

> **get** **row1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1963](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1963)

Returns the second row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second row vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix2`

Defined in: [src/core/matrix2.ts:1895](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1895)

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

Defined in: [src/core/matrix2.ts:2365](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2365)

Applies absolute value to all elements.

#### Returns

`this`

This matrix for chaining

---

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix2.ts:2294](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2294)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This matrix for chaining

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix2.ts:2341](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2341)

Applies Math.ceil to all elements.

#### Returns

`this`

This matrix for chaining

---

### clamp()

> **clamp**(`minM`, `maxM`): `this`

Defined in: [src/core/matrix2.ts:2417](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2417)

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

Defined in: [src/core/matrix2.ts:2431](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2431)

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

Defined in: [src/core/matrix2.ts:3023](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L3023)

Creates a clone of this matrix.

#### Returns

`Matrix2`

New matrix with same components

---

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix2.ts:2329](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2329)

Applies Math.floor to all elements.

#### Returns

`this`

This matrix for chaining

---

### getColumn()

> **getColumn**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2566](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2566)

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

Defined in: [src/core/matrix2.ts:2623](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2623)

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

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/matrix2.ts:2773](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2773)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix2.ts:2760](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2760)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix2.ts:2234](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2234)

Inverts the matrix in place.

#### Returns

`this`

This matrix for chaining

#### Throws

If matrix is singular (determinant ≈ 0)

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix2.ts:2252](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2252)

Safe inversion in place. Sets to identity if singular.

#### Returns

`this`

This matrix for chaining

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix2.ts:2281](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2281)

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

Defined in: [src/core/matrix2.ts:2808](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2808)

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

Defined in: [src/core/matrix2.ts:2747](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2747)

Tests if all components are finite numbers.

#### Returns

`boolean`

True if all components are finite

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2712](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2712)

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

Defined in: [src/core/matrix2.ts:2734](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2734)

Tests if this matrix is approximately zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within epsilon of zero

---

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2795](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2795)

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

Defined in: [src/core/matrix2.ts:2784](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2784)

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

Defined in: [src/core/matrix2.ts:2725](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2725)

Tests if this matrix is exactly zero.

#### Returns

`boolean`

True if all components are zero

---

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:2829](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2829)

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

Defined in: [src/core/matrix2.ts:2403](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2403)

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

Defined in: [src/core/matrix2.ts:2390](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2390)

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

Defined in: [src/core/matrix2.ts:2876](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2876)

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

Defined in: [src/core/matrix2.ts:2313](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2313)

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

Defined in: [src/core/matrix2.ts:2455](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2455)

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

Defined in: [src/core/matrix2.ts:2494](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2494)

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

Defined in: [src/core/matrix2.ts:2353](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2353)

Applies Math.round to all elements.

#### Returns

`this`

This matrix for chaining

---

### scaleBy()

> **scaleBy**(`scale`): `this`

Defined in: [src/core/matrix2.ts:2535](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2535)

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

Defined in: [src/core/matrix2.ts:2592](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2592)

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

Defined in: [src/core/matrix2.ts:2649](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2649)

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

Defined in: [src/core/matrix2.ts:2377](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2377)

Applies sign function to all elements.

#### Returns

`this`

This matrix for chaining

---

### toJSON()

> **toJSON**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2939](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2939)

Alias for toObject (JSON serialization).

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with matrix components.

---

### toObject()

> **toObject**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:2931](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2931)

Converts to a plain object.

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with m00, m01, m10, m11 properties.

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix2.ts:3002](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L3002)

Converts to string representation.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

String representation

---

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix2.ts:2222](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2222)

Transposes the matrix in place.

#### Returns

`this`

This matrix for chaining

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/matrix2.ts:3011](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L3011)

Applies Math.trunc to all elements (rounds towards zero).

#### Returns

`this`

This for chaining.

---

### compose()

> `static` **compose**(`rotation`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1418](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1418)

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

Defined in: [src/core/matrix2.ts:1444](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1444)

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

Defined in: [src/core/matrix2.ts:1460](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1460)

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

## Transform

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2484](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L2484)

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

### rotate()

> `static` **rotate**(`matrix`, `angle`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1493](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1493)

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

0.7.0

---

### rotateCS()

> `static` **rotateCS**(`matrix`, `cos`, `sin`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1524](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1524)

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

0.7.0

---

### scaleBy()

> `static` **scaleBy**(`matrix`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1561](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L1561)

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

0.7.0
