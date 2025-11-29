# Interface: ValidationConfig

Validation configuration options.

## Properties

### checkDenormals?

> `optional` **checkDenormals**: `boolean`

Whether to check for denormal numbers.

#### Default

```ts
false;
```

---

### logger()?

> `optional` **logger**: (`message`) => `void`

Custom logger function for warnings.

#### Parameters

##### message

`string`

#### Returns

`void`

#### Default

```ts
console.warn;
```

---

### mode

> **mode**: [`ValidationMode`](../enumerations/ValidationMode.md)

Current validation mode.

---

### validateFinite?

> `optional` **validateFinite**: `boolean`

Whether to validate finite values.

#### Default

```ts
true;
```

---

### validateNaN?

> `optional` **validateNaN**: `boolean`

Whether to validate NaN values.

#### Default

```ts
true;
```

---

### validateRange?

> `optional` **validateRange**: `boolean`

Whether to validate range bounds.

#### Default

```ts
true;
```
