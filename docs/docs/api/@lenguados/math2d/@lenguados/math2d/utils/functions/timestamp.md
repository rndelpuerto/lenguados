# Function: timestamp()

> **timestamp**(): `number`

Defined in: [src/utils/performance.ts:56](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L56)

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
