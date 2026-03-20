# Function: isDenormal()

> **isDenormal**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:100](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/guards.ts#L100)

Tests if value is a denormal number.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if denormal

## Remarks

Denormal (or subnormal) numbers are very small numbers that
can cause performance issues on some processors. In IEEE 754
double precision, denormals are numbers with absolute value
less than 2^-1022 (approximately 2.225e-308) but not zero.

## Example

```typescript
isDenormal(1e-300); // false (normal)
isDenormal(1e-308); // true (denormal)
isDenormal(5e-324); // true (denormal, smallest positive number)
isDenormal(0); // false
```

## Since

0.7.0
