# Function: exp()

> **exp**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:812](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L812)

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

0.7.0
