# Interface: DeterministicOptions

Defined in: [src/deterministic/deterministic-math.ts:25](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L25)

Options for deterministic math operations.

## Since

0.1.0

## Properties

### sqrtIterations?

> `optional` **sqrtIterations**: `number`

Defined in: [src/deterministic/deterministic-math.ts:36](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L36)

Number of Newton-Raphson iterations for sqrt.

#### Default

```ts
3;
```

---

### tableSize?

> `optional` **tableSize**: `number`

Defined in: [src/deterministic/deterministic-math.ts:30](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L30)

Number of entries in lookup tables (must be power of 2).

#### Default

```ts
65536;
```
