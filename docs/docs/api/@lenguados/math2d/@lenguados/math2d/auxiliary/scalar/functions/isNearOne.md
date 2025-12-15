# Function: isNearOne()

> **isNearOne**(`value`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:66](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/comparison.ts#L66)

Tests if value is near one.

## Parameters

### value

`number`

Value to test.

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

## Returns

`boolean`

True if |value - 1| <= epsilon.

## Example

```typescript
isNearOne(0.9999999999); // true (within default epsilon)
isNearOne(0.9); // false
isNearOne(1.01, 0.1); // true (within custom epsilon)
```

## Since

1.0.0
