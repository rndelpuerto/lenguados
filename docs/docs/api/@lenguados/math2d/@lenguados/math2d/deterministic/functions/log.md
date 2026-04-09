# Function: log()

> **log**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:743](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L743)

Deterministic natural logarithm using fdlibm algorithm.

## Parameters

### x

`number`

Value to compute logarithm of (must be positive)

## Returns

`number`

ln(x), NaN for x <= 0

## Remarks

Uses range reduction x = 2^k \* (1+f) where sqrt(2)/2 < 1+f < sqrt(2),
then polynomial approximation for log(1+f).
Completely deterministic: no Math.log dependency.

## Example

```typescript
log(1); // 0
log(Math.E); // 1
log(10); // 2.302585...
log(-1); // NaN
```

## Since

0.7.0
