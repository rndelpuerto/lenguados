# Class: ObjectPool\<T\>

Generic object pool for reusing objects and reducing GC pressure.

## Remarks

Object pools help reduce garbage collection pressure by reusing objects
instead of creating new ones. This is especially beneficial for frequently
created short-lived objects like vectors in physics simulations.

## Example

```typescript
// Create a pool for Vector2 objects
const pool = new ObjectPool(() => new Vector2(), {
 initialSize: 100,
 maxSize: 1000,
});

// Get an object from the pool
const v = pool.acquire();
v.set(10, 20);

// Use the vector...

// Return it to the pool when done
pool.release(v);
```

## Type Parameters

### T

`T` _extends_ [`Poolable`](../interfaces/Poolable.md)

Type of objects in the pool

## Constructors

### Constructor

> **new ObjectPool**\<`T`\>(`factory`, `config`): `ObjectPool`\<`T`\>

Creates a new object pool.

#### Parameters

##### factory

[`PoolFactory`](../type-aliases/PoolFactory.md)\<`T`\>

Function to create new objects

##### config

[`PoolConfig`](../interfaces/PoolConfig.md) = `{}`

Pool configuration options

#### Returns

`ObjectPool`\<`T`\>

## Accessors

### availableCount

#### Get Signature

> **get** **availableCount**(): `number`

Gets the number of objects currently available in the pool.

##### Returns

`number`

Number of available objects

---

### inUseCount

#### Get Signature

> **get** **inUseCount**(): `number`

Gets the number of objects currently in use.

##### Returns

`number`

Number of objects in use

---

### totalCount

#### Get Signature

> **get** **totalCount**(): `number`

Gets the total number of objects created by the pool.

##### Returns

`number`

Total number of objects created

## Methods

### acquire()

> **acquire**(): `T`

Acquires an object from the pool.

#### Returns

`T`

An object from the pool

#### Throws

If pool is empty and autoGrow is disabled

---

### clear()

> **clear**(): `void`

Clears all available objects from the pool.

#### Returns

`void`

#### Remarks

This doesn't affect objects currently in use.

---

### getStats()

> **getStats**(): [`PoolStats`](../interfaces/PoolStats.md)

Gets statistics about pool usage.

#### Returns

[`PoolStats`](../interfaces/PoolStats.md)

Pool statistics

---

### preallocate()

> **preallocate**(`count`): `void`

Pre-allocates objects to fill the pool.

#### Parameters

##### count

`number`

Number of objects to create

#### Returns

`void`

---

### release()

> **release**(`object`): `void`

Returns an object to the pool.

#### Parameters

##### object

`T`

#### Returns

`void`

#### Remarks

The object's reset() method is called if it exists.
Objects are only kept if the pool is below maxSize.

---

### releaseMany()

> **releaseMany**(`objects`): `void`

Releases multiple objects at once.

#### Parameters

##### objects

`T`[]

Array of objects to release

#### Returns

`void`

---

### scope()

> **scope**\<`R`\>(`function_`): `R`

Creates a scoped context for working with multiple pooled objects.

#### Type Parameters

##### R

`R`

#### Parameters

##### function\_

(`context`) => `R`

#### Returns

`R`

Pool context for acquiring and auto-releasing objects

#### Example

```typescript
pool.scope((ctx) => {
 const v1 = ctx.acquire();
 const v2 = ctx.acquire();
 // Use vectors...
}); // Both vectors are automatically released
```

---

### trim()

> **trim**(`maxAvailable`): `void`

Trims the number of available objects to a maximum threshold.

#### Parameters

##### maxAvailable

`number` = `0`

Maximum number of objects to keep available (default: 0)

#### Returns

`void`

---

### tryAcquire()

> **tryAcquire**(): `T` \| `undefined`

Attempts to acquire an object without throwing when unavailable.

#### Returns

`T` \| `undefined`

An object if available; otherwise `undefined`

---

### withTemporary()

> **withTemporary**\<`R`\>(`function_`): `R`

Executes a function with a temporary object from the pool.

#### Type Parameters

##### R

`R`

#### Parameters

##### function\_

(`object`) => `R`

#### Returns

`R`

Result of the function

#### Example

```typescript
const result = pool.withTemporary((v) => {
 v.set(10, 20);
 return v.length();
});
```

---

### withTemporaryAsync()

> **withTemporaryAsync**\<`R`\>(`function_`): `Promise`\<`R`\>

Executes an async function with a temporary object from the pool.

#### Type Parameters

##### R

`R`

#### Parameters

##### function\_

(`object`) => `Promise`\<`R`\>

#### Returns

`Promise`\<`R`\>

Promise with the result
