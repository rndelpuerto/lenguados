# Function: setDefaultRandomSource()

> **setDefaultRandomSource**(`source`): `void`

Defined in: [src/utils/random-source.ts:353](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/random-source.ts#L353)

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
