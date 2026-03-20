# Function: exp()

> **exp**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:835](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L835)

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
