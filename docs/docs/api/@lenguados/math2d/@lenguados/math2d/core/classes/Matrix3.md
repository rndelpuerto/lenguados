# Class: Matrix3

Defined in: [src/core/matrix3.ts:130](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L130)

Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.

## Remarks

**Data Layout**: Stores elements in **Column-Major Memory Layout** (standard for WebGL and Three.js).
Example memory sequence:

- Column 0: `m00`, `m10`, `m20`
- Column 1: `m01`, `m11`, `m21`
- Column 2: `m02`, `m12`, `m22`

**API Design**

- Instance methods mutate `this` for fluent chaining
- Static helpers are pure and provide optional `out` parameters for allocation control
- Trigonometric operations use deterministic kernels for cross-platform reproducibility

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

0.7.0

## Implements

- [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

## Constructors

### Constructor

> **new Matrix3**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2072](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2072)

Creates identity matrix.

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `Matrix3`

Defined in: [src/core/matrix3.ts:2074](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2074)

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

Defined in: [src/core/matrix3.ts:2086](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2086)

Creates from 9-element array.

#### Parameters

##### array

readonly \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

#### Returns

`Matrix3`

### Constructor

> **new Matrix3**(`object`): `Matrix3`

Defined in: [src/core/matrix3.ts:2090](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2090)

Creates from plain object.

#### Parameters

##### object

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

#### Returns

`Matrix3`

## Arithmetic

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix3.ts:3127](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3127)

Takes the absolute value of all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix3.ts:2627](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2627)

Adds another matrix to this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2706](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2706)

Adds a scalar to all elements.

#### Parameters

##### scalar

`number`

Value to add.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix3.ts:2973](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2973)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This for chaining.

#### Remarks

The adjugate is the transpose of the cofactor matrix.
For a 3×3 matrix, each element is the determinant of the 2×2
minor matrix, with alternating signs.

#### Since

0.7.0

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix3.ts:3064](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3064)

Ceils all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### clamp()

> **clamp**(`minMatrix`, `maxMatrix`): `this`

Defined in: [src/core/matrix3.ts:3171](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3171)

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

0.7.0

---

### clampScalar()

> **clampScalar**(`minValue`, `maxValue`): `this`

Defined in: [src/core/matrix3.ts:3194](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3194)

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

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2778](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2778)

Divides all elements by a scalar (strict).

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining.

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

Defined in: [src/core/matrix3.ts:2795](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2795)

Divides all elements by a scalar (safe).

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining (sets to zero matrix if scalar is near zero).

#### Since

0.7.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2815](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2815)

Unchecked scalar division for hot paths.

#### Parameters

##### scalar

`number`

Divisor (must be non-zero).

#### Returns

`this`

This for chaining.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.

#### Since

0.7.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix3.ts:3043](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3043)

Floors all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### fma()

> **fma**(`scale`, `m`): `this`

Defined in: [src/core/matrix3.ts:2751](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2751)

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

0.7.0

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix3.ts:2855](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2855)

Inverts this matrix in place.

#### Returns

`this`

This for chaining.

#### Throws

Error if singular.

#### Since

0.7.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix3.ts:2893](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2893)

Inverts this matrix in place (safe version).

#### Returns

`this`

This for chaining (returns identity if singular).

#### Since

0.7.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix3.ts:2912](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2912)

Inverts this matrix in place (unchecked version).

#### Returns

`this`

This for chaining.

#### Remarks

Assumes matrix is invertible. Use for hot paths when you've already validated.

#### Since

0.7.0

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix3.ts:3238](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3238)

Takes element-wise maximum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix3.ts:3216](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3216)

Takes element-wise minimum with another matrix in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to compare.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix3.ts:3260](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3260)

Computes element-wise modulo in place.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Divisor matrix.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:3282](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3282)

Computes scalar modulo in place.

#### Parameters

##### scalar

`number`

Divisor.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:2594](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2594)

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2693](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2693)

Alias for scale.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix3.ts:2947](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2947)

Negates all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix3.ts:3007](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3007)

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix3.ts:3434](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3434)

Applies a rotation to this matrix in place.

