# Function: pow()

> **pow**(`base`, `exponent`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:873](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L873)

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

## Example

```typescript
pow(2, 10); // 1024
pow(9, 0.5); // 3 (square root)
pow(2, -1); // 0.5
```

## Since

0.7.0
