# Function: relativeEquals()

> **relativeEquals**(`a`, `b`, `relativeEpsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:95](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/comparison.ts#L95)

Tests relative equality: |a-b| <= epsilon \* max(|a|, |b|, 1).
Better for large numbers.

## Parameters

### a

`number`

First value.

### b

`number`

Second value.

### relativeEpsilon

`number` = `EPSILON`

Relative tolerance fraction.

## Returns

`boolean`

True if within the scaled tolerance.

## Example

```typescript
// Relative compare: allows 1% difference
relativeEquals(100, 101, 0.01); // true
relativeEquals(1000, 1010, 0.01); // true
relativeEquals(0.001, 0.002, 0.01); // false (100% difference)
```

## Throws

If relativeEpsilon is negative.

## Since

0.7.0
