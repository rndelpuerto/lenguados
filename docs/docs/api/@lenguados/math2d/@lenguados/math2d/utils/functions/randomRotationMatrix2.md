# Function: randomRotationMatrix2()

> **randomRotationMatrix2**(`out`, `source`): [`Matrix2`](../../core/classes/Matrix2.md)

Defined in: [src/utils/random.ts:251](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/random.ts#L251)

Generates a random 2x2 rotation matrix.

## Parameters

### out

[`Matrix2`](../../core/classes/Matrix2.md) = `...`

Optional output matrix to avoid allocation. Defaults to `new Matrix2()`.

### source

[`RandomSource`](../interfaces/RandomSource.md) = `defaultRandomSource`

Random source to sample from. Defaults to `defaultRandomSource`.

## Returns

[`Matrix2`](../../core/classes/Matrix2.md)

The `out` matrix set to a random rotation.

## Remarks

Uses a uniform angle distribution in [0, TAU).

## Example

```typescript
const m = randomRotationMatrix2();
```

## Since

0.1.0
