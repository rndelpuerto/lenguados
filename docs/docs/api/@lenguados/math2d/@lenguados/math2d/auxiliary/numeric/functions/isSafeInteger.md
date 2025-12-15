# Function: isSafeInteger()

> **isSafeInteger**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:171](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/guards.ts#L171)

Tests if value is in safe integer range.

## Parameters

### value

`number`

Value to test.

## Returns

`boolean`

True if safe integer.

## Example

```typescript
isSafeInteger(42); // true
isSafeInteger(Number.MAX_SAFE_INTEGER); // true
isSafeInteger(Number.MAX_SAFE_INTEGER + 1); // false
isSafeInteger(3.14); // false
```

## Since

1.0.0
