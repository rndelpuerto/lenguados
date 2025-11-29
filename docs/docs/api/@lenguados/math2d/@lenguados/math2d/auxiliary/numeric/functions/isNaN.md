# Function: isNaN()

> **isNaN**(`value`): `boolean`

Tests if value is NaN.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if NaN

## Example

```typescript
isNaN(NaN); // true
isNaN(0 / 0); // true
isNaN(42); // false
isNaN(Infinity); // false
```

## Since

1.0.0
