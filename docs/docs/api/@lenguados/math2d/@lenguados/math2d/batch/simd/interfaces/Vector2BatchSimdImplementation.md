# Interface: Vector2BatchSimdImplementation

Contract for SIMD implementations that operate on [Vector2Batch](../../classes/Vector2Batch.md).

Implementations should return `true` when they successfully handle the request.
Returning `false` indicates the scalar fallback should be used instead.

## Methods

### rotate()?

> `optional` **rotate**(`source`, `angle`, `out`): `boolean`

SIMD-accelerated rotation.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### angle

`number`

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`

---

### transform2x2()?

> `optional` **transform2x2**(`source`, `m00`, `m01`, `m10`, `m11`, `out`): `boolean`

SIMD-accelerated 2×2 matrix transform.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### m00

`number`

##### m01

`number`

##### m10

`number`

##### m11

`number`

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`

---

### transformByPackedTransforms()?

> `optional` **transformByPackedTransforms**(`source`, `transforms`, `limit`, `out`): `boolean`

SIMD-accelerated packed transform application.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### transforms

`Float32Array`

##### limit

`number`

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`

---

### transformTransform()?

> `optional` **transformTransform**(`source`, `transform`, `out`): `boolean`

SIMD-accelerated [ReadonlyTransform2](../../../core/type-aliases/ReadonlyTransform2.md) application.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### transform

[`ReadonlyTransform2`](../../../core/type-aliases/ReadonlyTransform2.md)

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`
