# Class: Vector2Batch

Batch operations for Vector2 arrays.

## Remarks

This class provides optimized batch operations on arrays of Vector2 data
using TypedArrays for better performance and cache locality. Data is stored
in Structure of Arrays (SoA) format for SIMD-friendly access patterns.

## Example

```typescript
const batch = new Vector2Batch(1000);

// Fill with initial values
batch.fill(new Vector2(1, 0));

// Rotate all vectors by 45 degrees
const rotation = Rotation2.fromAngle(Math.PI / 4);
batch.transformAll(rotation);

// Add a constant vector to all
batch.addScalar(new Vector2(10, 5));
```

## Constructors

### Constructor

> **new Vector2Batch**(`count`, `buffer?`): `Vector2Batch`

Creates a new Vector2 batch.

#### Parameters

##### count

`number`

Number of vectors to allocate (must be > 0)

##### buffer?

`SharedArrayBuffer`

Optional SharedArrayBuffer for worker-friendly storage

#### Returns

`Vector2Batch`

## Properties

### count

> `readonly` **count**: `number`

Number of vectors in the batch.

---

### x

> `readonly` **x**: `Float32Array`

X components array.

---

### y

> `readonly` **y**: `Float32Array`

Y components array.

## Methods

### add()

> **add**(`other`, `out?`): `Vector2Batch`

Adds another batch to this one element-wise.

#### Parameters

##### other

`Vector2Batch`

Batch to add

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Result batch

---

### addScalar()

> **addScalar**(`vector`, `out?`): `Vector2Batch`

Adds a constant vector to all vectors.

#### Parameters

##### vector

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Vector to add

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Result batch

---

### allEqual()

> **allEqual**(`vector`, `epsilon`): `boolean`

Tests if all vectors equal a given vector.

#### Parameters

##### vector

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Vector to compare against

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all vectors match

---

### copyFrom()

> **copyFrom**(`source`, `sourceOffset`, `targetOffset`, `length?`): `void`

Copies data from another batch.

#### Parameters

##### source

`Vector2Batch`

Source batch

##### sourceOffset

`number` = `0`

Start index in source (default: 0)

##### targetOffset

`number` = `0`

Start index in this batch (default: 0)

##### length?

`number`

Number of vectors to copy (default: all)

#### Returns

`void`

---

### dot()

> **dot**(`other`, `out?`): `Float32Array`

Computes dot products with another batch.

#### Parameters

##### other

`Vector2Batch`

Other batch

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional output array

#### Returns

`Float32Array`

Array of dot products

---

### equals()

> **equals**(`other`, `epsilon`, `out?`): `Uint8Array`

Tests element-wise equality with another batch.

#### Parameters

##### other

`Vector2Batch`

Batch to compare

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

##### out?

`Uint8Array`\<`ArrayBufferLike`\>

Optional output array

#### Returns

`Uint8Array`

Boolean array of comparison results

---

### fill()

> **fill**(`vector`): `void`

Fills all vectors with the same value.

#### Parameters

##### vector

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Vector to fill with

#### Returns

`void`

---

### get()

