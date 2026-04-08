# Function: relativeEquals()

> **relativeEquals**(`a`, `b`, `relativeEpsilon?`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:141](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/comparison.ts#L141)

Tests combined tolerance equality: |a-b| <= epsilon \* max(|a|, |b|, 1).
Scales with magnitude for large numbers; uses absolute floor for small numbers.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### relativeEpsilon?

`number` = `EPSILON`

Tolerance fraction (scales with magnitude, floors at 1)

## Returns

`boolean`

True if within the scaled tolerance

## Remarks

Uses the combined absolute+relative tolerance pattern from Christer Ericson's
_Real-Time Collision Detection_: the `max(1, ...)` floor ensures near-zero
values are compared with threshold = `relativeEpsilon` (absolute behavior),
while large values scale proportionally (relative behavior).

Default tolerance is [EPSILON](../variables/EPSILON.md) (1e-10), scaled by max(|a|, |b|, 1).
Unlike [nearEquals](nearEquals.md) which uses pure absolute tolerance, this adapts
to magnitude — better for comparing values across different orders.

## Throws

If relativeEpsilon is negative or NaN

## Example

```typescript
// Large values: scales tolerance with magnitude
relativeEquals(100, 101, 0.01); // true (scale=101, threshold=1.01)
relativeEquals(1000, 1010, 0.01); // true (scale=1010, threshold=10.1)
// Small values: floor of 1 makes it behave as absolute comparison
relativeEquals(0.001, 0.002, 0.01); // true (scale=1, threshold=0.01, diff=0.001)
```

## Since

0.5.0
