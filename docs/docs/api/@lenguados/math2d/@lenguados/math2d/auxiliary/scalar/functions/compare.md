# Function: compare()

> **compare**(`a`, `b`, `epsilon`): `-1` \| `0` \| `1`

Defined in: [src/auxiliary/scalar/comparison.ts:205](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/comparison.ts#L205)

Compares two values with tolerance.

## Parameters

### a

`number`

First value.

### b

`number`

Second value.

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

## Returns

`-1` \| `0` \| `1`

-1 if a < b (beyond epsilon), 0 if approximately equal, 1 if a > b (beyond epsilon).

## Remarks

This provides a three-way comparison suitable for sorting or ordering.
Values within epsilon of each other are considered equal (returns 0).

## Example

```typescript
compare(1.0, 2.0); // -1
compare(2.0, 1.0); // 1
compare(1.0, 1.0000000001); // 0 (within epsilon)
compare(1.0, 1.1); // -1
compare(1.0, 0.9); // 1
```

## Since

0.11.0
