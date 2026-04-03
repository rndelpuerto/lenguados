# Matrix2, Matrix3 & Transform2 Verdict

Source files:

- `packages/math2d/src/core/matrix2.ts`
- `packages/math2d/src/core/matrix3.ts`
- `packages/math2d/src/core/transform2.ts`

## Summary

All three classes are architecturally sound. Matrix2 includes advanced operations (eigendecomposition, adjugate, SVD) that are justified and documented. Matrix3 has intentional loop-unrolled multiply. Transform2 correctly implements the full SRT (Scale-Rotate-Translate) pattern. No issues found.

---

## Matrix2

### Helper Functions

| Export                   | Verdict | Rationale                                     |
| ------------------------ | ------- | --------------------------------------------- |
| `freezeMatrix2`          | KEEP    | Returns `ReadonlyMatrix2` via `Object.freeze` |
| `ReadonlyMatrix2` (type) | KEEP    | `Readonly<Matrix2>` alias                     |
| `isMatrix2Like`          | KEEP    | Re-exported from types/                       |

### Static Constants

| Export          | Verdict | Rationale                                                                  |
| --------------- | ------- | -------------------------------------------------------------------------- |
| `IDENTITY`      | KEEP    | `[[1,0],[0,1]]` frozen                                                     |
| `ZERO`          | KEEP    | `[[0,0],[0,0]]` frozen                                                     |
| `ROTATE_90`     | KEEP    | 90° CCW rotation matrix; discoverability value for users exploring the API |
| `ROTATE_180`    | KEEP    | 180° rotation matrix                                                       |
| `FLIP_X`        | KEEP    | Horizontal reflection `[[-1,0],[0,1]]`; discoverability value              |
| `FLIP_Y`        | KEEP    | Vertical reflection `[[1,0],[0,-1]]`                                       |
| `ELEMENT_COUNT` | KEEP    | 4; serialization size                                                      |

### Static Factories

| Export                     | Verdict | Rationale                                       |
| -------------------------- | ------- | ----------------------------------------------- |
| `fromValues`               | KEEP    | Explicit component factory                      |
| `clone` / `copy`           | KEEP    | Standard copy operations                        |
| `fromRotation`             | KEEP    | `fromAngle` alternative; deterministic `sinCos` |
| `fromScaling`              | KEEP    | Diagonal scaling matrix                         |
| `fromCS`                   | KEEP    | From pre-computed cos/sin; avoids trig call     |
| `fromObject` / `fromArray` | KEEP    | Duck-type and array factories                   |
| `fromRotation2`            | KEEP    | From Rotation2 components directly              |

### Static Arithmetic

| Export                                         | Verdict | Rationale                                                                          |
| ---------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `multiply`                                     | KEEP    | 2×2 matrix product; four multiplications                                           |
| `add` / `subtract`                             | KEEP    | Component-wise operations                                                          |
| `multiplyScalar`                               | KEEP    | Scalar multiplication                                                              |
| `transpose`                                    | KEEP    | In-place safe (reads all before writing)                                           |
| `determinant`                                  | KEEP    | `m00*m11 - m01*m10`; exact floating-point                                          |
| `inverse` / `inverseSafe` / `inverseUnchecked` | KEEP    | Full triality; divides by determinant                                              |
| `adjugate`                                     | KEEP    | `[[m11, -m01], [-m10, m00]]`; used in inverse and mathematical completeness        |
| `frobeniusNorm`                                | KEEP    | `sqrt(sum of squares)`; used in convergence tests for iterative algorithms         |
| `isOrthogonal`                                 | KEEP    | `M·Mᵀ ≈ I`; documented purpose for validating rotation matrices after accumulation |

### Computed Properties

| Export            | Verdict | Rationale                                                                                          |
| ----------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `extractScale`    | KEEP    | Column magnitudes as scaling factors                                                               |
| `extractRotation` | KEEP    | Returns angle via `atan2` of first column                                                          |
| `eigenvalues`     | KEEP    | Discriminated union `EigenvalueResult`; handles real and complex cases                             |
| `eigendecompose`  | KEEP    | Returns `EigendecomposeResult` with eigenvectors; justified for principal axis analysis in physics |

### Vector Transform

| Export                      | Verdict | Rationale                                      |
| --------------------------- | ------- | ---------------------------------------------- |
| `transformVector`           | KEEP    | `M * v` column-major product                   |
| `transformVectorTransposed` | KEEP    | `Mᵀ * v`; avoids explicit transpose allocation |

---

## Matrix3

### Helper Functions

| Export                   | Verdict | Rationale                                     |
| ------------------------ | ------- | --------------------------------------------- |
| `freezeMatrix3`          | KEEP    | Returns `ReadonlyMatrix3` via `Object.freeze` |
| `ReadonlyMatrix3` (type) | KEEP    | `Readonly<Matrix3>` alias                     |
| `isMatrix3Like`          | KEEP    | Re-exported from types/                       |

### Static Constants

| Export          | Verdict | Rationale               |
| --------------- | ------- | ----------------------- |
| `IDENTITY`      | KEEP    | 3×3 identity; frozen    |
| `ZERO`          | KEEP    | 3×3 zero matrix; frozen |
| `ELEMENT_COUNT` | KEEP    | 9; serialization size   |

### Static Factories

