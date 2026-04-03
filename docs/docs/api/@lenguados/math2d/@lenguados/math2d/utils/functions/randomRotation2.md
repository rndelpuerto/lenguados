# Function: randomRotation2()

> **randomRotation2**(`out`, `source`): [`Rotation2`](../../core/classes/Rotation2.md)

Defined in: [src/utils/random.ts:228](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/random.ts#L228)

Generates a random 2D rotation.

## Parameters

### out

[`Rotation2`](../../core/classes/Rotation2.md) = `...`

Optional output rotation to avoid allocation. Defaults to `new Rotation2()`

### source

[`RandomSource`](../interfaces/RandomSource.md) = `...`

Random source to sample from. Defaults to `defaultRandomSource`

## Returns

[`Rotation2`](../../core/classes/Rotation2.md)

The `out` rotation set to a random angle

## Remarks

Uses a uniform angle distribution in [0, TAU).

## Example

```typescript
const r = randomRotation2();
```

## Since

0.7.0