#### Parameters

##### angle

`number`

Rotation angle in radians.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### round()

> **round**(): `this`

Defined in: [src/core/matrix3.ts:3085](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3085)

Rounds all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2671](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2671)

Scales all elements by a scalar.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### scaleBy()

> **scaleBy**(`scaleValue`): `this`

Defined in: [src/core/matrix3.ts:3486](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3486)

Applies a scale transformation to this matrix in place.

#### Parameters

##### scaleValue

Scale factor (scalar or per-axis vector).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix3.ts:3148](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3148)

Takes the sign of all elements in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix3.ts:2649](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2649)

Subtracts another matrix from this one element-wise.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix3.ts:2728](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2728)

Subtracts a scalar from all elements.

#### Parameters

##### scalar

`number`

Value to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### translate()

> **translate**(`translation`): `this`

Defined in: [src/core/matrix3.ts:3416](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3416)

Applies a translation to this matrix in place.

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix3.ts:2832](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2832)

Transposes this matrix in place.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/matrix3.ts:3106](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3106)

Applies Math.trunc to all elements in place (rounds towards zero).

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:995](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L995)

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

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:594](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L594)

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

0.7.0

---

### addScalar()

> `static` **addScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:619](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L619)

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

0.7.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1662](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1662)

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

0.7.0

---

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:923](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L923)

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

0.7.0

---

### clamp()

> `static` **clamp**(`m`, `minM`, `maxM`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1095](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1095)

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

0.7.0

---

### clampScalar()

> `static` **clampScalar**(`m`, `min`, `max`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1126](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1126)

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

0.7.0

---

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix3.ts:1854](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1854)

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

0.7.0

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1608](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1608)

Calculates the determinant.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate determinant of.

#### Returns

`number`

Determinant value.

#### Since

0.7.0

---

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:807](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L807)

Divides all elements by a scalar (strict).

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

#### Throws

If scalar is near zero.

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Since

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:826](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L826)

Divides all elements by a scalar (safe).

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

Matrix with each element divided by scalar, or zero matrix if scalar is near zero.

#### Since

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:852](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L852)

Divides all elements by a scalar (unchecked for hot paths).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### scalar

`number`

Divisor (must be non-zero).

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Matrix with each element divided by scalar.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.

#### Since

0.7.0

---

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:899](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L899)

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

0.7.0

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:698](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L698)

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

0.7.0

---

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1638](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1638)

Calculates the Frobenius norm.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate norm of.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²).

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1689](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1689)

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

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1731](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1731)

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

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1753](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1753)

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

0.7.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1069](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1069)

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

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1044](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1044)

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

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:735](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L735)

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

#### Example

```typescript
const translate = Matrix3.fromTranslation(10, 20);
const rotate = Matrix3.fromRotation(Math.PI / 4);
const combined = Matrix3.multiply(translate, rotate); // translate then rotate
```

#### Since

0.7.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:787](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L787)

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

0.7.0

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:871](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L871)

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

0.7.0

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:947](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L947)

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

0.7.0

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:762](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L762)

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

0.7.0

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1019](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1019)

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

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:644](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L644)

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

0.7.0

---

### subtractScalar()

> `static` **subtractScalar**(`m`, `s`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:669](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L669)

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

0.7.0

---

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix3.ts:1625](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1625)

Calculates the trace (sum of diagonal).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to calculate trace of.

#### Returns

`number`

Trace value.

#### Since

0.7.0

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1585](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1585)

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

0.7.0

---

### trunc()

> `static` **trunc**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:971](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L971)

Applies Math.trunc to all elements (rounds towards zero).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Truncated matrix.

#### Since

0.7.0

## Batch Operations

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:3562](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3562)

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

0.7.0

---

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/matrix3.ts:3582](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3582)

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

0.7.0

## Column/Row

### getColumn()

> **getColumn**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3309](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3309)

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

0.7.0

---

### getRow()

> **getRow**(`index`): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3361](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3361)

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

0.7.0

---

### setColumn()

> **setColumn**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:3328](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3328)

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

0.7.0

---

### setRow()

> **setRow**(`index`, `values`): `this`

