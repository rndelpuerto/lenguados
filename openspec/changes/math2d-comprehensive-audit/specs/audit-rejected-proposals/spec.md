## ADDED Requirements

### Requirement: Rotation2.nlerp SHALL NOT be added

Normalized Linear Interpolation (nlerp) for `Rotation2` SHALL NOT be added to `@lenguados/math2d`.

**Evidence:**

1. **Redundant in 2D**: For unit complex numbers on SO(2), angle-based lerp IS equivalent to slerp. The existing `Rotation2.lerp` already produces exact shortest-path interpolation with constant angular velocity. This is explicitly documented in the source code at `rotation2.ts` lines 929-931: _"For unit complex numbers in 2D (SO(2)), lerp via angle interpolation IS equivalent to slerp."_
2. **Strictly inferior**: nlerp interpolates `(cos, sin)` components linearly then renormalizes. In 2D this produces non-constant angular velocity (speeds up at midpoint, slows at endpoints) while the existing angle-based lerp gives constant angular velocity for free.
3. **0/7 pure math libraries** provide 2D-specific nlerp (Eigen, NumPy, GLM, Apache Commons Math, Boost, MathNet, CGAL). The 3D quaternion nlerp that exists in some libraries (GLM `mix`, Eigen slerp) is motivated by the fact that 3D slerp is expensive (`acos` + `sin`). In 2D, the cost difference is negligible.
4. **Would confuse users** into thinking there is a meaningful distinction between lerp and nlerp in 2D, when there is not.

#### Scenario: Rotation2.nlerp does not exist

- **WHEN** a developer searches for `nlerp` in the Rotation2 class
- **THEN** no such method SHALL exist

### Requirement: Matrix3.compose SHALL NOT be added as a separate method

A standalone `Matrix3.compose(translation, rotation, scale, out?)` method SHALL NOT be added because the functionality already exists as `Matrix3.fromTransform2(translation, rotation, scale, out?)` at line 519 of `matrix3.ts`.

**Evidence:**

1. **Functionally identical**: `Matrix3.fromTransform2` accepts `(translation: ReadonlyVector2Like, rotation: number, scale: ReadonlyVector2Like | number, out?: Matrix3)` and constructs the SRT matrix -- exactly what `compose` would do.
2. **API redundancy**: Adding `compose` as an alias would create two entry points for the same operation, increasing API surface without adding capability and forcing users to choose between two identical methods.
3. **Naming consistency**: The `from*` naming convention is established across the codebase (`fromValues`, `fromArray`, `fromRotation`, `fromScale`, `fromTransform2Like`). Adding `compose` would break this convention.

If the name `fromTransform2` is deemed insufficiently clear, the solution is to rename it (a separate change), not to add a duplicate.

#### Scenario: Matrix3.compose does not exist as separate method

- **WHEN** a developer searches for a method named `compose` on Matrix3
- **THEN** no such method SHALL exist (use `Matrix3.fromTransform2` instead)

### Requirement: Transform2 partial construction factories SHALL NOT be added

The following convenience factories SHALL NOT be added to `Transform2`:

- `Transform2.fromRotation(angle, out?)`
- `Transform2.fromTranslation(x, y, out?)`
- `Transform2.fromScale(sx, sy, out?)`

**Evidence:**

1. **Constructor already handles partial construction with identity defaults**: Unlike matrices (where you must know which type to construct), Transform2 has a decomposed representation where the constructor accepts optional components:
   ```typescript
   new Transform2(undefined, angle); // rotation only (pos=0,0, scale=1,1)
   new Transform2(position); // translation only (rot=0, scale=1,1)
   new Transform2(undefined, 0, scale); // scale only (pos=0,0, rot=0)
   ```
2. **No new capability**: These factories would be one-line wrappers over `fromComponents` or the constructor, adding API surface without adding functionality.
3. **0/7 pure math libraries** have these on a decomposed transform type (Eigen, NumPy, GLM, etc. represent transforms as matrices, not structs). Matrix3 has `fromRotation`/`fromTranslation`/`fromScale` because matrices need explicit construction -- Transform2 does not.
4. **Precedent risk**: Invites `fromRotationDegrees`, `fromUniformScale`, `fromPoseAndScale`, etc.

