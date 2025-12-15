# Function: randomRotationMatrix2()

> **randomRotationMatrix2**(`out`, `source`): [`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md)

Defined in: [src/utils/random.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/random.ts#L172)

Generates a random rotation matrix (2x2).

Creates a rotation matrix with uniform distribution over all angles.

## Parameters

### out

[`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md) = `...`

Optional output matrix (default: new Matrix2)

### source

[`RandomSource`](../../random-source/interfaces/RandomSource.md) = `defaultRandomSource`

Optional random source (default: defaultRandomSource)

## Returns

[`Matrix2`](../../../../@lenguados/math2d/core/classes/Matrix2.md)

A random rotation matrix