Defined in: [src/core/matrix3.ts:3380](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3380)

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

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix3.ts:3614](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3614)

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

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/matrix3.ts:3755](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3755)

Tests if any element is infinite (±Infinity).

#### Returns

`boolean`

True if any element is ±Infinity.

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix3.ts:3733](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3733)

Tests if any element is NaN.

#### Returns

`boolean`

True if any element is NaN.

#### Since

0.7.0

---

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3811](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3811)

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

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix3.ts:3711](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3711)

Tests if all elements are finite.

#### Returns

`boolean`

True if all elements are finite.

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3644](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3644)

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

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3689](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3689)

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

0.7.0

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3831](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3831)

Tests if this matrix is orthogonal (M \* M^T = I).

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

0.7.0

---

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3791](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3791)

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

0.7.0

---

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3771](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3771)

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

0.7.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix3.ts:3666](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3666)

Tests if all elements are exactly zero.

#### Returns

`boolean`

True if all elements are zero.

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:3631](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3631)

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

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix3.ts:1313](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1313)

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

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1418](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1418)

Tests if any element is infinite (±Infinity).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if any element is ±Infinity.

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1392](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1392)

Tests if any element is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if any element is NaN.

#### Since

0.7.0

---

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1530](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1530)

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

0.7.0

---

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1369](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1369)

Tests if all elements are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if all elements are finite.

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1443](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1443)

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

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1471](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1471)

Tests if matrix is invertible (determinant ≠ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

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

Defined in: [src/core/matrix3.ts:1275](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1275)

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

0.7.0

---

### isOrthogonal()

> `static` **isOrthogonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1551](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1551)

Tests if a matrix is orthogonal (M \* M^T = I).

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

0.7.0

---

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1509](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1509)

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

0.7.0

---

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1488](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1488)

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

0.7.0

---

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix3.ts:1251](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1251)

Tests for exact equality with the zero matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test.

#### Returns

`boolean`

True if all elements are exactly zero.

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:1342](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1342)

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

0.7.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix3.ts:2362](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2362)

Calculates the determinant.

#### Returns

`number`

Determinant value.

#### Since

0.7.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix3.ts:2390](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2390)

Calculates the Frobenius norm.

#### Returns

`number`

Frobenius norm √(Σ|mᵢⱼ|²).

#### Since

0.7.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix3.ts:2346](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2346)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians.

#### Since

0.7.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2332](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2332)

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

0.7.0

---

### getTranslation()

> **getTranslation**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2317](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2317)

Extracts translation vector from the matrix.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector.

#### Returns

[`Vector2`](Vector2.md)

Translation as Vector2.

#### Since

0.7.0

---

### isAffine()

> **isAffine**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2426](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2426)

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

0.7.0

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix3.ts:2413](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2413)

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

0.7.0

---

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix3.ts:2378](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2378)

Calculates the trace (sum of diagonal).

#### Returns

`number`

Trace value.

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `9` = `9`

Defined in: [src/core/matrix3.ts:151](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L151)

Number of elements when serialized to an array.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix3.ts:4104](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4104)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding all 9 elements.

#### Example

```typescript
const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = matrix;
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Matrix3`

Defined in: [src/core/matrix3.ts:4088](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4088)

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

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`, `columnMajor?`): `T` \| \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:3939](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3939)

Writes the matrix to an array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

Array type (number[], Float32Array, Float64Array, etc.)

#### Parameters

##### out?

`T`

Optional output array. If not provided, returns a new number[].

##### offset?

`number` = `0`

Write offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

`T` \| \[`number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`, `number`\]

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

### toJSON()

> **toJSON**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:4044](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4044)

Converts the matrix to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Object suitable for JSON serialization.

#### Since

0.7.0

---

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:4003](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4003)

Extracts the upper-left 2×2 portion as a Matrix2.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix.

#### Returns

[`Matrix2`](Matrix2.md)

Matrix2 containing upper-left 2×2 portion.

#### Since

0.7.0

---

### toObject()

> **toObject**(): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix3.ts:4021](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4021)

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

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix3.ts:4068](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L4068)

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

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:235](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L235)

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

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Matrix3`

