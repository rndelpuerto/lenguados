# Class: Matrix3

Column-major 3×3 matrix storing 2D affine transforms. Instance methods mutate `this` to support
fluent APIs, while static helpers stay pure and accept optional `out` parameters for reuse.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md)

## Constructors

### Constructor

> **new Matrix3**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `Matrix3`

#### Parameters

##### m00

`number` = `1`

##### m01

`number` = `0`

##### m02

`number` = `0`

##### m10

`number` = `0`

##### m11

`number` = `1`

##### m12

`number` = `0`

##### m20

`number` = `0`

##### m21

`number` = `0`

##### m22

`number` = `1`

#### Returns

`Matrix3`

## Batch Operations

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Transforms multiple points efficiently (batch operation).

#### Parameters

##### points

readonly [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)[]

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

0.9.0

---

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Transforms multiple vectors efficiently (batch operation).

#### Parameters

##### vectors

readonly [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)[]

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

0.9.0

## Other

### m00

> **m00**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m00`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m00)

---

### m01

> **m01**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m01`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m01)

---

### m02

> **m02**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m02`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m02)

---

### m10

> **m10**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m10`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m10)

---

### m11

> **m11**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m11`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m11)

---

### m12

> **m12**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m12`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m12)

---

### m20

> **m20**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m20`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m20)

---

### m21

> **m21**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m21`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m21)

---

### m22

> **m22**: `number`

#### Implementation of

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md).[`m22`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md#m22)

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix3`\>

Flip horizontally (mirror across Y axis).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix3`\>

Flip vertically (mirror across X axis).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix3`\>

Identity matrix (no transformation).

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix3`\>

180° rotation.

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix3`\>

270° counter-clockwise rotation (90° clockwise).

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix3`\>

90° counter-clockwise rotation.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix3`\>

Zero matrix.

---

### diagonal

#### Get Signature

> **get** **diagonal**(): \[`number`, `number`, `number`\]

Returns the diagonal elements as a 3-element array.

##### Returns

\[`number`, `number`, `number`\]

Diagonal array [m00, m11, m22]

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix3`

Returns a new inverted matrix without modifying this one.
Returns identity if singular.

##### Returns

`Matrix3`

Inverted matrix

---

### negated

#### Get Signature

> **get** **negated**(): `Matrix3`

Returns a new negated matrix without modifying this one.

##### Returns

`Matrix3`

Negated matrix

---

### translation

#### Get Signature

> **get** **translation**(): [`Vector2`](Vector2.md)

Returns the translation component as a Vector2.

##### Returns

[`Vector2`](Vector2.md)

Translation vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix3`

Returns a new transposed matrix without modifying this one.

##### Returns

`Matrix3`

Transposed matrix

---

### upperLeft2x2

#### Get Signature

> **get** **upperLeft2x2**(): [`Matrix2`](Matrix2.md)

Returns the upper-left 2×2 portion as a Matrix2.

##### Returns

[`Matrix2`](Matrix2.md)

Upper-left 2x2 matrix

---

### add()

> **add**(`other`, `out?`): `Matrix3`

Adds another matrix to this one.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to add

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Sum matrix

---

### clone()

> **clone**(): `Matrix3`

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

---

### copy()

> **copy**(`matrix`): `this`

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

#### Returns

`this`

---

### determinant()

> **determinant**(): `number`

#### Returns

`number`

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### getColumn()

> **getColumn**(`index`): \[`number`, `number`, `number`\]

Gets a column of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Column index (0, 1, or 2)

#### Returns

\[`number`, `number`, `number`\]

Column as [row0, row1, row2]

---

### getRotation()

> **getRotation**(): `number`

#### Returns

`number`

---

### getRow()

> **getRow**(`index`): \[`number`, `number`, `number`\]

Gets a row of the matrix as a 3-element array.

#### Parameters

##### index

`number`

Row index (0, 1, or 2)

#### Returns

\[`number`, `number`, `number`\]

Row as [col0, col1, col2]

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

---

### getTranslation()

> **getTranslation**(`out?`): [`Vector2`](Vector2.md)

#### Parameters

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### identity()

> **identity**(): `this`

#### Returns

`this`

---

### inverse()

> **inverse**(`out?`): `Matrix3`

#### Parameters

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### isAffine()

> **isAffine**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### lerp()

> **lerp**(`other`, `t`, `out?`): `Matrix3`

Linear interpolation with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Target matrix

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Interpolated matrix

---

### multiply()

> **multiply**(`other`, `out?`): `Matrix3`

Multiplies this matrix by another.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Product matrix

---

### multiplyScalar()

> **multiplyScalar**(`scalar`, `out?`): `Matrix3`

Alias for [scale](#scale-2). Multiplies all components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Scaled matrix

---

### negate()

> **negate**(`out?`): `Matrix3`

Negates all elements of this matrix.

#### Parameters

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Negated matrix

---

### premultiply()

> **premultiply**(`other`, `out?`): `Matrix3`

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to multiply by

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Product matrix

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

> **rotate**(`angle`, `out?`): `Matrix3`

#### Parameters

##### angle

`number`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### scale()

> **scale**(`scalar`, `out?`): `Matrix3`

#### Parameters

##### scalar

`number`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### scaleBy()

> **scaleBy**(`scale`, `out?`): `Matrix3`

#### Parameters

##### scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### set()

> **set**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`): `this`

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