| Export                     | Verdict | Rationale                                   |
| -------------------------- | ------- | ------------------------------------------- |
| `fromValues`               | KEEP    | Explicit 9-component factory                |
| `fromRotation`             | KEEP    | 2D rotation embedded in 3×3                 |
| `fromTranslation`          | KEEP    | Translation matrix                          |
| `fromScaling`              | KEEP    | Non-uniform scaling matrix                  |
| `fromSRT`                  | KEEP    | Combined Scale-Rotate-Translate in one call |
| `fromCS`                   | KEEP    | From pre-computed cos/sin                   |
| `fromArray` / `fromObject` | KEEP    | Serialization factories                     |
| `fromTransform2`           | KEEP    | Converts Transform2 to 3×3 affine matrix    |

### Static Arithmetic

| Export                                         | Verdict | Rationale                                                                                                                            |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `multiply`                                     | KEEP    | Loop-unrolled 3×3 product (9 explicit products + 9 additions); intentional V8 inlining optimization documented in architecture rules |
| `add` / `subtract`                             | KEEP    | Component-wise operations                                                                                                            |
| `multiplyScalar`                               | KEEP    | Scalar broadcast                                                                                                                     |
| `transpose`                                    | KEEP    | 3×3 transpose                                                                                                                        |
| `determinant`                                  | KEEP    | Cofactor expansion along first row                                                                                                   |
| `inverse` / `inverseSafe` / `inverseUnchecked` | KEEP    | Full triality; adjugate/det formula                                                                                                  |
| `adjugate`                                     | KEEP    | 3×3 cofactor matrix transpose; used in inverse computation                                                                           |
| `frobeniusNorm`                                | KEEP    | Convergence test utility; documented purpose                                                                                         |
| `isOrthogonal`                                 | KEEP    | Rotation validation via `M·Mᵀ ≈ I`                                                                                                   |
| `solveLinearSystem`                            | KEEP    | Ax=b via Cramer's rule; documented as linear solver for small systems (physics constraints)                                          |

### Transform Operations

| Export               | Verdict | Rationale                                                      |
| -------------------- | ------- | -------------------------------------------------------------- |
| `rotate`             | KEEP    | Appends rotation to existing matrix                            |
| `scale`              | KEEP    | Appends scaling                                                |
| `translate`          | KEEP    | Appends translation                                            |
| `transformPoint`     | KEEP    | Applies matrix to a point (w=1, includes translation)          |
| `transformVector`    | KEEP    | Applies matrix to a direction (w=0, no translation)            |
| `transformDirection` | KEEP    | Alias for `transformVector` with clarifying name               |
| `decompose`          | KEEP    | Extracts `{ translation, rotation, scale }` from affine matrix |

---

## Transform2

### Helper Functions

| Export                      | Verdict | Rationale                                        |
| --------------------------- | ------- | ------------------------------------------------ |
| `freezeTransform2`          | KEEP    | Returns `ReadonlyTransform2` via `Object.freeze` |
| `ReadonlyTransform2` (type) | KEEP    | `Readonly<Transform2>` alias                     |
| `isTransform2Like`          | KEEP    | Re-exported from types/                          |

### Static Constants

| Export          | Verdict | Rationale                                                    |
| --------------- | ------- | ------------------------------------------------------------ |
| `IDENTITY`      | KEEP    | Identity transform: position=(0,0), rotation=0°, scale=(1,1) |
| `ELEMENT_COUNT` | KEEP    | Serialization size                                           |

### Static Factories

| Export                     | Verdict | Rationale                                                                                |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `fromValues`               | KEEP    | Explicit component factory                                                               |
| `fromObject` / `fromArray` | KEEP    | Deserialization factories                                                                |
| `fromMatrix3`              | KEEP    | Decomposes affine 3×3 into SRT; scale loss from non-uniform rotation documented in TSDoc |
| `fromTransform2Like`       | KEEP    | Duck-type copy                                                                           |

### Static Operations

| Export                       | Verdict | Rationale                                                                                                                    |
| ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `multiply`                   | KEEP    | Composes two transforms (parent × child); scalar in-place; direct rotation assignment avoids redundant `hypot` normalization |
| `inverse`                    | KEEP    | Inverts SRT transform correctly (order: inverse scale, inverse rotation, inverse translate)                                  |
| `lerp`                       | KEEP    | Component-wise lerp for position/scale; angle-aware lerp for rotation via `lerpAngle`                                        |
| `nearEquals` / `exactEquals` | KEEP    | Transform equality                                                                                                           |

### Instance Methods

| Export                      | Verdict | Rationale                                       |
| --------------------------- | ------- | ----------------------------------------------- |
| `transformPoint`            | KEEP    | Applies SRT to a point (Scale→Rotate→Translate) |
| `transformDirection`        | KEEP    | Applies SR to a direction (no translation)      |
| `inverseTransformPoint`     | KEEP    | Inverse: un-translate, un-rotate, un-scale      |
| `inverseTransformDirection` | KEEP    | Inverse direction transform                     |
| `toMatrix3`                 | KEEP    | Converts SRT to 3×3 affine matrix               |
| `set`                       | KEEP    | Assigns all components                          |
| `copy`                      | KEEP    | Copies from another Transform2Like              |
| `clone`                     | KEEP    | Allocates new copy                              |
| `reset`                     | KEEP    | Resets to identity                              |
