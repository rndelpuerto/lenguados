# Function: isNegativeInfinity()

> **isNegativeInfinity**(`value`): `boolean`

Tests if value is negative infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if negative infinity

## Example

```typescript
isNegativeInfinity(-Infinity); // true
isNegativeInfinity(-1 / 0); // true
isNegativeInfinity(Infinity); // false
isNegativeInfinity(-42); // false
```

## Since

1.0.0
