# Function: nearEquals()

> **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:26](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/comparison.ts#L26)

Tests if two values are approximately equal.

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

`boolean`

True if |a - b| <= epsilon.

## Example

```typescript
nearEquals(1.0, 1.0000000001); // true (within default epsilon)
nearEquals(1.0, 1.01, 0.1); // true (within custom epsilon)
nearEquals(1.0, 2.0); // false
```

## Since

1.0.0
