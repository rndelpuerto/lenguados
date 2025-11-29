# Function: isInfinity()

> **isInfinity**(`value`): `boolean`

Tests if value is any infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if positive or negative infinity

## Example

```typescript
isInfinity(Infinity); // true
isInfinity(-Infinity); // true
isInfinity(42); // false
isInfinity(NaN); // false
```

## Since

1.0.0