Defined in: [src/core/matrix3.ts:259](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L259)

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

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:535](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L535)

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

0.7.0

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `col2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:445](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L445)

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

0.7.0

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:389](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L389)

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

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:284](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L284)

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

0.7.0

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:322](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L322)

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

0.7.0

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `row2`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:476](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L476)

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

0.7.0

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:346](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L346)

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

0.7.0

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:375](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L375)

Creates a shear transformation matrix.

#### Parameters

##### shear

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Shear factors (x: horizontal, y: vertical).

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Shear matrix.

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

Defined in: [src/core/matrix3.ts:405](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L405)

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

0.7.0

---

### fromTranslation()

> `static` **fromTranslation**(`translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:308](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L308)

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

0.7.0

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:210](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L210)

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

0.7.0

---

### ortho()

> `static` **ortho**(`left`, `right`, `bottom`, `top`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:508](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L508)

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

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3865](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3865)

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

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3889](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3889)

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

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix3.ts:3903](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3903)

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

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1161](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1161)

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

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1196](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1196)

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

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1217](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1217)

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

0.7.0

## Mutator

### copy()

> **copy**(`matrix`): `this`

Defined in: [src/core/matrix3.ts:2243](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2243)

Copies from another matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Source matrix.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix3.ts:2288](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2288)

Resets to identity matrix.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### set()

> **set**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `this`

Defined in: [src/core/matrix3.ts:2211](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2211)

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

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/matrix3.ts:2266](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2266)

Sets this matrix from array values (column-major order).

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array with 9 elements.

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

Defined in: [src/core/matrix3.ts:2300](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2300)

Sets all elements to zero.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

## Numeric Transform

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:3521](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3521)

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

0.7.0

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:3538](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3538)

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

0.7.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix3.ts:2049](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2049)

Element at row 0, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m00`](../../types/interfaces/Matrix3Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix3.ts:2051](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2051)

Element at row 1, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m01`](../../types/interfaces/Matrix3Like.md#m01)

---

### m02

> **m02**: `number`

Defined in: [src/core/matrix3.ts:2053](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2053)

Element at row 2, column 0.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m02`](../../types/interfaces/Matrix3Like.md#m02)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix3.ts:2055](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2055)

Element at row 0, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m10`](../../types/interfaces/Matrix3Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix3.ts:2057](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2057)

Element at row 1, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m11`](../../types/interfaces/Matrix3Like.md#m11)

---

### m12

> **m12**: `number`

Defined in: [src/core/matrix3.ts:2059](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2059)

Element at row 2, column 1.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m12`](../../types/interfaces/Matrix3Like.md#m12)

---

### m20

> **m20**: `number`

Defined in: [src/core/matrix3.ts:2061](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2061)

Element at row 0, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m20`](../../types/interfaces/Matrix3Like.md#m20)

---

### m21

> **m21**: `number`

Defined in: [src/core/matrix3.ts:2063](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2063)

Element at row 1, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m21`](../../types/interfaces/Matrix3Like.md#m21)

---

### m22

> **m22**: `number`

Defined in: [src/core/matrix3.ts:2065](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2065)

Element at row 2, column 2.

#### Implementation of

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md).[`m22`](../../types/interfaces/Matrix3Like.md#m22)

---

### EPSILON_MATRIX

> `readonly` `static` **EPSILON_MATRIX**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:160](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L160)

Epsilon matrix (EPSILON in all elements).

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:165](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L165)

Flip horizontally (mirror across Y axis).

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:171](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L171)

Flip both axes (equivalent to ROTATE_180).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:168](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L168)

Flip vertically (mirror across X axis).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:144](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L144)

Identity matrix (no transformation).

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:157](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L157)

All-ones matrix.

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:177](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L177)

180° rotation.

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:180](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L180)

270° counter-clockwise rotation (90° clockwise).

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:174](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L174)

90° counter-clockwise rotation.

---

### SCALE_2

> `readonly` `static` **SCALE_2**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:183](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L183)

Uniform scale by 2.

---

### SCALE_HALF

