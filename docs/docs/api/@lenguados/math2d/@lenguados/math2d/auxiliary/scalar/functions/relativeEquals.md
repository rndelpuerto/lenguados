# Function: relativeEquals()

> **relativeEquals**(`a`, `b`, `relativeEpsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:129](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/comparison.ts#L129)

Tests relative equality: |a-b| <= epsilon \* max(|a|, |b|, 1).
Better for large numbers.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### relativeEpsilon

`number` = `EPSILON`

Relative tolerance fraction

## Returns

`boolean`

True if within the scaled tolerance

## Remarks

Default tolerance is [EPSILON](../variables/EPSILON.md) (1e-10), scaled by max(|a|, |b|, 1).
Unlike [nearEquals](nearEquals.md) which uses absolute tolerance, this scales with
magnitude — better for comparing values across different orders of magnitude.

## Throws

If relativeEpsilon is negative

## Example

```typescript
// Relative compare: allows 1% difference
relativeEquals(100, 101, 0.01); // true
relativeEquals(1000, 1010, 0.01); // true
relativeEquals(0.001, 0.002, 0.01); // false (100% difference)
```

## Since

0.7.0