`this`

---

### setColumn()

> **setColumn**(`index`, `values`): `this`

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

This matrix for chaining

---

### setRow()

> **setRow**(`index`, `values`): `this`

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

This matrix for chaining

---

### subtract()

> **subtract**(`other`, `out?`): `Matrix3`

Subtracts another matrix from this one.

#### Parameters

##### other

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to subtract

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Difference matrix

---

### toArray()

> **toArray**(`out?`, `offset?`, `columnMajor?`): `number`[]

#### Parameters

##### out?

`number`[]

##### offset?

`number` = `0`

##### columnMajor?

`boolean` = `true`

#### Returns

`number`[]

---

### toFloat32Array()

> **toFloat32Array**(`out?`, `offset?`, `columnMajor?`): `Float32Array`

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

##### offset?

`number` = `0`

##### columnMajor?

`boolean` = `true`

#### Returns

`Float32Array`

---

### toJSON()

> **toJSON**(): [`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md)

Converts the matrix to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 2);
const json = JSON.stringify(m);
// '{"m00":0,"m01":1,...}'
```

---

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

#### Returns

[`Matrix2`](Matrix2.md)

---

### toObject()

> **toObject**(): [`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md)

Converts the matrix to a plain object.

#### Returns

[`Matrix3Like`](../../@lenguados/math2d/types/interfaces/Matrix3Like.md)

Object with m00, m01, m02, m10, m11, m12, m20, m21, m22 properties

#### Example

```typescript
const m = Matrix3.fromRotation(Math.PI / 2);
const obj = m.toObject();
// { m00: 0, m01: 1, m02: 0, m10: -1, m11: 0, m12: 0, m20: 0, m21: 0, m22: 1 }
```

---

### toString()

> **toString**(`precision`): `string`

Creates a human-readable string representation of the matrix.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string showing matrix layout

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

---

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### point

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### translate()

> **translate**(`translation`, `out?`): `Matrix3`

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### transpose()

> **transpose**(`out?`): `Matrix3`

#### Parameters

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix3`

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### b

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### clone()

> `static` **clone**(`source`, `out?`): `Matrix3`

#### Parameters

##### source

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### decompose()

> `static` **decompose**(`matrix`): `object`

Decomposes an affine matrix into translation, rotation, and scale.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to decompose

#### Returns

`object`

Object with translation (Vector2), rotation (radians), and scale (Vector2)

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

##### translation

> **translation**: [`Vector2`](Vector2.md)

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Calculates the determinant of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

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

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

First matrix

##### b

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Second matrix

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within tolerance

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix3`

#### Parameters

##### array

`ArrayLike`\<`number`\>

##### offset

`number` = `0`

##### columnMajor

`boolean` = `true`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix3`

#### Parameters

##### matrix

[`ReadonlyMatrix2`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix2.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromRotation()

> `static` **fromRotation**(`angle`, `out?`): `Matrix3`

#### Parameters

##### angle

`number`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix3`

#### Parameters

##### scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromTransform()

> `static` **fromTransform**(`translation`, `rotation`, `scale`, `out?`): `Matrix3`

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### rotation

`number`

##### scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromTranslation()

> `static` **fromTranslation**(`translation`, `out?`): `Matrix3`

#### Parameters

##### translation

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m02`, `m10`, `m11`, `m12`, `m20`, `m21`, `m22`, `out?`): `Matrix3`

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

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix3`

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Tests if a matrix is the identity matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix3`

Linear interpolation between two matrices.

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Start matrix

##### b

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

End matrix

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Interpolated matrix

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix3`

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### b

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix3`

Negates all elements of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

Matrix to negate

##### out?

`Matrix3`

Optional output object

#### Returns

`Matrix3`

Negated matrix

---

### ortho()

> `static` **ortho**(`left`, `right`, `bottom`, `top`, `out?`): `Matrix3`

#### Parameters

##### left

`number`

##### right

`number`

##### bottom

`number`

##### top

`number`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### scale()

> `static` **scale**(`matrix`, `scalar`, `out?`): `Matrix3`

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### scalar

`number`

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix3`

#### Parameters

##### a

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### b

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`

---

### transformPoint()

> `static` **transformPoint**(`matrix`, `point`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### point

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix3`

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix3Like.md)

##### out?

`Matrix3`

#### Returns

`Matrix3`
