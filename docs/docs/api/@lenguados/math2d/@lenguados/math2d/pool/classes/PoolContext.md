# Class: PoolContext\<T\>

Context for managing multiple pooled objects with automatic cleanup.

## Type Parameters

### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

## Constructors

### Constructor

> **new PoolContext**\<`T`\>(`pool`): `PoolContext`\<`T`\>

#### Parameters

##### pool

[`ObjectPool`](ObjectPool.md)\<`T`\>

#### Returns

`PoolContext`\<`T`\>

## Methods

### acquire()

> **acquire**(): `T`

Acquires an object from the pool.

#### Returns

`T`

Object from the pool

---

### releaseAll()

> **releaseAll**(): `void`

Releases all acquired objects back to the pool.

#### Returns

`void`
