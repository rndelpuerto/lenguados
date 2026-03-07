# Function: sqrt()

> **sqrt**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:183](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L183)

Deterministic square root using IEEE 754 exponent extraction
and Newton-Raphson iteration.

## Parameters

### x

`number`

Value to compute square root of

## Returns

`number`

Square root of x, NaN for negative values, handles Infinity correctly

## Remarks

Uses IEEE 754 exponent extraction for a good initial guess, then refines
with Newton-Raphson iterations. This achieves full double precision (~15 digits)
with deterministic cross-platform behavior.

**Algorithm**: Based on fdlibm (Sun Microsystems)

1. Extract exponent from IEEE 754 representation
2. Initial guess: 2^(exponent/2)
3. Newton-Raphson: y\_{n+1} = (y_n + x/y_n) / 2

## Example

```typescript
sqrt(4); // 2
sqrt(2); // 1.4142135623730951
sqrt(1e10); // 100000 (fixed!)
sqrt(-1); // NaN
sqrt(Infinity); // Infinity
```

## Since

0.8.0
