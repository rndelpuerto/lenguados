# Function: randomComplex()

> **randomComplex**(`min`, `max`, `out`, `source`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/random.ts:610](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random.ts#L610)

Generates a random complex number with components in range [min, max).

## Parameters

### min

`number` = `0`

Minimum component value. Defaults to `0`.

### max

`number` = `1`

Maximum component value (exclusive). Defaults to `1`.

### out

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Complex`](../../core/classes/Complex.md)

The `out` complex containing the random components.

## Remarks

Both real and imaginary components are sampled independently
with a uniform distribution.

## Example

```typescript
const c = randomComplex(-1, 1); // Random complex in [-1,1) x [-1,1)
```

## Since

0.14.0
