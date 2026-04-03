# Types Layer Verdict

Source file: `packages/math2d/src/types/index.ts`

## Summary

The types layer is complete, consistent, and correctly structured. All `*Like` interfaces follow the established Readonly/Mutable pattern. Type guards cover all structural types. Eigenvalue discriminated unions are well-designed. No issues found.

## Structural Interfaces

| Export                   | Verdict | Rationale                                                                                                                     |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ReadonlyVector2Like`    | KEEP    | Immutable `{ x, y }` duck-typing interface; used for all input params across Vector2 static methods                           |
| `Vector2Like`            | KEEP    | Mutable variant; used as the `implements` target for the Vector2 class                                                        |
| `ReadonlyMatrix2Like`    | KEEP    | Immutable `{ m00, m01, m10, m11 }` interface; column-major convention; used across Matrix2 static methods                     |
| `Matrix2Like`            | KEEP    | Mutable variant                                                                                                               |
| `ReadonlyMatrix3Like`    | KEEP    | Immutable 9-component 3×3 matrix interface; complete set                                                                      |
| `Matrix3Like`            | KEEP    | Mutable variant                                                                                                               |
| `ReadonlyRotation2Like`  | KEEP    | Immutable `{ cos, sin }` interface; clearly documents Box2D b2Rot pattern with inline property docs                           |
| `Rotation2Like`          | KEEP    | Mutable variant                                                                                                               |
| `ReadonlyComplexLike`    | KEEP    | Immutable `{ real, imag }` interface; consistent naming with mathematical convention                                          |
| `ComplexLike`            | KEEP    | Mutable variant                                                                                                               |
| `ReadonlyIntervalLike`   | KEEP    | Immutable `{ min, max }` interface                                                                                            |
| `IntervalLike`           | KEEP    | Mutable variant                                                                                                               |
| `ReadonlyTransform2Like` | KEEP    | Composite interface using `ReadonlyVector2Like` and `ReadonlyRotation2Like`; correct composition rather than flat duplication |
| `Transform2Like`         | KEEP    | Mutable variant                                                                                                               |

## Type Guards

| Export             | Verdict | Rationale                                                                                                        |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `isVector2Like`    | KEEP    | Guards `ReadonlyVector2Like`; uses internal `hasNumericProperties` helper; null check included                   |
| `isMatrix2Like`    | KEEP    | Guards 4-property matrix; correct property set                                                                   |
| `isMatrix3Like`    | KEEP    | Guards 9-property matrix; correct property set                                                                   |
| `isRotation2Like`  | KEEP    | Guards `{ cos, sin }`; used by assert.ts and exported via core classes                                           |
| `isComplexLike`    | KEEP    | Guards `{ real, imag }`                                                                                          |
| `isIntervalLike`   | KEEP    | Guards `{ min, max }`                                                                                            |
| `isTransform2Like` | KEEP    | Composite guard; correctly delegates to `isVector2Like` and `isRotation2Like` rather than flat property checking |

## Eigenvalue Types

| Export                      | Verdict | Rationale                                                                                              |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `RealEigenvalues`           | KEEP    | Discriminated union member for real eigenvalue case; `lambda1 >= lambda2` ordering documented          |
| `ComplexEigenvalues`        | KEEP    | Discriminated union member for complex conjugate case; `realPart ± imaginaryPart*i` form               |
| `EigenvalueResult`          | KEEP    | Top-level discriminated union (`type: 'real'                                                           | 'complex'`); enables exhaustive `switch` narrowing |
| `RealEigendecomposition`    | KEEP    | Extends real case with eigenvectors `v1`, `v2`; uses `ReadonlyVector2Like` for normalized eigenvectors |
| `ComplexEigendecomposition` | KEEP    | Complex case has no real eigenvectors; only eigenvalue data                                            |
| `EigendecomposeResult`      | KEEP    | Discriminated union for eigendecomposition; clean separation from `EigenvalueResult`                   |

## SinCos Types

| Export           | Verdict | Rationale                                                                                                               |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `SinCos`         | KEEP    | Mutable `{ sin, cos }` output type for `sinCos()` result and `out?` parameter; hot-path reuse pattern                   |
| `ReadonlySinCos` | KEEP    | Immutable variant for cached lookup tables; completes the Readonly/Mutable pattern established by all other value types |

## Internal Helper

| Export                                | Verdict | Rationale                                                                                               |
| ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `hasNumericProperties` (not exported) | KEEP    | Correctly private (no `export`); shared guard logic extracted to avoid duplication across 7 type guards |