> **get**(`index`, `out?`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Gets a vector at the specified index.

#### Parameters

##### index

`number`

Index of the vector

##### out?

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Optional output vector

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

The vector at the index

---

### length()

> **length**(`out?`): `Float32Array`

Computes lengths of all vectors.

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional output array

#### Returns

`Float32Array`

Array of lengths

---

### lengthSq()

> **lengthSq**(`out?`): `Float32Array`

Computes squared lengths of all vectors.

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional output array

#### Returns

`Float32Array`

Array of squared lengths

---

### lerp()

> **lerp**(`other`, `t`, `out?`): `Vector2Batch`

Linear interpolation between this batch and another.

#### Parameters

##### other

`Vector2Batch`

Target batch

##### t

`number`

Interpolation factor [0, 1]

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Interpolated batch

---

### max()

> **max**(`out?`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Computes the maximum values across all vectors.

#### Parameters

##### out?

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Optional output vector

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Vector with maximum x and y values

---

### mean()

> **mean**(`out?`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Computes the mean (average) vector.

#### Parameters

##### out?

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Optional output vector

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Mean vector

---

### min()

> **min**(`out?`): [`Vector2`](../../../../index.ts/classes/Vector2.md)

Computes the minimum values across all vectors.

#### Parameters

##### out?

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Optional output vector

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)

Vector with minimum x and y values

---

### normalize()

> **normalize**(`out?`): `Vector2Batch`

Normalizes all vectors to unit length.

#### Parameters

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Normalized batch

---

### rotate()

> **rotate**(`angle`, `out?`): `Vector2Batch`

Rotates all vectors by an angle.

#### Parameters

##### angle

`number`

Rotation angle in radians

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Rotated batch

---

### scale()

> **scale**(`scalar`, `out?`): `Vector2Batch`

Multiplies all vectors by a scalar.

#### Parameters

##### scalar

`number`

Scale factor

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Result batch

---

### set()

> **set**(`index`, `vector`): `void`

Sets a vector at the specified index.

#### Parameters

##### index

`number`

Index to set

##### vector

[`ReadonlyVector2`](../../core/type-aliases/ReadonlyVector2.md)

Vector to copy from

#### Returns

`void`

---

### sub()

> **sub**(`other`, `out?`): `Vector2Batch`

Subtracts another batch from this one element-wise.

#### Parameters

##### other

`Vector2Batch`

Batch to subtract

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Result batch

---

### subarray()

> **subarray**(`start`, `count`): `Vector2Batch`

Creates a view into a subset of the batch.

#### Parameters

##### start

`number`

Start index

##### count

`number`

Number of vectors

#### Returns

`Vector2Batch`

New batch viewing the subset

#### Remarks

The returned batch shares the underlying memory.

---

### toArray()

> **toArray**(`out?`): `Float32Array`

Converts to interleaved array format.

#### Parameters

##### out?

`Float32Array`\<`ArrayBufferLike`\>

Optional output array

#### Returns

`Float32Array`

Array with format [x0, y0, x1, y1, ...]

---

### toVectors()

> **toVectors**(): [`Vector2`](../../../../index.ts/classes/Vector2.md)[]

Converts to array of Vector2 objects.

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md)[]

Array of vectors

---

### transform2x2()

> **transform2x2**(`m00`, `m01`, `m10`, `m11`, `out?`): `Vector2Batch`

Transforms all vectors by a 2x2 matrix.

#### Parameters

##### m00

`number`

Matrix element [0,0]

##### m01

`number`

Matrix element [0,1]

##### m10

`number`

Matrix element [1,0]

##### m11

`number`

Matrix element [1,1]

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Transformed batch

---

### transformByPackedTransforms()

> **transformByPackedTransforms**(`transforms`, `count?`, `out?`): `Vector2Batch`

Transforms vectors using packed transform data in the layout defined by [Transform2Batch](Transform2Batch.md).
When `out` is omitted, a new batch is returned; otherwise results are written into `out`
(which may be the same instance for in-place updates).

#### Parameters

##### transforms

`Float32Array`

Packed transform buffer

##### count?

`number`

Optional number of vectors to transform (default: batch size)

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Transformed batch

---

### transformMatrix()

> **transformMatrix**(`matrix`, `out?`): `Vector2Batch`

Transforms all vectors by a 2×2 matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2`](../../core/type-aliases/ReadonlyMatrix2.md)

Matrix to apply

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Transformed batch

---

### transformTransform()

> **transformTransform**(`transform`, `out?`): `Vector2Batch`

Applies a full Transform2 (scale → rotate → translate) to each vector.

#### Parameters

##### transform

[`ReadonlyTransform2`](../../core/type-aliases/ReadonlyTransform2.md)

Transform to apply

##### out?

`Vector2Batch`

Optional output batch

#### Returns

`Vector2Batch`

Transformed batch

---

### fromArray()

> `static` **fromArray**(`data`): `Vector2Batch`

Creates a batch from interleaved array data.

#### Parameters

##### data

`ArrayLike`\<`number`\>

Array with format [x0, y0, x1, y1, ...]

#### Returns

`Vector2Batch`

New batch

---

### fromVectors()

> `static` **fromVectors**(`vectors`): `Vector2Batch`

Creates a batch from an array of Vector2 objects.

#### Parameters

##### vectors

readonly `Readonly`\<[`Vector2`](../../../../index.ts/classes/Vector2.md)\>[]

Array of vectors

#### Returns

`Vector2Batch`

New batch containing the vectors
