# Function: sanitizeNumber()

> **sanitizeNumber**(`value`, `fallback?`, `min?`, `max?`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:470](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/safety.ts#L470)

Validates and cleans numeric value.

## Parameters

### value

`number`

Value to sanitize

### fallback?

`number` = `0`

Value to use if input is invalid (default: 0)

### min?

`number` = `-Number.MAX_VALUE`

Minimum allowed value (default: -Number.MAX_VALUE)

### max?

`number` = `Number.MAX_VALUE`

Maximum allowed value (default: Number.MAX_VALUE)

## Returns

`number`

Clean value or fallback

## Remarks

Combines validation with clamping. Use when you need to ensure
a value is both finite and within a specific range.

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

0.7.0