> `readonly` `static` **SCALE_HALF**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:186](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L186)

Uniform scale by 0.5.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix3`\>

Defined in: [src/core/matrix3.ts:154](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L154)

Zero matrix.

---

### column0

#### Get Signature

> **get** **column0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2537](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2537)

Returns the first column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 0 as [m00, m01, m02].

---

### column1

#### Get Signature

> **get** **column1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2545](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2545)

Returns the second column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 1 as [m10, m11, m12].

---

### column2

#### Get Signature

> **get** **column2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2553](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2553)

Returns the third column as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Column 2 as [m20, m21, m22].

---

### diagonal

#### Get Signature

> **get** **diagonal**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2529](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2529)

Returns the diagonal elements as a 3-element array.

##### Returns

\[`number`, `number`, `number`\]

Diagonal array [m00, m11, m22].

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2461](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2461)

Returns a new inverted matrix without modifying this one.
Returns identity if singular.

##### Returns

`Matrix3`

Inverted matrix.

---

### negated

#### Get Signature

> **get** **negated**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2495](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2495)

Returns a new negated matrix without modifying this one.

##### Returns

`Matrix3`

Negated matrix.

---

### row0

#### Get Signature

> **get** **row0**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2561](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2561)

Returns the first row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 0 as [m00, m10, m20].

---

### row1

#### Get Signature

> **get** **row1**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2569](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2569)

Returns the second row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 1 as [m01, m11, m21].

---

### row2

#### Get Signature

> **get** **row2**(): \[`number`, `number`, `number`\]

Defined in: [src/core/matrix3.ts:2577](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2577)

Returns the third row as a tuple.

##### Returns

\[`number`, `number`, `number`\]

Row 2 as [m02, m12, m22].

---

### translation

#### Get Signature

> **get** **translation**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:2521](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2521)

Returns the translation component as a Vector2.

##### Returns

[`Vector2`](Vector2.md)

Translation vector.

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix3`

Defined in: [src/core/matrix3.ts:2442](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2442)

Returns a new transposed matrix without modifying this one.

##### Returns

`Matrix3`

Transposed matrix.

---

### upperLeft2x2

#### Get Signature

> **get** **upperLeft2x2**(): [`Matrix2`](Matrix2.md)

Defined in: [src/core/matrix3.ts:2513](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2513)

Returns the upper-left 2×2 portion as a Matrix2.

##### Returns

[`Matrix2`](Matrix2.md)

Upper-left 2x2 matrix.

## Transform

### rotateCS()

> **rotateCS**(`cos`, `sin`): `this`

Defined in: [src/core/matrix3.ts:3460](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L3460)

Applies a rotation to this matrix using precomputed cosine and sine values in place.

#### Parameters

##### cos

`number`

Cosine of the rotation angle.

##### sin

`number`

Sine of the rotation angle.

#### Returns

`this`

This for chaining.

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

### rotate()

> `static` **rotate**(`matrix`, `angle`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1939](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1939)

Applies a rotation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to rotate.

##### angle

`number`

Rotation angle in radians.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Rotated matrix.

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

Defined in: [src/core/matrix3.ts:1970](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1970)

Rotates a matrix using precomputed cosine and sine values.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to rotate.

##### cos

`number`

Cosine of the rotation angle.

##### sin

`number`

Sine of the rotation angle.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Rotated matrix.

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

### scaleBy()

> `static` **scaleBy**(`matrix`, `scaleValue`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:2017](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L2017)

Applies a scale transformation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to scale.

##### scaleValue

Scale factor (scalar or per-axis vector).

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Scaled matrix.

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

### transformPoint()

> `static` **transformPoint**(`matrix`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1793](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1793)

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

0.7.0

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix3.ts:1826](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1826)

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

0.7.0

---

### translate()

> `static` **translate**(`matrix`, `translation`, `out?`): `Matrix3`

Defined in: [src/core/matrix3.ts:1897](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix3.ts#L1897)

Applies a translation to a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

Matrix to translate.

##### translation

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Translation vector.

##### out?

`Matrix3`

Optional output matrix.

#### Returns

`Matrix3`

Translated matrix.

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
