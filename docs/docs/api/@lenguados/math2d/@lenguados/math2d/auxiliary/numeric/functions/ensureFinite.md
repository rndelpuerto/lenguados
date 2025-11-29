# Function: ensureFinite()

> **ensureFinite**(`value`, `fallback`): `number`

Ensures finite value, replaces NaN/Infinity.

## Parameters

### value

`number`

Value to check

### fallback

`number` = `0`

Replacement for non-finite values (default: 0)

## Returns

`number`

Finite value or fallback

## Example

```typescript
ensureFinite(42); // 42
ensureFinite(NaN); // 0
ensureFinite(Infinity); // 0
ensureFinite(-Infinity); // 0
ensureFinite(NaN, 1); // 1 (custom fallback)
```

## Since

1.0.0
