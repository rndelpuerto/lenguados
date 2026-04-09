# Function: getDefaultRandomSource()

> **getDefaultRandomSource**(): [`RandomSource`](../interfaces/RandomSource.md)

Defined in: [src/utils/random-source.ts:372](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L372)

Returns the global default random source.

## Returns

[`RandomSource`](../interfaces/RandomSource.md)

Current default random source

## Example

```typescript
const rng = getDefaultRandomSource();
const value = rng.next();
```

## Since

0.7.0
