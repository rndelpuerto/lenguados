# Function: exp()

> **exp**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:861](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L861)

Deterministic exponential function using fdlibm algorithm.

## Parameters

### x

`number`

Exponent value

## Returns

`number`

e^x

## Remarks

Uses range reduction x = k\*ln(2) + r where |r| <= ln(2)/2,
then polynomial approximation for exp(r).
Completely deterministic: no Math.exp dependency.

## Example

```typescript
exp(0); // 1
exp(1); // 2.718281828...
exp(-Infinity); // 0
exp(Infinity); // Infinity
```

## Since

0.9.0
