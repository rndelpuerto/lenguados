# Class: Mat2

Defined in: [src/mat2.ts:104](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L104)

2×2 matrix class with mutable, chainable instance methods and pure static helpers.

## Remarks

- Stored in **row‑major** order fields: `m00, m01, m10, m11`.
- Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
- Default constructor builds the **identity** matrix.
- Computational methods avoid allocations unless they explicitly return new objects.

## Constructors

### Constructor

> **new Mat2**(): `Mat2`

Defined in: [src/mat2.ts:1011](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1011)

General constructor.

#### Returns

`Mat2`

#### Param

Either numbers, tuple, plain object, another matrix, or undefined.

#### Param

Second numeric parameter when using number overloads.

#### Param

Third numeric parameter when using number overloads.

#### Param

Fourth numeric parameter when using number overloads.

#### Throws

If array/object form is invalid or non‑numeric.

### Constructor

> **new Mat2**(`m00`, `m01`, `m10`, `m11`): `Mat2`

Defined in: [src/mat2.ts:1021](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1021)

General constructor.

#### Parameters

##### m00

`number`

Row 0, Col 0.

##### m01

`number`

Row 0, Col 1.

##### m10

`number`

Row 1, Col 0.

##### m11

`number`

Row 1, Col 1.

#### Returns

`Mat2`

#### Param

Either numbers, tuple, plain object, another matrix, or undefined.

#### Param

Second numeric parameter when using number overloads.

#### Param

Third numeric parameter when using number overloads.

#### Param

Fourth numeric parameter when using number overloads.

#### Throws

If array/object form is invalid or non‑numeric.

### Constructor

> **new Mat2**(`array`): `Mat2`

Defined in: [src/mat2.ts:1028](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1028)

General constructor.

#### Parameters

##### array

\[`number`, `number`, `number`, `number`\]

`[m00, m01, m10, m11]`.

#### Returns

`Mat2`

#### Param

Either numbers, tuple, plain object, another matrix, or undefined.

#### Param

Second numeric parameter when using number overloads.

#### Param

Third numeric parameter when using number overloads.

#### Param

Fourth numeric parameter when using number overloads.

#### Throws

If array/object form is invalid or non‑numeric.

### Constructor

> **new Mat2**(`object`): `Mat2`

Defined in: [src/mat2.ts:1035](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1035)

General constructor.

#### Parameters

##### object

[`Mat2Like`](../interfaces/Mat2Like.md)

Plain object with numeric components.

#### Returns

`Mat2`

#### Param

Either numbers, tuple, plain object, another matrix, or undefined.

#### Param

Second numeric parameter when using number overloads.

#### Param

Third numeric parameter when using number overloads.

#### Param

Fourth numeric parameter when using number overloads.

#### Throws

If array/object form is invalid or non‑numeric.

### Constructor

> **new Mat2**(`matrix`): `Mat2`

Defined in: [src/mat2.ts:1042](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1042)

General constructor.

#### Parameters

##### matrix

`Mat2`

Another Mat2.

#### Returns

`Mat2`

#### Param

Either numbers, tuple, plain object, another matrix, or undefined.

#### Param

Second numeric parameter when using number overloads.

#### Param

Third numeric parameter when using number overloads.

#### Param

Fourth numeric parameter when using number overloads.

#### Throws

If array/object form is invalid or non‑numeric.

## Properties

### m00

> **m00**: `number`

Defined in: [src/mat2.ts:995](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L995)

Row 0, Col 0.

***

### m01

> **m01**: `number`

Defined in: [src/mat2.ts:997](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L997)

Row 0, Col 1.

***

### m10

> **m10**: `number`

Defined in: [src/mat2.ts:999](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L999)

Row 1, Col 0.

***

### m11

> **m11**: `number`

Defined in: [src/mat2.ts:1001](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1001)

Row 1, Col 1.

***

### IDENTITY\_MATRIX

> `readonly` `static` **IDENTITY\_MATRIX**: `Readonly`\<`Mat2`\>

Defined in: [src/mat2.ts:110](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L110)

Identity matrix.

***

### ROT180\_MATRIX

> `readonly` `static` **ROT180\_MATRIX**: `Readonly`\<`Mat2`\>

Defined in: [src/mat2.ts:122](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L122)

180° rotation matrix.

***

### ROT90\_CCW\_MATRIX

> `readonly` `static` **ROT90\_CCW\_MATRIX**: `Readonly`\<`Mat2`\>

Defined in: [src/mat2.ts:116](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L116)

90° counter‑clockwise rotation matrix.

***

### ROT90\_CW\_MATRIX

