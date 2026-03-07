# Function: timestamp()

> **timestamp**(): `number`

Defined in: [src/utils/performance.ts:56](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/performance.ts#L56)

Returns a high-resolution timestamp when available, falling back to `Date.now()`.

## Returns

`number`

Timestamp in milliseconds.

## Example

```typescript
const start = timestamp();
```

## Since

0.7.0
