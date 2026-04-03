# Function: getDefaultRandomSource()

> **getDefaultRandomSource**(): [`RandomSource`](../interfaces/RandomSource.md)

Defined in: [src/utils/random-source.ts:372](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random-source.ts#L372)

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