> `readonly` `static` **ROT90\_CW\_MATRIX**: `Readonly`\<`Mat2`\>

Defined in: [src/mat2.ts:119](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L119)

90° clockwise rotation matrix.

***

### ZERO\_MATRIX

> `readonly` `static` **ZERO\_MATRIX**: `Readonly`\<`Mat2`\>

Defined in: [src/mat2.ts:113](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L113)

All‑zero matrix.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/mat2.ts:1858](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1858)

Enable array destructuring: `[...m] → [m00, m01, m10, m11]`.

#### Returns

`IterableIterator`\<`number`\>

An iterator over the 4 components in row‑major order.

***

### abs()

> **abs**(): `this`

Defined in: [src/mat2.ts:1322](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1322)

Component‑wise absolute value.

#### Returns

`this`

This matrix after Math.abs per component.

***

### add()

> **add**(`other`): `this`

Defined in: [src/mat2.ts:1341](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1341)

Add another matrix component‑wise.

#### Parameters

##### other

`Readonly`

The addend matrix.

#### Returns

`this`

This matrix after addition.

***

### angle()

> **angle**(): `number`

Defined in: [src/mat2.ts:1801](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1801)

Extract the (approximate) rotation angle `θ` from this matrix.

#### Returns

`number`

Angle in radians.

***

### ceil()

> **ceil**(): `this`

Defined in: [src/mat2.ts:1294](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1294)

Apply Math.ceil to each component.

#### Returns

`this`

This matrix after ceiling.

***

### clone()

> **clone**(): `Mat2`

Defined in: [src/mat2.ts:1173](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1173)

Clone this matrix.

#### Returns

`Mat2`

A new Mat2 with the same components.

***

### copy()

> **copy**(`other`): `this`

Defined in: [src/mat2.ts:1183](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1183)

Copy from another matrix.

#### Parameters

##### other

`Readonly`

Source matrix.

#### Returns

`this`

This matrix for chaining.

***

### determinant()

> **determinant**(): `number`

Defined in: [src/mat2.ts:1457](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1457)

Determinant.

#### Returns

`number`

`det(this)`.

***

### equals()

> **equals**(`other`): `boolean`

Defined in: [src/mat2.ts:1742](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1742)

Strict component‑wise equality with another matrix.

#### Parameters

##### other

`Readonly`

Matrix to compare.

#### Returns

`boolean`

`true` if all components are equal.

***

### floor()

> **floor**(): `this`

Defined in: [src/mat2.ts:1280](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1280)

Apply Math.floor to each component.

#### Returns

`this`

This matrix after flooring.

***

### getColumn()

> **getColumn**(`index`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:1238](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1238)

Get a **column** as a new [Vector2](../../vector2/classes/Vector2.md).

#### Parameters

##### index

0 or 1.

`0` | `1`

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

The requested column as a new vector.

#### Throws

If `index` is not 0 or 1.

***

### getRow()

> **getRow**(`index`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:1198](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1198)

Get a **row** as a new [Vector2](../../vector2/classes/Vector2.md).

#### Parameters

##### index

0 or 1.

`0` | `1`

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

The requested row as a new vector.

#### Throws

If `index` is not 0 or 1.

***

### hashCode()

> **hashCode**(): `number`

Defined in: [src/mat2.ts:1886](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1886)

Compute a 32‑bit unsigned hash from this matrix’s components.

#### Returns

`number`

A 32‑bit unsigned integer hash.

***

### identity()

> **identity**(): `this`

Defined in: [src/mat2.ts:1145](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1145)

Reset to the identity matrix.

#### Returns

`this`

This matrix for chaining.

***

### inverse()

> **inverse**(): `this`

Defined in: [src/mat2.ts:1476](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1476)

Invert this matrix (throws on singular).

#### Returns

`this`

This matrix after inversion.

#### Throws

If the matrix is singular.

***

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/mat2.ts:1501](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1501)

Invert this matrix **without throwing**; becomes **zero** if singular.

#### Returns

`this`

This matrix after "safe" inversion (or zero).

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/mat2.ts:1782](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1782)

Test if all components are finite.

#### Returns

`boolean`

`true` if finite.

***

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/mat2.ts:1763](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1763)

Test if this matrix is the identity within tolerance.

#### Parameters

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `this ≈ I`.

***

### isRotation()

> **isRotation**(`epsilon`): `boolean`

Defined in: [src/mat2.ts:1773](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1773)

Test if this matrix represents a rotation (orthonormal with det ≈ 1).

#### Parameters

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `this` is a rotation.

***

### isSingular()

> **isSingular**(`epsilon`): `boolean`

Defined in: [src/mat2.ts:1792](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1792)

