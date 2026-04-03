# Function: pow()

> **pow**(`base`, `exponent`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:942](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L942)

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

0.8.0
