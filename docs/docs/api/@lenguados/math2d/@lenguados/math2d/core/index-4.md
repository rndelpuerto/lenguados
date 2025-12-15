# @lenguados/math2d/core

## File

core/matrix3.ts

## Description

Deterministic 3×3 matrix implementation for 2D affine transformations.

## Remarks

**Mathematical Foundation**

- Represents linear transformations extended with translation via homogeneous coordinates
- Upper-left 2×2 block contains the linear part (rotation, scale, shear)
- Third column contains the translation vector
- Bottom row is [0, 0, 1] for affine transformations

**API Design**

- Instance methods mutate `this` for fluent chaining
- Static helpers are pure and provide optional `out` parameters for allocation control
- Trigonometric operations use [DeterministicMath](../deterministic/classes/DeterministicMath.md) for cross-platform reproducibility

**Matrix Layout (Column-Major)**

```
| m00  m10  m20 |   | scaleX*cos  -scaleY*sin  translateX |
| m01  m11  m21 | = | scaleX*sin   scaleY*cos  translateY |
| m02  m12  m22 |   |     0            0           1      |
```

## Core

- [Matrix3](classes/Matrix3.md)

## Helpers

- [freezeMatrix3](functions/freezeMatrix3.md)

## Other

### isMatrix3Like

Re-exports [isMatrix3Like](../types/functions/isMatrix3Like.md)

## Types

- [ReadonlyMatrix3](type-aliases/ReadonlyMatrix3.md)