Test if this matrix is singular (or nearly singular) with tolerance.

#### Parameters

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `|det(this)| ≤ epsilon`.

***

### multiply()

> **multiply**(`m`): `this`

Defined in: [src/mat2.ts:1389](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1389)

Multiply this matrix by another on the **right**: `this = this × m`.

#### Parameters

##### m

`Readonly`

Right operand.

#### Returns

`this`

This matrix after multiplication.

#### Remarks

Mirrors three.js semantics (`multiply` vs `premultiply`).

***

### multiplyComponents()

> **multiplyComponents**(`other`): `this`

Defined in: [src/mat2.ts:1371](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1371)

Component‑wise (Hadamard) product with another matrix.

#### Parameters

##### other

`Readonly`

The other matrix.

#### Returns

`this`

This matrix after Hadamard multiplication.

***

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/mat2.ts:1429](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1429)

Multiply all components by a scalar.

#### Parameters

##### scalar

`number`

Scale factor.

#### Returns

`this`

This matrix for chaining.

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/mat2.ts:1753](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1753)

Approximate component‑wise equality within tolerance.

#### Parameters

##### other

`Readonly`

Matrix to compare.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `|aᵢⱼ − bᵢⱼ| ≤ epsilon` for all components.

***

### orthonormalize()

> **orthonormalize**(): `this`

Defined in: [src/mat2.ts:1690](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1690)

Orthonormalize columns (Gram–Schmidt) to correct small numeric drift
towards the nearest rotation matrix.

#### Returns

`this`

This matrix after orthonormalization.

#### Remarks

If the first column degenerates, resets to identity. If the second column
collapses during orthogonalization, it is rebuilt as the perpendicular.

***

### premultiply()

> **premultiply**(`m`): `this`

Defined in: [src/mat2.ts:1409](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1409)

Multiply this matrix by another on the **left**: `this = m × this`.

#### Parameters

##### m

`Readonly`

Left operand.

#### Returns

`this`

This matrix after pre‑multiplication.

***

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/mat2.ts:1579](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1579)

Post‑multiply by a rotation **in‑place**: `this = this × R(θ)`.

#### Parameters

##### angle

`number`

Angle in radians.

#### Returns

`this`

This matrix after composition.

***

### rotateCS()

> **rotateCS**(`cosAngle`, `sinAngle`): `this`

Defined in: [src/mat2.ts:1603](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1603)

Post‑multiply by a rotation using **cos/sin**, **in‑place**: `this = this × R(c,s)`.

#### Parameters

##### cosAngle

`number`

`cos(θ)`.

##### sinAngle

`number`

`sin(θ)`.

#### Returns

`this`

This matrix after composition.

***

### round()

> **round**(): `this`

Defined in: [src/mat2.ts:1308](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1308)

Apply Math.round to each component.

#### Returns

`this`

This matrix after rounding.

***

### scale()

> **scale**(`sx`, `sy`): `this`

Defined in: [src/mat2.ts:1624](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1624)

Post‑multiply by a scaling **in‑place**: `this = this × S(sx, sy)`.

#### Parameters

##### sx

`number`

Scale X.

##### sy

`number`

Scale Y.

#### Returns

`this`

This matrix after composition.

***

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

Defined in: [src/mat2.ts:1131](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1131)

Set all components.

#### Parameters

##### m00

`number`

Row 0, Col 0.

##### m01

`number`

Row 0, Col 1.

##### m10

`number`

Row 1, Col 0.

##### m11

`number`

Row 1, Col 1.

#### Returns

`this`

This matrix for chaining.

***

### setColumn()

> **setColumn**(`index`, `column`): `this`

Defined in: [src/mat2.ts:1253](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1253)

Set a **column** from a vector.

#### Parameters

##### index

0 or 1.

`0` | `1`

##### column

`Readonly`

Source column vector.

#### Returns

`this`

This matrix for chaining.

#### Throws

If `index` is not 0 or 1.

***

### setRotation()

> **setRotation**(`angle`): `this`

Defined in: [src/mat2.ts:1533](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1533)

Set this matrix to a **pure rotation** by angle (radians).

#### Parameters

##### angle

`number`

Angle in radians.

#### Returns

`this`

This matrix, now a rotation.

***

### setRotationCS()

> **setRotationCS**(`cosAngle`, `sinAngle`): `this`

Defined in: [src/mat2.ts:1547](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1547)

Set this matrix to a rotation using **precomputed** cosine and sine.

#### Parameters

##### cosAngle

`number`

`cos(θ)`.

##### sinAngle

`number`

`sin(θ)`.

#### Returns

`this`

