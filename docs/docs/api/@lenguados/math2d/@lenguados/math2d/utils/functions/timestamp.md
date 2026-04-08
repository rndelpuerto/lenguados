# Function: timestamp()

> **timestamp**(): `number`

Defined in: [src/utils/performance.ts:56](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/performance.ts#L56)

Returns a high-resolution timestamp when available, falling back to `Date.now()`.

## Returns

`number`

Timestamp in milliseconds

## Example

```typescript
const start = timestamp();
```

## Since

0.7.0
