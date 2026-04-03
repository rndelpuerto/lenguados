# Function: timestamp()

> **timestamp**(): `number`

Defined in: [src/utils/performance.ts:56](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/performance.ts#L56)

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
