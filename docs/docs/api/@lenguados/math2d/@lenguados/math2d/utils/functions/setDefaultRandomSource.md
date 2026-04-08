# Function: setDefaultRandomSource()

> **setDefaultRandomSource**(`source`): `void`

Defined in: [src/utils/random-source.ts:353](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/random-source.ts#L353)

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
