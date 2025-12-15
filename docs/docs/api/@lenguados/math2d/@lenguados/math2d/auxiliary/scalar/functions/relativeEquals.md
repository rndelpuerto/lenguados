# Function: relativeEquals()

> **relativeEquals**(`a`, `b`, `relativeEpsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:91](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/comparison.ts#L91)

Tests relative equality: |a-b| <= epsilon * max(|a|, |b|, 1).
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

## Example

```typescript
// Relative compare: allows 1% difference
relativeEquals(100, 101, 0.01);          // true
relativeEquals(1000, 1010, 0.01);        // true
relativeEquals(0.001, 0.002, 0.01);      // false (100% difference)
```

## Throws

If relativeEpsilon is negative

## Since

1.0.0
