# Class: Matrix2

Column-major 2×2 matrix suitable for WebGL and physics calculations.

## Remarks

- Instance methods mutate `this` for fluent chaining.
- Static helpers are pure and provide optional `out` parameters to eliminate allocations.
- Trigonometric operations rely on [DeterministicMath](../../@lenguados/math2d/deterministic/classes/DeterministicMath.md).

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md)

## Constructors

### Constructor

> **new Matrix2**(`m00`, `m01`, `m10`, `m11`): `Matrix2`

Creates a new 2x2 matrix.

#### Parameters

##### m00

`number` = `1`

Column 0, Row 0 (default: 1)

##### m01

`number` = `0`

Column 0, Row 1 (default: 0)

##### m10

`number` = `0`

Column 1, Row 0 (default: 0)

##### m11

`number` = `1`

Column 1, Row 1 (default: 1)

#### Returns

`Matrix2`

## Properties

### m00

> **m00**: `number`

Column 0, Row 0 (typically cosine for rotation, x-scale for scale).

#### Implementation of

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md).[`m00`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md#m00)

---

### m01

> **m01**: `number`

Column 0, Row 1 (typically sine for rotation, y-shear for shear).

#### Implementation of

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md).[`m01`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md#m01)

---

### m10

> **m10**: `number`

Column 1, Row 0 (typically -sine for rotation, x-shear for shear).

#### Implementation of

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md).[`m10`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md#m10)

---

### m11

> **m11**: `number`

Column 1, Row 1 (typically cosine for rotation, y-scale for scale).

#### Implementation of

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md).[`m11`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md#m11)

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix2`\>

Flip horizontally (mirror across Y axis).

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix2`\>

Flip both axes (same as ROTATE_180).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix2`\>

Flip vertically (mirror across X axis).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix2`\>

Identity matrix (no transformation).

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix2`\>

180° rotation (same as FLIP_XY).

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix2`\>

270° counter-clockwise rotation (same as 90° clockwise).

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix2`\>

90° counter-clockwise rotation.

---

### SCALE_2

> `readonly` `static` **SCALE_2**: `Readonly`\<`Matrix2`\>

Uniform scale by 2.

---

### SCALE_HALF

> `readonly` `static` **SCALE_HALF**: `Readonly`\<`Matrix2`\>

Uniform scale by 0.5.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix2`\>

Zero matrix.

## Accessors

### column0

#### Get Signature

> **get** **column0**(): [`Vector2`](Vector2.md)

Returns the first column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First column vector

---

### column1

#### Get Signature

> **get** **column1**(): [`Vector2`](Vector2.md)

Returns the second column as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second column vector

---

### diagonal

#### Get Signature

> **get** **diagonal**(): [`Vector2`](Vector2.md)

Returns the diagonal elements as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Diagonal vector (m00, m11)

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix2`

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

Returns the first row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

First row vector

---

### row1

#### Get Signature

> **get** **row1**(): [`Vector2`](Vector2.md)

Returns the second row as a new vector.

##### Returns

[`Vector2`](Vector2.md)

Second row vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix2`

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

## Methods

### add()

> **add**(`other`, `out?`): `Matrix2`

Adds another matrix to this one.

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to add

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Sum matrix

---

### adjugate()

> **adjugate**(`out?`): `Matrix2`

Calculates the adjugate (adjoint) matrix.

#### Parameters

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Adjugate matrix

---

### clone()

> **clone**(): `Matrix2`

Creates a clone of this matrix.

#### Returns

`Matrix2`

New matrix with same components

---

### copy()

> **copy**(`other`): `this`

Copies components from another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to copy from

#### Returns

`this`

This matrix for chaining

---

### determinant()

> **determinant**(): `number`

Calculates the determinant of the matrix.

#### Returns

`number`

Determinant value

#### Remarks

A determinant of 0 indicates the matrix is singular (non-invertible).
The absolute value represents the area scaling factor.

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

Tests if this matrix equals another within tolerance.

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to compare

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within tolerance

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Calculates the Frobenius norm.
Uses deterministic sqrt for cross-platform reproducibility.

#### Returns

`number`

Square root of sum of squared elements

---

### getColumn()

> **getColumn**(`index`, `out?`): [`Vector2`](Vector2.md)

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

### getRotation()

> **getRotation**(): `number`

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians

#### Remarks

Assumes the matrix represents a pure rotation or rotation with uniform scale.

---

### getRow()

> **getRow**(`index`, `out?`): [`Vector2`](Vector2.md)

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

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Extracts scale factors from the matrix.
Uses deterministic sqrt for cross-platform reproducibility.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis

#### Remarks

Returns the length of each column vector.

---

### identity()

> **identity**(): `this`

Sets this matrix to identity.

#### Returns

`this`

This matrix for chaining

---

### inverse()

> **inverse**(`out?`): `Matrix2`

Inverts the matrix.

#### Parameters

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Inverted matrix

#### Throws

If matrix is singular

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Tests if this is the identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Tests if this matrix is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance for determinant (default: EPSILON)

#### Returns

`boolean`

True if determinant is non-zero

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Tests if this matrix is orthogonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if M \* M^T = I

---

### lerp()

> **lerp**(`other`, `t`, `out?`): `Matrix2`

Linear interpolation with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Target matrix

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Interpolated matrix

#### Example

```typescript
const a = Matrix2.IDENTITY;
const b = Matrix2.fromRotation(Math.PI / 2);
a.lerp(b, 0.5); // Halfway interpolation
```

---

### multiply()

> **multiply**(`other`, `out?`): `Matrix2`

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to multiply by

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Product matrix

#### Example

```typescript
const rot = Matrix2.fromRotation(Math.PI / 4);
const scale = Matrix2.fromScale(2);
const combined = rot.multiply(scale); // Rotate then scale
```

---

### multiplyScalar()

> **multiplyScalar**(`scalar`, `out?`): `Matrix2`

Alias for [scale](#scale-2). Multiplies all components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Scaled matrix

---

### negate()

> **negate**(`out?`): `Matrix2`

Negates all elements of this matrix.

#### Parameters

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Negated matrix

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
m.negate();
// m = Matrix2(-1, -2, -3, -4)
```

---

### premultiply()

> **premultiply**(`other`, `out?`): `Matrix2`

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to multiply by

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Product matrix

#### Remarks

Unlike `mul`, this applies the other transformation first.
Useful when building transformation chains in specific order.

#### Example

```typescript
const scale = Matrix2.fromScale(2);
const rot = Matrix2.fromRotation(Math.PI / 4);
const combined = scale.premultiply(rot); // rot × scale
```

---

### reset()

> **reset**(): `void`

Resets the object to its initial state.
Called when the object is returned to the pool.

#### Returns

`void`

#### Inherited from

[`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md).[`reset`](../../@lenguados/math2d/pool/interfaces/Poolable.md#reset)

---

### rotate()

> **rotate**(`angle`, `out?`): `Matrix2`

Rotates this matrix by an angle.

#### Parameters

##### angle

`number`

Angle in radians

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Rotated matrix

---

### scale()

> **scale**(`scalar`, `out?`): `Matrix2`

Scales all matrix components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Scaled matrix

---

### scaleBy()

> **scaleBy**(`scale`, `out?`): `Matrix2`

Scales this matrix.

#### Parameters

##### scale

Scale factors

`number` | `Readonly`\<[`Vector2`](Vector2.md)\>

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Scaled matrix

---

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

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

This matrix for chaining

---

### setColumn()

> **setColumn**(`index`, `column`): `this`

Sets a column of the matrix from a vector.

#### Parameters

##### index

`number`

Column index (0 or 1)

##### column

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

Sets a row of the matrix from a vector.

#### Parameters

##### index

`number`

Row index (0 or 1)

##### row

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

### subtract()

> **subtract**(`other`, `out?`): `Matrix2`

Subtracts another matrix from this one.

#### Parameters

##### other

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

Matrix to subtract

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Difference matrix

---

### toArray()

> **toArray**(`out?`, `offset?`, `columnMajor?`): `number`[]

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

---

### toFloat32Array()

> **toFloat32Array**(`out?`, `offset?`, `columnMajor?`): `Float32Array`

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

> **toJSON**(): [`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md)

Alias for toObject (JSON serialization).

#### Returns

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md)

Object with matrix components.

---

### toObject()

> **toObject**(): [`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md)

Converts to a plain object.

#### Returns

[`Matrix2Like`](../../@lenguados/math2d/types/interfaces/Matrix2Like.md)

Object with m00, m01, m10, m11 properties.

---

### toString()

> **toString**(`precision`): `string`

Converts to string representation.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

String representation

---

### trace()

> **trace**(): `number`

Calculates the trace of the matrix.

#### Returns

`number`

Sum of diagonal elements

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Transforms a vector by this matrix.

#### Parameters

##### vector

[`ReadonlyVector2`](../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

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

> **transpose**(`out?`): `Matrix2`

Transposes the matrix.

#### Parameters

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Transposed matrix

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix2`

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### b

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix2`

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### clone()

> `static` **clone**(`source`, `out?`): `Matrix2`

#### Parameters

##### source

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### compose()

> `static` **compose**(`rotation`, `scale`, `out?`): `Matrix2`

Composes a matrix from rotation angle and scale.

#### Parameters

##### rotation

`number`

Rotation angle in radians

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

Decomposes a matrix into rotation and scale components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

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

### determinant()

> `static` **determinant**(`matrix`): `number`

Calculates the determinant of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate determinant of

#### Returns

`number`

Determinant value

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two matrices are approximately equal.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within tolerance

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix2`

Creates a matrix from an array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Array with matrix elements

##### offset

`number` = `0`

Starting index (default: 0)

##### columnMajor

`boolean` = `true`

If true, array is column-major (default: true)

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Matrix

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `out?`): `Matrix2`

Creates a matrix from column vectors.

#### Parameters

##### col0

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First column

##### col1

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second column

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Matrix with specified columns

---

### fromMatrix()

> `static` **fromMatrix**(`matrix`, `out?`): `Matrix2`

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix2`

Creates a matrix from a rotation.

#### Parameters

##### rotation

Rotation object or angle in radians

`number` | `Readonly`\<[`Rotation2`](Rotation2.md)\>

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Rotation matrix

#### Example

```typescript
const mat = Matrix2.fromRotation(Math.PI / 3);
```

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `out?`): `Matrix2`

Creates a matrix from row vectors.

#### Parameters

##### row0

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First row

##### row1

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second row

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Matrix with specified rows

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix2`

Creates a scaling matrix.

#### Parameters

##### scale

Scale factors as Vector2 or uniform scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Scale matrix

#### Example

```typescript
const mat1 = Matrix2.fromScale(new Vector2(2, 3));
const mat2 = Matrix2.fromScale(2); // Uniform scale
```

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix2`

Creates a shearing matrix.

#### Parameters

##### shear

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Shear factors as Vector2 (x=horizontal, y=vertical)

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Shear matrix

#### Example

```typescript
const mat = Matrix2.fromShear(new Vector2(0.5, 0));
```

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`, `out?`): `Matrix2`

#### Parameters

##### m00

`number`

##### m01

`number`

##### m10

`number`

##### m11

`number`

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix2`

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Tests if a matrix is the identity matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix2`

Linear interpolation between two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Start matrix

##### b

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

End matrix

##### t

`number`

Interpolation factor [0, 1]

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Interpolated matrix

#### Example

```typescript
const a = Matrix2.IDENTITY;
const b = Matrix2.fromRotation(Math.PI / 2);
const mid = Matrix2.lerp(a, b, 0.5);
```

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix2`

Multiplies two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Product matrix a × b

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix2`

Negates all elements of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Matrix to negate

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Negated matrix

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const neg = Matrix2.negate(m);
// neg = Matrix2(-1, -2, -3, -4)
```

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix2`

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### scalar

`number`

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix2`

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### b

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix2`

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

##### out?

`Matrix2`

#### Returns

`Matrix2`
