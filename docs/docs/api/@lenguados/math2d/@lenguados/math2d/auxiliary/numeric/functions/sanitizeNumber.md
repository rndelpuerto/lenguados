# Function: sanitizeNumber()

> **sanitizeNumber**(`value`, `fallback`, `min`, `max`): `number`

Validates and cleans numeric value.

## Parameters

### value

`number`

Value to sanitize

### fallback

`number` = `0`

Value to use if input is invalid (default: 0)

### min

`number` = `-Number.MAX_VALUE`

Minimum allowed value (default: -Number.MAX_VALUE)

### max

`number` = `Number.MAX_VALUE`

Maximum allowed value (default: Number.MAX_VALUE)

## Returns

`number`

Clean value or fallback

## Example

```typescript
sanitizeNumber(42); // 42
sanitizeNumber(NaN); // 0 (fallback)
sanitizeNumber(Infinity); // 0 (fallback)
sanitizeNumber(100, 0, 0, 50); // 50 (clamped to max)
sanitizeNumber(-10, 0, 0, 100); // 0 (clamped to min)
sanitizeNumber(NaN, -1); // -1 (custom fallback)
```

## Since

1.0.0
