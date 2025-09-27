# math2d/mat2

## File

src/mat2.ts

## Description

2×2 matrix implementation for the Lenguado 2‑D physics‑engine family.

## Remarks

- Storage is **row‑major** using the fields: `m00, m01, m10, m11`.
- Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
- Instance methods are **mutable** and chainable for ergonomics.
- Static helpers are **pure** and offer optional `out` parameters for **alloc‑free** workflows.
- Avoids logs in hot‑paths; offers “safe” and “tolerant” variants for numerical robustness.

## Classes

- [Mat2](classes/Mat2.md)

## Interfaces

- [Mat2Like](interfaces/Mat2Like.md)

## Type Aliases

- [ReadonlyMat2](type-aliases/ReadonlyMat2.md)

## Functions

- [freezeMat2](functions/freezeMat2.md)
- [isMat2Like](functions/isMat2Like.md)