This matrix for chaining.

***

### setRow()

> **setRow**(`index`, `row`): `this`

Defined in: [src/mat2.ts:1213](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1213)

Set a **row** from a vector.

#### Parameters

##### index

0 or 1.

`0` | `1`

##### row

`Readonly`

Source row vector.

#### Returns

`this`

This matrix for chaining.

#### Throws

If `index` is not 0 or 1.

***

### setScaling()

> **setScaling**(`sx`, `sy`): `this`

Defined in: [src/mat2.ts:1558](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1558)

Set this matrix to a **scaling** transform.

#### Parameters

##### sx

`number`

Scale X.

##### sy

`number`

Scale Y.

#### Returns

`this`

This matrix for chaining.

***

### setShear()

> **setShear**(`shx`, `shy`): `this`

Defined in: [src/mat2.ts:1569](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1569)

Set this matrix to a **shear** transform.

#### Parameters

##### shx

`number`

Horizontal shear.

##### shy

`number`

Vertical shear.

#### Returns

`this`

This matrix for chaining.

***

### shear()

> **shear**(`shx`, `shy`): `this`

Defined in: [src/mat2.ts:1640](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1640)

Post‑multiply by a shear **in‑place**: `this = this × H(shx, shy)`.

#### Parameters

##### shx

`number`

Horizontal shear.

##### shy

`number`

Vertical shear.

#### Returns

`this`

This matrix after composition.

***

### sub()

> **sub**(`other`): `this`

Defined in: [src/mat2.ts:1356](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1356)

Subtract another matrix component‑wise.

#### Parameters

##### other

`Readonly`

The subtrahend matrix.

#### Returns

`this`

This matrix after subtraction.

***

### toArray()

> **toArray**\<`T`\>(`outArray`, `offset`): `T`

Defined in: [src/mat2.ts:1841](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1841)

Write this matrix into an array (row‑major).

#### Type Parameters

##### T

`T` *extends* `number`[] \| `Float32Array`\<`ArrayBufferLike`\>

#### Parameters

##### outArray

`T` = `...`

Destination array (defaults to a new `number[]`).
                  You may pass a `Float32Array` or any `ArrayLike<number>`.

##### offset

`number` = `0`

Index at which to write `m00..m11` (default `0`).

#### Returns

`T`

The same `outArray` reference.

#### Example

```ts
const buf = new Float32Array(4);
m.toArray(buf); // writes [m00,m01,m10,m11]
```

***

### toJSON()

> **toJSON**(): [`Mat2Like`](../interfaces/Mat2Like.md)

Defined in: [src/mat2.ts:1814](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1814)

Return a plain object for JSON serialization.

#### Returns

[`Mat2Like`](../interfaces/Mat2Like.md)

An object `{ m00, m01, m10, m11 }`.

***

### toObject()

> **toObject**(): [`Mat2Like`](../interfaces/Mat2Like.md)

Defined in: [src/mat2.ts:1823](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1823)

Alias for `toJSON()` to convey explicit "plain object" semantics.

#### Returns

[`Mat2Like`](../interfaces/Mat2Like.md)

An object `{ m00, m01, m10, m11 }`.

***

### toString()

> **toString**(`precision?`): `string`

Defined in: [src/mat2.ts:1871](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1871)

Return a string representation `"m00,m01,m10,m11"`.

#### Parameters

##### precision?

`number`

Optional number of decimal places.

#### Returns

`string`

The formatted string.

***

### trace()

> **trace**(): `number`

Defined in: [src/mat2.ts:1466](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1466)

Trace.

#### Returns

`number`

`tr(this) = m00 + m11`.

***

### transformVector()

> **transformVector**(`v`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:1665](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1665)

Transform a vector: `v' = this · v`.

#### Parameters

##### v

`Readonly`

Vector to transform.

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

A **new** transformed vector.

***

### transformVectorInto()

> **transformVectorInto**(`v`, `outVector`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:1676](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1676)

Transform a vector **alloc‑free**.

#### Parameters

##### v

`Readonly`

Vector to transform.

##### outVector

[`Vector2`](../../vector2/classes/Vector2.md)

Destination vector.

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

`outVector`.

***

### transpose()

> **transpose**(): `this`

Defined in: [src/mat2.ts:1443](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1443)

Transpose this matrix in place.

#### Returns

`this`

This matrix after transposition.

***

### zero()

> **zero**(): `this`

Defined in: [src/mat2.ts:1159](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L1159)

Reset all components to zero.

#### Returns

`this`

This matrix for chaining.

***

### add()

#### Call Signature

> `static` **add**(`a`, `b`): `Mat2`

