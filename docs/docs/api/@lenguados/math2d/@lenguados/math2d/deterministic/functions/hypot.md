# Function: hypot()

> **hypot**(`x`, `y`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:239](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L239)

Deterministic hypotenuse: sqrt(x² + y²) without intermediate overflow.

## Parameters

### x

`number`

First value

### y

`number`

Second value

## Returns

`number`

sqrt(x² + y²) computed safely

## Remarks

**Problem solved:** The naive formula `sqrt(x*x + y*y)` overflows to Infinity
when `x` or `y` > ~1e154, even though the result is representable.

**Algorithm:** Uses the identity `sqrt(x² + y²) = max * sqrt(1 + (min/max)²)`
which avoids intermediate overflow since `min/max` is always in `[0, 1]`.

**Performance:** ~17% faster than Math.hypot in benchmarks.

## Example

```typescript
hypot(3, 4); // 5
hypot(1e200, 1e200); // 1.414e200 (not Infinity!)
hypot(0, 5); // 5
hypot(Infinity, 5); // Infinity
```

## See

[https://www.netlib.org/fdlibm/e_hypot.c](https://www.netlib.org/fdlibm/e_hypot.c) - fdlibm hypot source

## Since

0.7.0
