# Class: TypePools

Singleton pools for core types.

## Constructors

### Constructor

> **new TypePools**(): `TypePools`

#### Returns

`TypePools`

## Accessors

### complex

#### Get Signature

> **get** `static` **complex**(): [`ObjectPool`](ObjectPool.md)\<[`Complex`](../../../../index.ts/classes/Complex.md)\>

Gets the Complex pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Complex`](../../../../index.ts/classes/Complex.md)\>

The Complex object pool

---

### interval

#### Get Signature

> **get** `static` **interval**(): [`ObjectPool`](ObjectPool.md)\<[`Interval`](../../../../index.ts/classes/Interval.md)\>

Gets the Interval pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Interval`](../../../../index.ts/classes/Interval.md)\>

The Interval object pool

---

### matrix2

#### Get Signature

> **get** `static` **matrix2**(): [`ObjectPool`](ObjectPool.md)\<[`Matrix2`](../../../../index.ts/classes/Matrix2.md)\>

Gets the Matrix2 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Matrix2`](../../../../index.ts/classes/Matrix2.md)\>

The Matrix2 object pool

---

### matrix3

#### Get Signature

> **get** `static` **matrix3**(): [`ObjectPool`](ObjectPool.md)\<[`Matrix3`](../../../../index.ts/classes/Matrix3.md)\>

Gets the Matrix3 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Matrix3`](../../../../index.ts/classes/Matrix3.md)\>

The Matrix3 object pool

---

### quaternion2

#### Get Signature

> **get** `static` **quaternion2**(): [`ObjectPool`](ObjectPool.md)\<[`Quaternion2`](../../../../index.ts/classes/Quaternion2.md)\>

Gets the Quaternion2 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Quaternion2`](../../../../index.ts/classes/Quaternion2.md)\>

The Quaternion2 object pool

---

### rotation2

#### Get Signature

> **get** `static` **rotation2**(): [`ObjectPool`](ObjectPool.md)\<[`Rotation2`](../../../../index.ts/classes/Rotation2.md)\>

Gets the Rotation2 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Rotation2`](../../../../index.ts/classes/Rotation2.md)\>

The Rotation2 object pool

---

### transform2

#### Get Signature

> **get** `static` **transform2**(): [`ObjectPool`](ObjectPool.md)\<[`Transform2`](../../../../index.ts/classes/Transform2.md)\>

Gets the Transform2 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Transform2`](../../../../index.ts/classes/Transform2.md)\>

The Transform2 object pool

---

### vector2

#### Get Signature

> **get** `static` **vector2**(): [`ObjectPool`](ObjectPool.md)\<[`Vector2`](../../../../index.ts/classes/Vector2.md)\>

Gets the Vector2 pool.

##### Returns

[`ObjectPool`](ObjectPool.md)\<[`Vector2`](../../../../index.ts/classes/Vector2.md)\>

The Vector2 object pool

## Methods

### clearAll()

> `static` **clearAll**(): `void`

Clears all pools.

#### Returns

`void`

---

### getAllStats()

> `static` **getAllStats**(): `object`

Gets statistics for all pools.

#### Returns

`object`

Object with statistics for each pool type

##### complex

> **complex**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### interval

> **interval**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### matrix2

> **matrix2**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### matrix3

> **matrix3**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### quaternion2

> **quaternion2**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### rotation2

> **rotation2**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### transform2

> **transform2**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

##### vector2

> **vector2**: [`PoolStats`](../interfaces/PoolStats.md) \| `undefined`

---

### preallocateAll()

> `static` **preallocateAll**(`sizes?`): `void`

Preallocates objects in all pools.

#### Parameters

##### sizes?

`Partial`\<`Record`\<`string`, `number`\>\>

Optional custom sizes for each pool

#### Returns

`void`

---

### trimAll()

> `static` **trimAll**(`maxAvailable`): `void`

Limits the number of available objects kept in each pool.

#### Parameters

##### maxAvailable

`number` = `0`

Maximum number of available instances per pool

#### Returns

`void`

---

### tryVector2()

> `static` **tryVector2**(): [`Vector2`](../../../../index.ts/classes/Vector2.md) \| `undefined`

Attempts to acquire a Vector2 without throwing when the pool is exhausted.

#### Returns

[`Vector2`](../../../../index.ts/classes/Vector2.md) \| `undefined`

A Vector2 instance or undefined if unavailable