Defined in: [src/mat2.ts:438](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L438)

Matrix addition: `C = A + B`.

##### Parameters

###### a

`Readonly`

First addend.

###### b

`Readonly`

Second addend.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **add**(`a`, `b`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:448](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L448)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

First addend.

###### b

`Readonly`

Second addend.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### adjugate()

#### Call Signature

> `static` **adjugate**(`a`): `Mat2`

Defined in: [src/mat2.ts:583](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L583)

Adjugate (a.k.a. adjoint, classical adjoint).

##### Parameters

###### a

`Readonly`

Source matrix.

##### Returns

`Mat2`

A new Mat2 equal to `adj(A) = [[ m11, -m01 ], [ -m10, m00 ]]`.

#### Call Signature

> `static` **adjugate**(`a`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:592](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L592)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Source matrix.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### angleOfRotation()

> `static` **angleOfRotation**(`a`): `number`

Defined in: [src/mat2.ts:986](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L986)

Extract the (approximate) rotation angle `θ` from a rotation matrix.

#### Parameters

##### a

`Readonly`

Matrix assumed to be a (near) rotation.

#### Returns

`number`

Angle in radians such that `a ≈ R(θ)`.

#### Remarks

For a pure rotation `R = [ c −s; s c ]`, the angle is `atan2(m10, m00)`.
For non‑pure transforms, this returns the angle of the transformed X basis.

***

### clone()

> `static` **clone**(`source`): `Mat2`

Defined in: [src/mat2.ts:134](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L134)

Clone a matrix.

#### Parameters

##### source

`Readonly`

Matrix to clone.

#### Returns

`Mat2`

A new Mat2 with identical components.

***

### copy()

> `static` **copy**(`source`, `destination`): `Mat2`

Defined in: [src/mat2.ts:145](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L145)

Copy components from one matrix into another (alloc‑free).

#### Parameters

##### source

`Readonly`

The matrix to copy from.

##### destination

`Mat2`

The matrix to copy into.

#### Returns

`Mat2`

`destination`, now matching `source`.

***

### determinant()

> `static` **determinant**(`a`): `number`

Defined in: [src/mat2.ts:603](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L603)

Determinant of a 2×2 matrix.

#### Parameters

##### a

`Readonly`

Matrix.

#### Returns

`number`

`det(A) = m00·m11 − m01·m10`.

***

### equals()

> `static` **equals**(`a`, `b`): `boolean`

Defined in: [src/mat2.ts:846](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L846)

Strict component‑wise equality.

#### Parameters

##### a

`Readonly`

First matrix.

##### b

`Readonly`

Second matrix.

#### Returns

`boolean`

`true` if all components are identical.

***

### frobeniusNorm()

> `static` **frobeniusNorm**(`a`): `number`

Defined in: [src/mat2.ts:953](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L953)

Frobenius norm ‖A‖_F = sqrt(Σ aᵢⱼ²).

#### Parameters

##### a

`Readonly`

Matrix.

#### Returns

`number`

Frobenius norm (non‑negative).

***

### fromArray()

#### Call Signature

> `static` **fromArray**(`sourceArray`, `offset?`): `Mat2`

Defined in: [src/mat2.ts:313](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L313)

Create a matrix from a flat array in row‑major order.

##### Parameters

###### sourceArray

`ArrayLike`\<`number`\>

Numeric array containing at least 4 elements.

###### offset?

`number`

Index of `m00` (default = 0).

##### Returns

`Mat2`

A new Mat2.

##### Throws

If `offset` is out of range.

#### Call Signature

> `static` **fromArray**(`sourceArray`, `offset`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:324](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L324)

Alloc‑free overload.

##### Parameters

###### sourceArray

`ArrayLike`\<`number`\>

Numeric array containing at least 4 elements.

###### offset

`number`

Index of `m00` (default = 0).

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

##### Throws

If `offset` is out of range.

***

### fromColumns()

#### Call Signature

> `static` **fromColumns**(`col0`, `col1`): `Mat2`

Defined in: [src/mat2.ts:197](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L197)

Create a matrix from two **column** vectors.

##### Parameters

###### col0

`Readonly`

First column.

###### col1

`Readonly`

Second column.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **fromColumns**(`col0`, `col1`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:207](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L207)

Alloc‑free overload.

##### Parameters

###### col0

`Readonly`

First column.

###### col1

`Readonly`

Second column.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### fromObject()

#### Call Signature

> `static` **fromObject**(`object`): `Mat2`

Defined in: [src/mat2.ts:352](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L352)

Create or set a matrix from a plain object.

##### Parameters

###### object

[`Mat2Like`](../interfaces/Mat2Like.md)

