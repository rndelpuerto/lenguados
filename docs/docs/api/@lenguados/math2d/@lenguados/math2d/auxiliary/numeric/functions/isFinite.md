# Function: isFinite()

> **isFinite**(`value`): `boolean`

Tests if value is finite (not NaN, ±Infinity).

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if finite number

## Example

```typescript
isFinite(42); // true
isFinite(0); // true
isFinite(NaN); // false
isFinite(Infinity); // false
isFinite(-Infinity); // false
```

## Since

1.0.0
