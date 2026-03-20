# Function: nearEquals()

> **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:35](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/comparison.ts#L35)

Tests if two values are approximately equal.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if |a - b| <= epsilon

## Remarks

Default tolerance is [EPSILON](../variables/EPSILON.md) (1e-10). This is an absolute comparison —
for large magnitudes where relative error matters, use [relativeEquals](relativeEquals.md).

Note: `Math.abs(a - b)` overflows to `Infinity` when `a` and `b` have
opposite signs and large magnitudes (e.g., `1e308` and `-1e308`), but
this correctly returns `false` since `Infinity > epsilon`.

## Example

```typescript
nearEquals(1.0, 1.0000000001); // true (within default epsilon)
nearEquals(1.0, 1.01, 0.1); // true (within custom epsilon)
nearEquals(1.0, 2.0); // false
```

## Since

0.7.0
