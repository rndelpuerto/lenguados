# Function: isDenormal()

> **isDenormal**(`value`): `boolean`

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
can cause performance issues on some processors.

## Example

```typescript
isDenormal(1e-308); // false (normal)
isDenormal(5e-324); // true (denormal)
isDenormal(0); // false
```

## Since

1.0.0
