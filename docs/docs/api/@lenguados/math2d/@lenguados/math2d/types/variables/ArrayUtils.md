# Variable: ArrayUtils

> `const` **ArrayUtils**: `object`

Array allocation utilities.

## Type Declaration

### createFloat32()

> `readonly` **createFloat32**(`size`, `fill?`): `Float32Array`

Create a Float32Array with optional initial values.

#### Parameters

##### size

`number`

Array size

##### fill?

`number`

Optional value to fill array with

#### Returns

`Float32Array`

New Float32Array

### createFloat64()

> `readonly` **createFloat64**(`size`, `fill?`): `Float64Array`

Create a Float64Array with optional initial values.

#### Parameters

##### size

`number`

Array size

##### fill?

`number`

Optional value to fill array with

#### Returns

`Float64Array`

New Float64Array

### resize()

> `readonly` **resize**\<`T`\>(`array`, `newSize`): `T`

Resize a TypedArray, preserving existing data.

#### Type Parameters

##### T

`T` _extends_ `Float64Array`\<`ArrayBufferLike`\> \| `Float32Array`\<`ArrayBufferLike`\>

#### Parameters

##### array

`T`

Array to resize

##### newSize

`number`

New size

#### Returns

`T`

New array with copied data