Object containing numeric `m00, m01, m10, m11` properties.

##### Returns

`Mat2`

A new Mat2.

##### Throws

If any property is not a number.

#### Call Signature

> `static` **fromObject**(`object`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:362](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L362)

Alloc‑free overload.

##### Parameters

###### object

[`Mat2Like`](../interfaces/Mat2Like.md)

Object containing numeric `m00, m01, m10, m11` properties.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

##### Throws

If any property is not a number.

***

### fromRotation()

#### Call Signature

> `static` **fromRotation**(`angle`): `Mat2`

Defined in: [src/mat2.ts:224](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L224)

Create a **pure rotation** matrix from an angle in radians.

##### Parameters

###### angle

`number`

Rotation angle in radians.

##### Returns

`Mat2`

A new rotation Mat2.

#### Call Signature

> `static` **fromRotation**(`angle`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:233](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L233)

Alloc‑free overload.

##### Parameters

###### angle

`number`

Rotation angle in radians.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### fromRotationCS()

> `static` **fromRotationCS**(`cosAngle`, `sinAngle`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:250](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L250)

Create a rotation matrix from **precomputed** cosine and sine.
Useful when applying the same rotation to multiple matrices/vectors.

#### Parameters

##### cosAngle

`number`

Cosine of the angle.

##### sinAngle

`number`

Sine of the angle.

##### outMatrix

`Mat2` = `...`

Destination matrix (default new).

#### Returns

`Mat2`

`outMatrix` containing the rotation.

***

### fromRows()

#### Call Signature

> `static` **fromRows**(`row0`, `row1`): `Mat2`

Defined in: [src/mat2.ts:170](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L170)

Create a matrix from two **row** vectors.

##### Parameters

###### row0

`Readonly`

First row `[m00, m01]`.

###### row1

`Readonly`

Second row `[m10, m11]`.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **fromRows**(`row0`, `row1`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:180](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L180)

Alloc‑free overload.

##### Parameters

###### row0

`Readonly`

First row.

###### row1

`Readonly`

Second row.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### fromScaling()

#### Call Signature

> `static` **fromScaling**(`sx`, `sy`): `Mat2`

Defined in: [src/mat2.ts:266](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L266)

Create a **scaling** matrix.

##### Parameters

###### sx

`number`

X scale.

###### sy

`number`

Y scale.

##### Returns

`Mat2`

A new scaling Mat2.

#### Call Signature

> `static` **fromScaling**(`sx`, `sy`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:276](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L276)

Alloc‑free overload.

##### Parameters

###### sx

`number`

X scale.

###### sy

`number`

Y scale.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### fromShear()

#### Call Signature

> `static` **fromShear**(`shx`, `shy`): `Mat2`

Defined in: [src/mat2.ts:289](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L289)

Create a **shear** matrix (x' = x + shx·y, y' = shy·x + y).

##### Parameters

###### shx

`number`

Horizontal shear (x with respect to y).

###### shy

`number`

Vertical shear (y with respect to x).

##### Returns

`Mat2`

A new shear Mat2.

#### Call Signature

> `static` **fromShear**(`shx`, `shy`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:299](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L299)

Alloc‑free overload.

##### Parameters

###### shx

`number`

Horizontal shear.

###### shy

`number`

