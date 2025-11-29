# Class: PoolManager

Global pool manager for managing multiple pools.

## Example

```typescript
// Register pools
PoolManager.register('vector2', () => new Vector2());
PoolManager.register('matrix2', () => new Matrix2());

// Use pools
const v = PoolManager.acquire('vector2');
// ... use vector ...
PoolManager.release('vector2', v);
```

## Constructors

### Constructor

> **new PoolManager**(): `PoolManager`

#### Returns

`PoolManager`

## Methods

### acquire()

> `static` **acquire**\<`T`\>(`name`): `T`

Acquires an object from a named pool.

#### Type Parameters

##### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

#### Parameters

##### name

`string`

Pool identifier

#### Returns

`T`

Object from the pool

#### Throws

If pool doesn't exist

---

### clearAll()

> `static` **clearAll**(): `void`

Clears all pools.

#### Returns

`void`

---

### getAllStats()

> `static` **getAllStats**(): `Map`\<`string`, [`PoolStats`](../interfaces/PoolStats.md)\>

Gets statistics for all pools.

#### Returns

`Map`\<`string`, [`PoolStats`](../interfaces/PoolStats.md)\>

Map of pool names to statistics

---

### getPool()

> `static` **getPool**\<`T`\>(`name`): [`ObjectPool`](ObjectPool.md)\<`T`\> \| `undefined`

Gets a pool by name.

#### Type Parameters

##### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

#### Parameters

##### name

`string`

Pool identifier

#### Returns

[`ObjectPool`](ObjectPool.md)\<`T`\> \| `undefined`

The pool, or undefined if not found

---

### register()

> `static` **register**\<`T`\>(`name`, `factory`, `config?`): `void`

Registers a new pool.

#### Type Parameters

##### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

#### Parameters

##### name

`string`

Pool identifier

##### factory

[`PoolFactory`](../type-aliases/PoolFactory.md)\<`T`\>

Factory function for creating objects

##### config?

[`PoolConfig`](../interfaces/PoolConfig.md)

Pool configuration

#### Returns

`void`

---

### release()

> `static` **release**(`name`, `object`): `void`

Releases an object to a named pool.

#### Parameters

##### name

`string`

Pool identifier

##### object

`any`

#### Returns

`void`

---

### trim()

> `static` **trim**(`name`, `maxAvailable`): `void`

Trims available instances of a named pool.

#### Parameters

##### name

`string`

Pool identifier

##### maxAvailable

`number` = `0`

Maximum number of available instances to keep

#### Returns

`void`

---

### trimAll()

> `static` **trimAll**(`maxAvailable`): `void`

Trims all registered pools to the provided availability threshold.

#### Parameters

##### maxAvailable

`number` = `0`

Maximum number of available instances to keep per pool

#### Returns

`void`

---

### tryAcquire()

> `static` **tryAcquire**\<`T`\>(`name`): `T` \| `undefined`

Attempts to acquire an object from a named pool without throwing.

#### Type Parameters

##### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

#### Parameters

##### name

`string`

Pool identifier

#### Returns

`T` \| `undefined`

Object from the pool or `undefined` if none are available
