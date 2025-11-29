# Interface: DeterministicOptions

Options for deterministic math operations

## Properties

### fixedPointScale?

> `optional` **fixedPointScale**: `number`

Fixed-point scale factor (number of fractional bits)

#### Default

```ts
16;
```

---

### sqrtIterations?

> `optional` **sqrtIterations**: `number`

Number of Newton-Raphson iterations for sqrt

#### Default

```ts
3;
```

---

### tableSize?

> `optional` **tableSize**: `number`

Number of entries in lookup tables (must be power of 2)

#### Default

```ts
4096;
```

---

### useFixedPoint?

> `optional` **useFixedPoint**: `boolean`

Use fixed-point arithmetic for intermediate calculations

#### Default

```ts
false;
```