Vertical shear.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`): `Mat2`

Defined in: [src/mat2.ts:158](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L158)

Create a matrix from explicit components (row‑major).

#### Parameters

##### m00

`number`

Row 0, Col 0.

##### m01

`number`

Row 0, Col 1.

##### m10

`number`

Row 1, Col 0.

##### m11

`number`

Row 1, Col 1.

#### Returns

`Mat2`

A new Mat2.

***

### hashCode()

> `static` **hashCode**(`a`): `number`

Defined in: [src/mat2.ts:964](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L964)

Compute a 32‑bit unsigned hash code from the matrix components
(rounded to 1e‑6 precision to reduce float noise).

#### Parameters

##### a

`Readonly`

Matrix to hash.

#### Returns

`number`

A 32‑bit unsigned integer hash.

***

### inverse()

#### Call Signature

> `static` **inverse**(`a`): `Mat2`

Defined in: [src/mat2.ts:625](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L625)

Inverse matrix `A⁻¹` (throws on singular).

##### Parameters

###### a

`Readonly`

Matrix to invert.

##### Returns

`Mat2`

A new inverted Mat2.

##### Throws

If the matrix is singular.

#### Call Signature

> `static` **inverse**(`a`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:635](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L635)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Matrix to invert.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

##### Throws

If the matrix is singular.

***

### inverseSafe()

#### Call Signature

> `static` **inverseSafe**(`a`): `Mat2`

Defined in: [src/mat2.ts:656](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L656)

Inverse matrix **without throwing**: returns the **zero** matrix
when `det(A) == 0` to avoid NaN propagation.

##### Parameters

###### a

`Readonly`

Matrix to invert.

##### Returns

`Mat2`

A new Mat2 with `A⁻¹` or the **zero** matrix if singular.

#### Call Signature

> `static` **inverseSafe**(`a`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:665](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L665)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Matrix to invert.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### inverseTol()

> `static` **inverseTol**(`a`, `epsilon`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:687](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L687)

Inverse matrix with **tolerance**: throws if `|det(A)| ≤ epsilon`.

#### Parameters

##### a

`Readonly`

Matrix to invert.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

##### outMatrix

`Mat2` = `...`

Destination matrix (default new).

#### Returns

`Mat2`

`outMatrix` containing the inverse.

#### Throws

If the matrix is singular or nearly singular.

***

### isFinite()

> `static` **isFinite**(`a`): `boolean`

Defined in: [src/mat2.ts:878](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L878)

Test if all four components are finite numbers.

#### Parameters

##### a

`Readonly`

Matrix.

#### Returns

`boolean`

`true` if all entries are finite.

***

### isIdentity()

> `static` **isIdentity**(`a`, `epsilon`): `boolean`

Defined in: [src/mat2.ts:894](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L894)

Test if a matrix is (approximately) the identity within tolerance.

#### Parameters

##### a

`Readonly`

Matrix to test.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `a ≈ I`.

***

### isRotation()

> `static` **isRotation**(`a`, `epsilon`): `boolean`

Defined in: [src/mat2.ts:911](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L911)

Test if a matrix represents an (approximate) **rotation**:
orthonormal columns/rows with determinant ≈ 1.

#### Parameters

##### a

`Readonly`

Matrix to test.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `a` is a rotation matrix.

***

### isSingular()

> `static` **isSingular**(`a`, `epsilon`): `boolean`

Defined in: [src/mat2.ts:939](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L939)

Test if `A` is singular (or nearly singular) with tolerance.

#### Parameters

##### a

`Readonly`

Matrix to test.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `|det(A)| ≤ epsilon`.

***

### multiply()

#### Call Signature

> `static` **multiply**(`a`, `b`): `Mat2`

Defined in: [src/mat2.ts:511](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L511)

Matrix–matrix product: `C = A × B`.

##### Parameters

###### a

`Readonly`

Left operand.

###### b

`Readonly`

Right operand.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **multiply**(`a`, `b`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:521](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L521)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Left operand.

###### b

`Readonly`

Right operand.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### multiplyComponents()

#### Call Signature

> `static` **multiplyComponents**(`a`, `b`): `Mat2`

Defined in: [src/mat2.ts:484](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L484)

**Hadamard (component‑wise)** product: `C = A ⊙ B`.

##### Parameters

###### a

`Readonly`

First factor.

###### b

`Readonly`

Second factor.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **multiplyComponents**(`a`, `b`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:494](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L494)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

First factor.

###### b

`Readonly`

Second factor.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### multiplyScalar()

#### Call Signature

> `static` **multiplyScalar**(`a`, `scalar`): `Mat2`

Defined in: [src/mat2.ts:540](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L540)

Multiply all components by a scalar.

##### Parameters

###### a

`Readonly`

Source matrix.

###### scalar

`number`

Scale factor.

##### Returns

`Mat2`

A new scaled Mat2.

#### Call Signature

> `static` **multiplyScalar**(`a`, `scalar`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:550](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L550)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Source matrix.

###### scalar

`number`

Scale factor.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/mat2.ts:859](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L859)

Approximate component‑wise equality within tolerance.

#### Parameters

##### a

`Readonly`

First matrix.

##### b

`Readonly`

Second matrix.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

#### Returns

`boolean`

`true` if `|aᵢⱼ − bᵢⱼ| ≤ epsilon` for all components.

#### Throws

If `epsilon < 0`.

***

### outerProduct()

#### Call Signature

> `static` **outerProduct**(`u`, `v`): `Mat2`

Defined in: [src/mat2.ts:815](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L815)

Outer product of two vectors: `A = u · vᵀ`.

##### Parameters

###### u

`Readonly`

Left vector.

###### v

`Readonly`

Right vector.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **outerProduct**(`u`, `v`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:825](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L825)

Alloc‑free overload.

##### Parameters

###### u

`Readonly`

Left vector.

###### v

`Readonly`

Right vector.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### parse()

#### Call Signature

> `static` **parse**(`string_`): `Mat2`

Defined in: [src/mat2.ts:386](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L386)

Parse a `"m00,m01,m10,m11"` string into a matrix.

##### Parameters

###### string\_

`string`

String like `"1,0,0,1"`.

##### Returns

`Mat2`

A new Mat2.

##### Throws

If the string cannot be parsed.

#### Call Signature

> `static` **parse**(`string_`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:396](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L396)

Alloc‑free overload.

##### Parameters

###### string\_

`string`

String like `"1,0,0,1"`.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

##### Throws

If the string cannot be parsed.

***

### randomRotation()

#### Call Signature

> `static` **randomRotation**(): `Mat2`

Defined in: [src/mat2.ts:413](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L413)

Generate a random **rotation** matrix.

##### Returns

`Mat2`

A new rotation Mat2 with a random heading.

#### Call Signature

> `static` **randomRotation**(`outMatrix`): `Mat2`

Defined in: [src/mat2.ts:421](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L421)

Alloc‑free overload.

##### Parameters

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### solve()

> `static` **solve**(`a`, `b`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:711](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L711)

Solve the linear system `A · x = b` (throws on singular).

#### Parameters

##### a

`Readonly`

Coefficient matrix `A`.

##### b

`Readonly`

Column vector `b`.

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

Solution vector `x`.

#### Throws

If `A` is singular.

***

### solveSafe()

> `static` **solveSafe**(`a`, `b`, `outVector`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:733](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L733)

Solve `A · x = b` **without throwing**; returns `(0,0)` if singular.

#### Parameters

##### a

`Readonly`

Coefficient matrix.

##### b

`Readonly`

Column vector.

##### outVector

[`Vector2`](../../vector2/classes/Vector2.md) = `...`

Destination vector (default new).

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

`outVector` set to the solution or `(0,0)` if singular.

***

### solveTol()

> `static` **solveTol**(`a`, `b`, `epsilon`, `outVector`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:759](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L759)

Solve `A · x = b` with **tolerance**; throws if `|det(A)| ≤ epsilon`.

#### Parameters

##### a

`Readonly`

Coefficient matrix.

##### b

`Readonly`

Column vector.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance (default = [EPSILON](../../scalar/variables/EPSILON.md)).

##### outVector

[`Vector2`](../../vector2/classes/Vector2.md) = `...`

Destination vector (default new).

#### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

`outVector` set to the solution.

#### Throws

If the system is singular or nearly singular.

***

### sub()

#### Call Signature

> `static` **sub**(`a`, `b`): `Mat2`

Defined in: [src/mat2.ts:461](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L461)

Matrix subtraction: `C = A − B`.

##### Parameters

###### a

`Readonly`

Minuend.

###### b

`Readonly`

Subtrahend.

##### Returns

`Mat2`

A new Mat2.

#### Call Signature

> `static` **sub**(`a`, `b`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:471](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L471)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Minuend.

###### b

`Readonly`

Subtrahend.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.

***

### trace()

> `static` **trace**(`a`): `number`

Defined in: [src/mat2.ts:613](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L613)

Trace of a 2×2 matrix.

#### Parameters

##### a

`Readonly`

Matrix.

#### Returns

`number`

`tr(A) = m00 + m11`.

***

### transformVector()

#### Call Signature

> `static` **transformVector**(`a`, `v`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:788](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L788)

Transform a vector: `v' = A · v`.

##### Parameters

###### a

`Readonly`

Matrix.

###### v

`Readonly`

Vector.

##### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

A new transformed Vector2.

#### Call Signature

> `static` **transformVector**(`a`, `v`, `outVector`): [`Vector2`](../../vector2/classes/Vector2.md)

Defined in: [src/mat2.ts:798](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L798)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Matrix.

###### v

`Readonly`

Vector.

###### outVector

[`Vector2`](../../vector2/classes/Vector2.md)

Destination vector.

##### Returns

[`Vector2`](../../vector2/classes/Vector2.md)

`outVector`.

***

### transpose()

#### Call Signature

> `static` **transpose**(`a`): `Mat2`

Defined in: [src/mat2.ts:562](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L562)

Transpose: `C = Aᵀ`.

##### Parameters

###### a

`Readonly`

Source matrix.

##### Returns

`Mat2`

A new transposed Mat2.

#### Call Signature

> `static` **transpose**(`a`, `outMatrix`): `Mat2`

Defined in: [src/mat2.ts:571](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L571)

Alloc‑free overload.

##### Parameters

###### a

`Readonly`

Source matrix.

###### outMatrix

`Mat2`

Destination matrix.

##### Returns

`Mat2`

`outMatrix`.
