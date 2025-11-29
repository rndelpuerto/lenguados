# Class: Transform2Batch

Batch helpers operating on packed transforms in the layout:
`[posX, posY, rotCos, rotSin, scaleX, scaleY]`.

## Constructors

### Constructor

> **new Transform2Batch**(): `Transform2Batch`

#### Returns

`Transform2Batch`

## Properties

### ELEMENTS_PER_TRANSFORM

> `readonly` `static` **ELEMENTS_PER_TRANSFORM**: `6` = `6`

---

### POS_X

> `readonly` `static` **POS_X**: `0` = `0`

---

### POS_Y

> `readonly` `static` **POS_Y**: `1` = `1`

---

### ROT_C

> `readonly` `static` **ROT_C**: `2` = `2`

---

### ROT_S

> `readonly` `static` **ROT_S**: `3` = `3`

---

### SCALE_X

> `readonly` `static` **SCALE_X**: `4` = `4`

---

### SCALE_Y

> `readonly` `static` **SCALE_Y**: `5` = `5`

## Methods

### applyParentInPlace()

> `static` **applyParentInPlace**(`transforms`, `parent`, `count?`): `void`

#### Parameters

##### transforms

`Float32Array`

##### parent

[`ReadonlyTransform2`](../../core/type-aliases/ReadonlyTransform2.md)

##### count?

`number`

#### Returns

`void`

---

### fromFloat32Array()

> `static` **fromFloat32Array**(`data`, `count?`): [`Transform2`](../../../../index.ts/classes/Transform2.md)[]

#### Parameters

##### data

`Float32Array`

##### count?

`number`

#### Returns

[`Transform2`](../../../../index.ts/classes/Transform2.md)[]

---

### setIdentities()

> `static` **setIdentities**(`transforms`, `count`): `void`

#### Parameters

##### transforms

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### setPositions()

> `static` **setPositions**(`transforms`, `positions`, `count`): `void`

#### Parameters

##### transforms

`Float32Array`

##### positions

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### setRotations()

> `static` **setRotations**(`transforms`, `angles`, `count`): `void`

#### Parameters

##### transforms

`Float32Array`

##### angles

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### setScales()

> `static` **setScales**(`transforms`, `scales`, `count`): `void`

#### Parameters

##### transforms

`Float32Array`

##### scales

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### toFloat32Array()

> `static` **toFloat32Array**(`transforms`, `out?`): `Float32Array`

#### Parameters

##### transforms

[`ReadonlyTransform2`](../../core/type-aliases/ReadonlyTransform2.md)[]

##### out?

`Float32Array`\<`ArrayBufferLike`\>

#### Returns

`Float32Array`

---

### toMatrices()

> `static` **toMatrices**(`transforms`, `matrices`, `count`): `void`

#### Parameters

##### transforms

`Float32Array`

##### matrices

`Float32Array`

##### count

`number`

#### Returns

`void`

---

### transformPoints()

> `static` **transformPoints**(`points`, `transforms`, `out`, `count`): `Float32Array`

#### Parameters

##### points

`Float32Array`

##### transforms

`Float32Array`

##### out

`Float32Array`

##### count

`number`

#### Returns

`Float32Array`
