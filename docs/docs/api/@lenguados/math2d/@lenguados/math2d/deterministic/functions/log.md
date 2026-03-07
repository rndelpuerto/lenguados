# Function: log()

> **log**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:755](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L755)

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

0.9.0
