# Class: Matrix2Batch

## Constructors

### Constructor

> **new Matrix2Batch**(): `Matrix2Batch`

#### Returns

`Matrix2Batch`

## Properties

### ELEMENTS_PER_MATRIX

> `readonly` `static` **ELEMENTS_PER_MATRIX**: `4` = `4`

## Methods

### extractAngles()

> `static` **extractAngles**(`matrices`, `angles`, `count?`): `void`

#### Parameters

##### matrices

`Float32Array`

##### angles

`Float32Array`

##### count?

`number`

#### Returns

`void`

---

### fromFloat32Array()

> `static` **fromFloat32Array**(`data`, `count?`): [`Matrix2`](../../../../index.ts/classes/Matrix2.md)[]

#### Parameters

##### data

`Float32Array`

##### count?

`number`

#### Returns

[`Matrix2`](../../../../index.ts/classes/Matrix2.md)[]

---

### invertInPlace()

> `static` **invertInPlace**(`matrices`, `count?`): `number`

#### Parameters

##### matrices

`Float32Array`

##### count?

`number`

#### Returns

`number`

---

### multiplyInPlace()

> `static` **multiplyInPlace**(`matrices`, `multiplier`, `count?`): `void`

#### Parameters

##### matrices

`Float32Array`

##### multiplier

[`ReadonlyMatrix2`](../../core/type-aliases/ReadonlyMatrix2.md)

##### count?

`number`

#### Returns

`void`

---

### setIdentities()

> `static` **setIdentities**(`matrices`, `count`): `void`

#### Parameters

##### matrices

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### setRotations()

> `static` **setRotations**(`matrices`, `angles`, `count`): `void`

#### Parameters

##### matrices

`Float32Array`

##### angles

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### toFloat32Array()

> `static` **toFloat32Array**(`matrices`, `out?`): `Float32Array`

#### Parameters

##### matrices

`Readonly`\<[`Matrix2`](../../../../index.ts/classes/Matrix2.md)\>[]

##### out?

`Float32Array`\<`ArrayBufferLike`\>

#### Returns

`Float32Array`

---

### transposeInPlace()

> `static` **transposeInPlace**(`matrices`, `count?`): `void`

#### Parameters

##### matrices

`Float32Array`

##### count?

`number`

#### Returns

`void`
