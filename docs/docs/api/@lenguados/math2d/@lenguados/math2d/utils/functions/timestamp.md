# Function: timestamp()

> **timestamp**(): `number`

Defined in: [src/utils/performance.ts:56](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/performance.ts#L56)

Returns a high-resolution timestamp when available, falling back to `Date.now()`.

## Returns

`number`

Timestamp in milliseconds.

## Example

```typescript
const start = timestamp();
```

## Since

0.1.0