#### Scenario: Transform2.fromRotation does not exist

- **WHEN** a developer searches for `fromRotation` on Transform2
- **THEN** no such factory SHALL exist (use `new Transform2(undefined, angle)` instead)

#### Scenario: Transform2.fromTranslation does not exist

- **WHEN** a developer searches for `fromTranslation` on Transform2
- **THEN** no such factory SHALL exist (use `new Transform2(position)` instead)

#### Scenario: Transform2.fromScale does not exist

- **WHEN** a developer searches for `fromScale` on Transform2
- **THEN** no such factory SHALL exist (use `new Transform2(undefined, 0, scale)` instead)

### Requirement: Vector2 inverse transform application methods SHALL NOT be added

The following methods SHALL NOT be added to `Vector2`:

- `Vector2.applyInverseRotation2(v, rotation, out?)`
- `Vector2.applyInverseTransform2(v, transform, out?)`
- And their instance counterparts

**Evidence:**

1. **Already exist on operator classes where they semantically belong:**
   - `Rotation2.applyInverse(rotation, vector, out?)` at `rotation2.ts:911`
   - `Transform2.inverseTransformPoint(transform, point, out?)` at `transform2.ts:977` with full triality (strict/safe/unchecked)
   - `Transform2.inverseTransformVector(transform, vector, out?)` also with full triality
2. **Coherent API design**: The library follows a clear pattern: forward-apply shortcuts live on Vector2 (`applyRotation2`, `applyTransform2`) for convenience, but inverse operations live on the operator class (`Rotation2`, `Transform2`). This is intentional -- the operator owns its inverse.
3. **Combinatorial explosion risk**: If every `applyX` on Vector2 requires an `applyInverseX`, the API grows quadratically. Currently Vector2 has 5 apply methods (`applyRotation2`, `applyMatrix2`, `applyMatrix3`, `applyTransform2`, `applyComplex`). Adding inverse variants would add 5 more methods (10 with instance variants).
4. **No consensus in reference libraries**: glMatrix puts transforms on the vector side. Eigen puts them on the matrix side. There is no universal standard for where inverse application belongs.

#### Scenario: Vector2.applyInverseRotation2 does not exist

- **WHEN** a developer searches for `applyInverseRotation2` on Vector2
- **THEN** no such method SHALL exist (use `Rotation2.applyInverse(rotation, vector, out)`)

#### Scenario: Vector2.applyInverseTransform2 does not exist

- **WHEN** a developer searches for `applyInverseTransform2` on Vector2
- **THEN** no such method SHALL exist (use `Transform2.inverseTransformPoint(transform, point, out)`)

### Requirement: floorPowerOfTwo and roundToPowerOfTwo SHALL NOT be modified

The rounding guard fix for `ceilPowerOfTwo` SHALL NOT be applied to `floorPowerOfTwo` or `roundToPowerOfTwo`.

**Evidence:**

1. **Verified NOT affected**: Both functions were executed against all integer exponents 1-52 with zero failures.
2. **Mathematical proof**: The floating-point error in `log(2^n) / LN_2` is always a tiny positive offset (e.g., `29.000000000000004` instead of `29`). `Math.floor` absorbs positive error correctly (`floor(29.000000000000004) = 29`). `Math.round` in `roundToPowerOfTwo` also handles it correctly because the error is orders of magnitude smaller than `0.5`. Only `Math.ceil` fails because it rounds up on any positive error (`ceil(29.000000000000004) = 30`).
3. **Unnecessary changes introduce risk**: Modifying correct functions adds regression risk for zero benefit.

#### Scenario: floorPowerOfTwo remains unchanged

- **WHEN** `floorPowerOfTwo(2 ** n)` is called for any integer n from 1 to 52
- **THEN** the result SHALL be `2 ** n` (already works correctly, no modification needed)

#### Scenario: roundToPowerOfTwo remains unchanged

- **WHEN** `roundToPowerOfTwo(2 ** n)` is called for any integer n from 1 to 52
- **THEN** the result SHALL be `2 ** n` (already works correctly, no modification needed)
