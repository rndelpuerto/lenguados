# Function: isPositiveInfinity()

> **isPositiveInfinity**(`value`): `boolean`

Tests if value is positive infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if positive infinity

## Example

```typescript
isPositiveInfinity(Infinity); // true
isPositiveInfinity(1 / 0); // true
isPositiveInfinity(-Infinity); // false
isPositiveInfinity(42); // false
```

## Since

1.0.0
