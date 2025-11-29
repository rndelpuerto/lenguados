# Function: isSafeInteger()

> **isSafeInteger**(`value`): `boolean`

Tests if value is in safe integer range.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if safe integer

## Example

```typescript
isSafeInteger(42); // true
isSafeInteger(Number.MAX_SAFE_INTEGER); // true
isSafeInteger(Number.MAX_SAFE_INTEGER + 1); // false
isSafeInteger(3.14); // false
```

## Since

1.0.0
