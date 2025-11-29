# Interface: PoolConfig

Configuration options for object pools.

## Properties

### autoGrow?

> `optional` **autoGrow**: `boolean`

Whether to automatically grow the pool when empty.

#### Default

```ts
true;
```

---

### growthFactor?

> `optional` **growthFactor**: `number`

Growth factor when auto-growing (multiplied by current size).

#### Default

```ts
1.5;
```

---

### initialSize?

> `optional` **initialSize**: `number`

Initial number of objects to pre-allocate.

#### Default

```ts
10;
```

---

### maxSize?

> `optional` **maxSize**: `number`

Maximum number of objects to keep in the pool.

#### Default

```ts
100;
```
