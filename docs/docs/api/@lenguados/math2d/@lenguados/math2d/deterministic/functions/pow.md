# Function: pow()

> **pow**(`base`, `exponent`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:886](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L886)

Deterministic power function.

## Parameters

### base

`number`

Base value

### exponent

`number`

Exponent value

## Returns

`number`

base^exponent

## Remarks

For integer exponents, uses exponentiation by squaring.
For non-integer exponents, uses deterministic exp(exponent \* log(base)).
Fully L0 deterministic with no Math.pow dependency.

**NaN propagation:** `pow(x, NaN)` returns NaN for all x except `pow(x, 0) = 1`
(ECMAScript §21.3.2.26). `pow(1, ±Infinity)` returns NaN.

**fdlibm edge cases:** Signed-zero handling (`pow(-0, odd)`) and negative-base
with ±Infinity exponent follow fdlibm/C99 semantics, which may differ from
ECMAScript `Math.pow` for these specific edge cases. All finite positive-base
computations are bit-identical to the fdlibm reference.

**Precision:** For fractional exponents, results may differ from `Math.pow` by
up to 1 ULP due to the `exp(exponent * log(base))` computation path.

## Example

```typescript
pow(2, 10); // 1024
pow(9, 0.5); // 3 (square root)
pow(2, -1); // 0.5
```

## Since

0.7.0
