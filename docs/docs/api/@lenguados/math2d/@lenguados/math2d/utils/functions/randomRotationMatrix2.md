# Function: randomRotationMatrix2()

> **randomRotationMatrix2**(`out`, `source`): [`Matrix2`](../../core/classes/Matrix2.md)

Defined in: [src/utils/random.ts:253](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random.ts#L253)

Generates a random 2x2 rotation matrix.

## Parameters

### out

[`Matrix2`](../../core/classes/Matrix2.md) = `...`

Optional output matrix to avoid allocation. Defaults to `new Matrix2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Matrix2`](../../core/classes/Matrix2.md)

The `out` matrix set to a random rotation

## Remarks

Uses a uniform angle distribution in [0, TAU).

## Example

```typescript
const m = randomRotationMatrix2();
```

## Since

0.7.0
