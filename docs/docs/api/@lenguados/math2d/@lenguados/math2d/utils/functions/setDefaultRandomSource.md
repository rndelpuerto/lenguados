# Function: setDefaultRandomSource()

> **setDefaultRandomSource**(`source`): `void`

Defined in: [src/utils/random-source.ts:353](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/random-source.ts#L353)

Sets the global default random source.

## Parameters

### source

[`RandomSource`](../interfaces/RandomSource.md)

New default random source

## Returns

`void`

## Example

```typescript
setDefaultRandomSource(new SeededRandomSource(42));
```

## Since

0.7.0
