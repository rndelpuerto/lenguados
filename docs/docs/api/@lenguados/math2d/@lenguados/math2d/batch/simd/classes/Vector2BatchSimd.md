# Class: Vector2BatchSimd

Dispatcher for SIMD-enabled Vector2 batch operations.

## Remarks

The dispatcher keeps the API surface minimal: registering an implementation
flips SIMD acceleration on (provided the runtime supports it) while consumers
can query availability through [Vector2BatchSimd.isEnabled](#isenabled).

## Constructors

### Constructor

> **new Vector2BatchSimd**(): `Vector2BatchSimd`

#### Returns

`Vector2BatchSimd`

## Methods

### isEnabled()

> `static` **isEnabled**(): `boolean`

Returns whether SIMD is effectively enabled (runtime support + registered implementation).

#### Returns

`boolean`

True when runtime support and an implementation are both present.

---

### register()

> `static` **register**(`implementation`): `void`

Registers a SIMD implementation.

#### Parameters

##### implementation

[`Vector2BatchSimdImplementation`](../interfaces/Vector2BatchSimdImplementation.md)

Implementation to use for SIMD paths.

#### Returns

`void`

---

### tryRotate()

> `static` **tryRotate**(`source`, `angle`, `out`): `boolean`

Attempts to run the SIMD rotation path.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### angle

`number`

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`

True when the SIMD implementation handled the request.

---

### tryTransform2x2()

> `static` **tryTransform2x2**(`source`, `m00`, `m01`, `m10`, `m11`, `out`): `boolean`

Attempts to run the SIMD 2×2 transform path.

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

True when the SIMD implementation handled the request.

---

### tryTransformByPackedTransforms()

> `static` **tryTransformByPackedTransforms**(`source`, `transforms`, `limit`, `out`): `boolean`

Attempts to run the SIMD packed transform path.

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

True when the SIMD implementation handled the request.

---

### tryTransformTransform()

> `static` **tryTransformTransform**(`source`, `transform`, `out`): `boolean`

Attempts to run the SIMD [ReadonlyTransform2](../../../core/type-aliases/ReadonlyTransform2.md) application path.

#### Parameters

##### source

[`Vector2Batch`](../../classes/Vector2Batch.md)

##### transform

[`ReadonlyTransform2`](../../../core/type-aliases/ReadonlyTransform2.md)

##### out

[`Vector2Batch`](../../classes/Vector2Batch.md)

#### Returns

`boolean`

True when the SIMD implementation handled the request.

---

### unregister()

> `static` **unregister**(): `void`

Removes the currently registered implementation.

#### Returns

`void`
