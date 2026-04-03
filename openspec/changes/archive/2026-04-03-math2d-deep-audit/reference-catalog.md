# 2D Math Foundation Library -- Comprehensive Reference Catalog

> **Purpose**: Cross-library inventory of every operation a 2D math foundation should offer.
> Derived from 9 production libraries. Used as the reference standard for auditing `@lenguados/math2d`.
>
> **Date**: 2026-04-02

---

## Libraries Surveyed

| #   | Library         | Language     | Domain          | Key types studied                          |
| --- | --------------- | ------------ | --------------- | ------------------------------------------ |
| 1   | **gl-matrix**   | JavaScript   | WebGL           | vec2, mat2, mat2d, mat3, glMatrix          |
| 2   | **three.js**    | JavaScript   | 3D Engine       | Vector2, Matrix3, MathUtils                |
| 3   | **Box2D** (v3)  | C            | Physics         | b2Vec2, b2Rot, b2Transform, math_functions |
| 4   | **Unity**       | C#           | Game Engine     | Vector2, Mathf, Matrix4x4                  |
| 5   | **Godot** (4.x) | GDScript/C++ | Game Engine     | Vector2, Transform2D, @GlobalScope         |
| 6   | **Eigen**       | C++          | Linear Algebra  | Vector2d, Matrix2d, Rotation2D, Transform  |
| 7   | **p5.js**       | JavaScript   | Creative Coding | p5.Vector                                  |
| 8   | **Matter.js**   | JavaScript   | Physics         | Vector, Bounds                             |
| 9   | **Chipmunk2D**  | C            | Physics         | cpVect                                     |

---

## Part 1: Per-Library API Catalogs

---

### 1. gl-matrix

**Scalar / Constants (glMatrix module)**

- `EPSILON` (0.000001)
- `ARRAY_TYPE` (Float32Array)
- `RANDOM` (Math.random reference)
- `toRadian(degrees)` -- deg-to-rad conversion
- `equals(a, b)` -- approximate equality with EPSILON
- `setMatrixArrayType(type)` -- configure array backing

**vec2 (complete method list)**

- Creation: `create`, `clone`, `fromValues`, `copy`, `set`, `zero`
- Arithmetic: `add`, `subtract`/`sub`, `multiply`/`mul`, `divide`/`div`, `scale`, `scaleAndAdd`, `negate`, `inverse`
- Rounding: `ceil`, `floor`, `round`, `min`, `max`
- Length/Distance: `length`/`len`, `squaredLength`/`sqrLen`, `distance`/`dist`, `squaredDistance`/`sqrDist`
- Products: `dot`, `cross`
- Interpolation: `lerp`
- Normalization: `normalize`
- Transformation: `transformMat2`, `transformMat2d`, `transformMat3`, `transformMat4`
- Geometry: `rotate`, `angle`
- Utility: `random`, `forEach`, `exactEquals`, `equals`, `str`

**mat2 (2x2 matrix)**

- Creation: `create`, `clone`, `copy`, `fromValues`, `set`, `identity`
- Arithmetic: `add`, `subtract`, `multiply`/`mul`, `multiplyScalar`
- Operations: `transpose`, `invert`, `adjoint`, `determinant`
- Transform builders: `fromRotation`, `fromScaling`, `rotate`, `scale`
- Utility: `exactEquals`, `equals`, `str`, `frob` (Frobenius norm)

**mat2d (2x3 affine matrix)**

- Creation: `create`, `clone`, `copy`, `fromValues`, `set`, `identity`
- Arithmetic: `add`, `subtract`, `multiply`/`mul`, `multiplyScalar`
- Operations: `invert`, `determinant`
- Transform builders: `fromRotation`, `fromScaling`, `fromTranslation`, `rotate`, `scale`, `translate`
- Utility: `exactEquals`, `equals`, `str`, `frob`

**mat3 (3x3 matrix)**

- Creation: `create`, `clone`, `copy`, `fromValues`, `set`, `identity`
- Arithmetic: `add`, `subtract`, `multiply`/`mul`, `multiplyScalar`
- Operations: `transpose`, `invert`, `adjoint`, `determinant`
- Transform builders: `fromRotation`, `fromScaling`, `fromTranslation`, `fromMat2d`, `fromMat4`, `rotate`, `scale`, `translate`
- Special: `normalFromMat4`, `projection`
- Utility: `exactEquals`, `equals`, `str`, `frob`

**Angle operations**: None (no dedicated angle module)

**Rotation/Complex**: None (uses matrices)

**Transform**: mat2d serves as 2D affine transform

---

### 2. three.js

**MathUtils (scalar utilities)**

- Constants: `DEG2RAD`, `RAD2DEG`
- Interpolation: `lerp`, `inverseLerp`, `mapLinear` (remap), `damp`, `pingpong`, `smoothstep`, `smootherstep`
- Clamping: `clamp`
- Modulo: `euclideanModulo`
- Random: `randInt`, `randFloat`, `randFloatSpread`, `seededRandom`
- Conversion: `degToRad`, `radToDeg`
- Power-of-two: `isPowerOfTwo`, `ceilPowerOfTwo`, `floorPowerOfTwo`
- Misc: `generateUUID`, `normalize`, `denormalize`

**Vector2 (complete method list)**

- Creation: constructor, `clone`, `copy`, `set`, `setX`, `setY`, `setComponent`, `getComponent`
- Aliases: `width`/`height` (aliases for x/y)
- Arithmetic: `add`, `addScalar`, `addVectors`, `addScaledVector`, `sub`, `subScalar`, `subVectors`, `multiply`, `multiplyScalar`, `divide`, `divideScalar`, `negate`
- Rounding: `ceil`, `floor`, `round`
- Clamping: `min`, `max`, `clamp`, `clampScalar`, `clampLength`
- Length/Distance: `length`, `lengthSq` (squaredLength), `manhattanLength`, `distanceTo`, `distanceToSquared`, `manhattanDistanceTo`
- Products: `dot`, `cross`
- Normalization: `normalize`, `setLength`
- Interpolation: `lerp`, `lerpVectors`
- Geometry: `angle`, `rotateAround(center, angle)`
- Transformation: `applyMatrix3`
- Comparison: `equals`
- Serialization: `fromArray`, `toArray`, `fromBufferAttribute`
- Iteration: `[Symbol.iterator]`
- Special: `random`

**Matrix3 (complete method list)**

- Creation: constructor, `clone`, `copy`, `set`, `identity`
- Arithmetic: `multiply`, `multiplyMatrices`, `multiplyScalar`, `premultiply`
- Operations: `determinant`, `invert`, `transpose`
- Transform builders (2D): `makeTranslation`, `makeRotation`, `makeScale`, `rotate`, `scale`, `translate`
- Extract: `extractBasis`, `getNormalMatrix` (from Mat4), `setFromMatrix4`
- Serialization: `fromArray`, `toArray`
- Comparison: `equals`
- Special: `makeUvTransform`

**Angle operations**: Only `DEG2RAD`, `RAD2DEG` conversion

**Rotation/Complex**: None (uses Quaternion for 3D; no 2D rotation type)

**Transform**: Matrix3 used for 2D transforms (with translate/rotate/scale methods)

---

### 3. Box2D (v3)

**Scalar utilities**

- Constants: `b2_pi`
- Comparison: `b2IsValid` (checks for NaN/Inf), `b2Vec2_IsValid`, `b2Rot_IsValid`
- Arithmetic: `b2Abs` (component-wise abs), `b2Min` (component-wise min), `b2Max` (component-wise max), `b2Clamp` (component-wise clamp)
- Trigonometry: `b2ComputeCosSin` (deterministic sin/cos pair)

**b2Vec2 (vector operations)**

- Arithmetic: `b2Add`, `b2Sub`, `b2Neg`, `b2MulSV` (scalar * vector), `b2MulAdd` (a + s*b), `b2MulSub` (a - s\*b)
- Length/Distance: `b2Length`, `b2LengthSquared`, `b2Distance`, `b2DistanceSquared`
- Products: `b2Dot`, `b2Cross` (returns scalar), `b2CrossVS` (scalar x vec), `b2CrossSV` (vec x scalar)
- Normalization: `b2Normalize`, `b2NormalizeChecked`, `b2GetLengthAndNormalize`
- Perpendicular: `b2LeftPerp`, `b2RightPerp`
- Interpolation: `b2Lerp`
- Clamping: `b2Clamp` (component-wise)

**b2Rot (2D rotation via cos/sin pair)**

- Creation: `b2MakeRot(angle)` -- creates rotation from angle
- Properties: `.c` (cosine), `.s` (sine)
- Query: `b2Rot_GetAngle`, `b2Rot_GetXAxis`, `b2Rot_GetYAxis`, `b2Rot_IsValid`
- Composition: `b2MulRot` (compose rotations), `b2InvMulRot` (inverse compose)
- Apply: `b2RotateVector`, `b2InvRotateVector`
- Angle: `b2RelativeAngle`, `b2UnwindAngle`
- Identity: `b2Rot_identity`
- Normalization: `b2NormalizeRot`, `b2IntegrateRotation`

**b2Transform (position + rotation)**

- Creation: `b2Transform` struct { p: b2Vec2, q: b2Rot }
- Apply: `b2TransformPoint`, `b2InvTransformPoint`
- Compose: `b2MulTransforms`, `b2InvMulTransforms`
- Identity: `b2Transform_identity`

**Angle operations**: `b2RelativeAngle`, `b2UnwindAngle`, `b2ComputeCosSin`

---

### 4. Unity

**Mathf (scalar utilities -- complete)**

- Constants: `PI`, `Infinity`, `NegativeInfinity`, `Deg2Rad`, `Rad2Deg`, `Epsilon`
- Comparison: `Approximately`
- Trigonometry: `Sin`, `Cos`, `Tan`, `Asin`, `Acos`, `Atan`, `Atan2`
- Rounding: `Ceil`, `CeilToInt`, `Floor`, `FloorToInt`, `Round`, `RoundToInt`
- Clamping: `Clamp`, `Clamp01`
- Min/Max: `Min`, `Max`
- Arithmetic: `Abs`, `Sign`, `Pow`, `Sqrt`, `Exp`, `Log`, `Log10`
- Interpolation: `Lerp`, `LerpUnclamped`, `LerpAngle`, `InverseLerp`, `SmoothStep`, `SmoothDamp`, `SmoothDampAngle`, `MoveTowards`, `MoveTowardsAngle`
- Wrapping: `Repeat`, `PingPong`, `DeltaAngle`
- Power-of-two: `IsPowerOfTwo`, `ClosestPowerOfTwo`, `NextPowerOfTwo`
- Special: `Gamma`, `GammaToLinearSpace`, `LinearToGammaSpace`, `CorrelatedColorTemperatureToRGB`, `FloatToHalf`, `HalfToFloat`, `PerlinNoise`

**Vector2 (complete)**

- Static properties: `zero`, `one`, `up`, `down`, `left`, `right`, `positiveInfinity`, `negativeInfinity`
- Properties: `x`, `y`, `magnitude`, `sqrMagnitude`, `normalized`
- Instance methods: `Set`, `Normalize`, `ToString`, `GetHashCode`, `Equals`
- Static methods: `Angle`, `SignedAngle`, `Distance`, `Dot`, `Lerp`, `LerpUnclamped`, `Max`, `Min`, `MoveTowards`, `Scale`, `ClampMagnitude`, `SmoothDamp`, `Perpendicular`, `Reflect`
- Operators: `+`, `-`, `*` (scalar), `/` (scalar), `==`, `!=`, implicit Vector3 conversion

**Matrix4x4** (relevant 2D-applicable operations)

- Creation: `identity`, `zero`, `TRS`, `Rotate`, `Scale`, `Translate`
- Properties: `determinant`, `inverse`, `transpose`, `isIdentity`
- Methods: `SetTRS`, `SetColumn`, `SetRow`, `GetColumn`, `GetRow`, `MultiplyPoint`, `MultiplyPoint3x4`, `MultiplyVector`
- Operators: `*` (matrix multiply)

**Angle operations**: `DeltaAngle`, `LerpAngle`, `MoveTowardsAngle`, `SmoothDampAngle` (all in Mathf)

**Rotation/Complex**: Quaternion (3D-focused; no dedicated 2D rotation type)

**Transform**: Matrix4x4.TRS; no dedicated 2D transform

---

### 5. Godot (4.x)

**@GlobalScope math functions (complete)**

- Constants: `PI`, `TAU`, `INF`, `NAN`
- Trigonometry: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`
- Rounding: `ceilf`/`ceili`, `floorf`/`floori`, `roundf`/`roundi`, `snappedf`/`snappedi`
- Clamping: `clampf`/`clampi`
- Min/Max: `minf`/`mini`, `maxf`/`maxi`
- Arithmetic: `absf`/`absi`, `signf`/`signi`, `fmod`, `fposmod`/`posmod`, `pow`, `sqrt`, `log`, `exp`
- Comparison: `is_equal_approx`, `is_zero_approx`, `is_finite`, `is_inf`, `is_nan`
- Interpolation: `lerpf`, `lerp_angle`, `inverse_lerp`, `remap`, `smoothstep`, `ease`, `cubic_interpolate`, `cubic_interpolate_angle`, `cubic_interpolate_in_time`, `bezier_interpolate`, `bezier_derivative`
- Movement: `move_toward`, `rotate_toward`
- Wrapping: `wrapf`/`wrapi`, `pingpong`
- Conversion: `deg_to_rad`, `rad_to_deg`, `linear_to_db`, `db_to_linear`
- Power-of-two: `nearest_po2`
- Special: `step_decimals`, `seed`, `randf`, `randf_range`, `randi`, `randi_range`

**Vector2 (complete)**

- Properties: `x`, `y`
- Constants: `ZERO`, `ONE`, `INF`, `LEFT`, `RIGHT`, `UP`, `DOWN`
- Component query: `aspect`, `max_axis_index`, `min_axis_index`
- Arithmetic: operator `+`, `-`, `*`, `/`, `%`; unary `-`
- Length/Distance: `length`, `length_squared`, `distance_to`, `distance_squared_to`
- Products: `dot`, `cross`
- Normalization: `normalized`, `is_normalized`, `limit_length`
- Perpendicular: `orthogonal`
- Angles: `angle`, `angle_to`, `angle_to_point`
- Geometry: `direction_to`, `project`, `reflect`, `bounce`, `slide`
- Rounding: `abs`, `sign`, `ceil`, `floor`, `round`, `snapped`
- Clamping: `clamp`, `clampf` (per-component)
- Interpolation: `lerp`, `slerp`, `cubic_interpolate`, `cubic_interpolate_in_time`, `bezier_interpolate`, `bezier_derivative`, `move_toward`
- Rotation: `rotated`, `from_angle` (static)
- Comparison: `is_equal_approx`, `is_zero_approx`, `is_finite`
- Component math: `min`, `max`, `posmod`, `posmodv`
- Serialization: operator `[]`

**Transform2D (complete)**

- Properties: `x` (basis column 0), `y` (basis column 1), `origin`
- Creation: constructor(rotation, position), constructor(x, y, origin)
- Query: `get_origin`, `get_rotation`, `get_scale`, `get_skew`, `determinant`
- Inverse: `inverse`, `affine_inverse`
- Transform application: `basis_xform`, `basis_xform_inv`, operator `*` (compose + transform point)
- Builders: `rotated`, `scaled`, `translated`, `looking_at`
- Interpolation: `interpolate_with`
- Normalization: `orthonormalized`, `is_conformal`
- Comparison: `is_equal_approx`, `is_finite`

**Angle operations**: `lerp_angle`, `rotate_toward`, `cubic_interpolate_angle` (in @GlobalScope); `angle`, `angle_to`, `angle_to_point` (in Vector2)

---

### 6. Eigen

**Scalar utilities**: Standard C++ math; no custom scalar module.

**Vector2d (Matrix<double,2,1> -- inherits MatrixBase)**

- Creation: constructor, `Zero()`, `Ones()`, `UnitX()`, `UnitY()`, `Random()`, `Constant(scalar)`, `LinSpaced(size, low, high)`
- Access: `x()`, `y()`, `operator()`, `operator[]`, `data()`
- Arithmetic: `operator+`, `operator-`, `operator*` (scalar), `operator/` (scalar), `-` (unary)
- Products: `dot`, `cross` (returns scalar for 2D)
- Norms: `norm`, `squaredNorm`, `stableNorm`, `blueNorm`, `hypotNorm`
- Normalization: `normalize` (in-place), `normalized` (returns copy)
- Component-wise: `cwiseProduct`, `cwiseQuotient`, `cwiseMin`, `cwiseMax`, `cwiseAbs`, `cwiseAbs2`, `cwiseSqrt`, `cwiseInverse`, `cwiseSign`, `cwiseEqual`
- Reductions: `sum`, `prod`, `mean`, `minCoeff`, `maxCoeff`, `trace`
- Comparison: `isApprox`, `isApproxToConstant`, `isMuchSmallerThan`, `isZero`, `isOnes`, `isConstant`
- Component manipulation: `head`, `tail`, `segment`, `reverse`, `replicate`
- Homogeneous: `homogeneous`, `hnormalized`
- Serialization: `format`, `operator<<`
- Special: `asDiagonal`, `transpose`, `conjugate`, `adjoint`, `real`, `imag`

**Matrix2d (Matrix<double,2,2> -- inherits MatrixBase)**

- Creation: `Identity()`, `Zero()`, `Ones()`, `Random()`, `Constant(scalar)`
- Arithmetic: `operator+`, `operator-`, `operator*` (matrix or scalar), `operator/` (scalar)
- Operations: `transpose`, `transposeInPlace`, `inverse`, `determinant`, `adjoint`
- Norms: `norm` (Frobenius), `squaredNorm`
- Decompositions: SVD, Eigenvalue, LU, etc.
- Access: `row(i)`, `col(i)`, `diagonal()`, `operator()(r,c)`
- Comparison: `isApprox`, `isIdentity`, `isZero`

**Rotation2D**

- Creation: constructor(angle), `Identity()`
- Query: `angle`, `smallestAngle` (in [-pi, pi]), `smallestPositiveAngle` (in [0, 2pi])
- Operations: `inverse`, `operator*` (compose)
- Conversion: `toRotationMatrix` (returns Matrix2d), `fromRotationMatrix`
- Interpolation: `slerp`

**Transform (Affine2d = Transform<double, 2, Affine>)**

- Creation: `Identity()`
- Builders: `translate`, `rotate`, `scale`, `prescale`, `pretranslate`, `prerotate`
- Query: `rotation`, `translation`, `linear`, `matrix`, `affine`
- Operations: `inverse`, `operator*` (compose)
- Conversion: `fromPositionOrientationScale`

**Angle operations**: `Rotation2D::smallestAngle`, `Rotation2D::smallestPositiveAngle`

---

### 7. p5.js

**Scalar utilities**: No dedicated module. Uses `map()` (remap), `lerp()`, `constrain()` (clamp), `norm()` as sketch-level functions.

**p5.Vector (complete)**

- Creation: constructor, `copy`/`clone`, `set`, `fromAngle`, `fromAngles`, `random2D`, `random3D`
- Arithmetic: `add`, `sub`, `mult`, `div`, `rem` (modulo)
- Length/Distance: `mag`, `magSq`, `dist`
- Products: `dot`, `cross`
- Normalization: `normalize`, `setMag`, `limit`
- Angles: `heading`, `angleBetween`, `rotate`
- Interpolation: `lerp`, `slerp`
- Comparison: `equals`
- Geometry: `reflect`
- Component: `array`, `toString`
- Special: `clampToZero`

**Matrix/Rotation/Transform**: None (uses p5.Matrix internally for 3D, not exposed for 2D)

**Angle operations**: `heading` (vec to angle), `fromAngle` (angle to vec), `angleBetween`

---

### 8. Matter.js

**Scalar utilities**: None dedicated.

**Vector (complete)**

- Creation: `create`, `clone`
- Arithmetic: `add`, `sub`, `mult` (scalar), `div` (scalar), `neg`
- Length: `magnitude`, `magnitudeSquared`
- Products: `dot`, `cross`
- Normalization: `normalise`
- Perpendicular: `perp`
- Angles: `angle`
- Rotation: `rotate`, `rotateAbout`

**Bounds (AABB)**

- Creation: `create`
- Queries: `contains`, `overlaps`
- Mutation: `update`, `translate`, `shift`

**Rotation/Complex**: None (uses angle as raw number)

**Transform**: None dedicated

**Angle operations**: `Vector.angle` only

---

### 9. Chipmunk2D

**Scalar utilities**: `cpfmax`, `cpfmin`, `cpfabs`, `cpfclamp`, `cpflerp`, `cpflerpconst` (scalar versions)

**cpVect (complete)**

- Creation: `cpv(x, y)`, `cpvzero`
- Arithmetic: `cpvadd`, `cpvsub`, `cpvneg`, `cpvmult` (scalar)
- Length/Distance: `cpvlength`, `cpvlengthsq`, `cpvdist`, `cpvdistsq`
- Products: `cpvdot`, `cpvcross` (returns scalar)
- Normalization: `cpvnormalize`, `cpvnormalize_safe`
- Perpendicular: `cpvperp` (CCW 90 deg), `cpvrperp` (CW 90 deg)
- Projection: `cpvproject`
- Rotation (complex multiply): `cpvrotate`, `cpvunrotate`
- Angles: `cpvforangle` (angle to unit vec), `cpvtoangle` (vec to angle)
- Interpolation: `cpvlerp`, `cpvslerp`, `cpvlerpconst` (move by distance)
- Clamping: `cpvclamp` (clamp length)
- Comparison: `cpveql`, `cpvnear` (approximate equality by distance)

**Rotation/Complex**: Uses cpVect as complex number for rotation (`cpvrotate`/`cpvunrotate`)

**Transform**: `cpTransform` { a, b, c, d, tx, ty } -- 2x3 affine

- `cpTransformIdentity`, `cpTransformNew`, `cpTransformNewTranspose`
- `cpTransformInverse`, `cpTransformMult`
- `cpTransformPoint`, `cpTransformVect`
- `cpTransformRigid`, `cpTransformRigidInverse`
- `cpTransformTranslate`, `cpTransformScale`, `cpTransformRotate`
- `cpTransformbxfrm` (ortho basis transform), `cpTransformAxialScale`
- `cpTransformBoneScale`, `cpTransformWrap`, `cpTransformWrapInverse`

**Angle operations**: `cpvforangle`, `cpvtoangle` only

---

## Part 2: Unified Cross-Library Catalog

Below, each operation is classified by how many of the 9 surveyed libraries provide it.

Legend:

- **G** = gl-matrix, **T** = three.js, **B** = Box2D, **U** = Unity, **D** = Godot, **E** = Eigen, **P** = p5.js, **M** = Matter.js, **C** = Chipmunk2D

---

### MUST HAVE (8-9 libraries)

#### Scalar / Constants

| Operation                    | Count | Libraries         | Notes                           |
| ---------------------------- | ----- | ----------------- | ------------------------------- |
| PI constant                  | 9     | G T B U D E P M C | Universally present             |
| Epsilon / tolerance constant | 8     | G T B U D E P C   | M has no explicit epsilon       |
| clamp(value, min, max)       | 8     | G T B U D E P C   | Fundamental bounding operation  |
| abs(value)                   | 8     | G T B U D E P C   | Built-in but often wrapped      |
| min(a, b)                    | 9     | G T B U D E P M C | Component-wise and scalar       |
| max(a, b)                    | 9     | G T B U D E P M C | Component-wise and scalar       |
| sign(value)                  | 8     | G T B U D E P C   | Returns -1, 0, or 1             |
| lerp(a, b, t)                | 9     | G T B U D E P M C | Linear interpolation (scalar)   |
| DEG_TO_RAD / degToRad        | 8     | G T B U D E P C   | Conversion constant or function |
| RAD_TO_DEG / radToDeg        | 8     | G T B U D E P C   | Conversion constant or function |
| sqrt                         | 9     | G T B U D E P M C | Used everywhere implicitly      |

#### Vector2

| Operation                     | Count | Libraries         | Notes                          |
| ----------------------------- | ----- | ----------------- | ------------------------------ |
| create / constructor          | 9     | G T B U D E P M C |                                |
| clone / copy                  | 9     | G T B U D E P M C |                                |
| set(x, y)                     | 9     | G T B U D E P M C |                                |
| add(a, b)                     | 9     | G T B U D E P M C |                                |
| subtract(a, b)                | 9     | G T B U D E P M C |                                |
| multiply by scalar            | 9     | G T B U D E P M C | `scale` / `mult` / `operator*` |
| divide by scalar              | 8     | G T B U D E P M   | Not in Chipmunk (use mult 1/s) |
| negate                        | 9     | G T B U D E P M C |                                |
| dot product                   | 9     | G T B U D E P M C |                                |
| cross product (2D scalar)     | 9     | G T B U D E P M C | Returns scalar z-component     |
| length / magnitude            | 9     | G T B U D E P M C |                                |
| length squared                | 9     | G T B U D E P M C |                                |
| distance                      | 9     | G T B U D E P M C |                                |
| distance squared              | 8     | G T B U D E P C   | M has no squaredDistance       |
| normalize                     | 9     | G T B U D E P M C |                                |
| lerp(a, b, t)                 | 9     | G T B U D E P M C | Vector interpolation           |
| equals / approximate equality | 9     | G T B U D E P M C | Exact or within epsilon        |

#### Matrix (2x2 or 3x3 for 2D)

| Operation   | Count | Libraries       | Notes                              |
| ----------- | ----- | --------------- | ---------------------------------- |
| identity    | 8     | G T B U D E M C |                                    |
| multiply    | 8     | G T B U D E M C | Matrix _ matrix or matrix _ vector |
| determinant | 8     | G T B U D E M C | Via matrix or transform            |
| inverse     | 8     | G T B U D E M C |                                    |

---

### SHOULD HAVE (5-7 libraries)

#### Scalar / Constants

| Operation                              | Count | Libraries     | Notes                            |
| -------------------------------------- | ----- | ------------- | -------------------------------- |
| TAU (2\*PI)                            | 5     | G T U D C     | Some use TWO_PI naming           |
| HALF_PI                                | 5     | G T U D E     | PI/2                             |
| smoothStep(edge0, edge1, x)            | 5     | T U D E P     | Cubic Hermite interpolation      |
| inverseLerp(a, b, value)               | 5     | T U D E P     | Find t from value                |
| remap / mapLinear                      | 5     | T U D E P     | Map one range to another         |
| approximately(a, b)                    | 7     | G T B U D E C | Named differently per library    |
| euclidean modulo                       | 5     | T U D E C     | Always positive mod              |
| repeat / wrap / loop                   | 5     | T U D E C     | Wrap value into range            |
| pingPong                               | 4+1   | T U D E C     | Bounce between bounds            |
| moveTowards(current, target, maxDelta) | 5     | U D E P C     | Step toward target by max amount |

#### Angle Operations

| Operation                    | Count | Libraries     | Notes                                  |
| ---------------------------- | ----- | ------------- | -------------------------------------- |
| deg-to-rad function          | 7     | G T U D E P C | As opposed to just the constant        |
| rad-to-deg function          | 7     | G T U D E P C | As opposed to just the constant        |
| normalize angle to [-PI, PI] | 6     | B U D E P C   | `deltaAngle`, `smallestAngle`, etc.    |
| normalize angle to [0, TAU]  | 5     | B U D E C     | `smallestPositiveAngle`, `UnwindAngle` |
| lerpAngle                    | 5     | U D E P C     | Shortest-path angle interpolation      |
| deltaAngle                   | 5     | B U D E C     | Shortest signed angle difference       |

#### Vector2

| Operation               | Count | Libraries                 | Notes                                 |
| ----------------------- | ----- | ------------------------- | ------------------------------------- |
| component-wise multiply | 6     | G T U D E P               | `multiply`/`cwiseProduct`/`Scale`     |
| component-wise divide   | 5     | G T U D E                 |                                       |
| component-wise min      | 6     | G T U D E C               | Per-component minimum                 |
| component-wise max      | 6     | G T U D E C               | Per-component maximum                 |
| ceil                    | 5     | G T D E P                 | Component-wise ceil                   |
| floor                   | 5     | G T D E P                 | Component-wise floor                  |
| round                   | 5     | G T D E P                 | Component-wise round                  |
| angle (heading)         | 7     | G T D E P M C             | Angle from positive X-axis            |
| rotate by angle         | 7     | G T D U P M C             | Rotate vector around origin           |
| perpendicular           | 6     | B U D E M C               | 90-degree rotated vector              |
| reflect                 | 5     | T U D E P                 | Reflect off a surface normal          |
| project                 | 5     | U D E P C                 | Project onto another vector           |
| random unit vector      | 6     | G T D E P M               | Random direction                      |
| scaleAndAdd(a, b, s)    | 5     | G T B E C                 | a + b\*s (fused multiply-add pattern) |
| safe normalize          | 5     | B D E P C                 | Returns zero/fallback for zero-length |
| clamp length / limit    | 5     | T U D P C                 | Cap vector magnitude                  |
| setLength / setMag      | 5     | T U D P C                 | Set vector to specific magnitude      |
| direction_to            | 5     | U D E P C                 | Normalized direction from a to b      |
| transform by matrix     | 7     | G T B U D E C             | Apply matrix to vector                |
| fromArray / toArray     | 6     | G T U D E P               | Serialization                         |
| toString                | 6     | G T U D E P               | String representation                 |
| slerp                   | 5     | D E P C (and some others) | Spherical linear interpolation        |

#### Rotation (2D)

| Operation         | Count | Libraries            | Notes                         |
| ----------------- | ----- | -------------------- | ----------------------------- |
| Create from angle | 6     | B U D E P C          | Construct rotation from angle |
| Get angle         | 6     | B U D E P C          | Extract angle from rotation   |
| Compose rotations | 5     | B D E C (and others) | Multiply two rotations        |
| Inverse rotation  | 5     | B D E C (and others) | Undo rotation                 |
| Apply to vector   | 6     | B D E P M C          | Rotate a vector               |
| Identity rotation | 5     | B D E C (and others) | No-op rotation                |

#### Transform (2D)

| Operation                                | Count | Libraries   | Notes                         |
| ---------------------------------------- | ----- | ----------- | ----------------------------- |
| Compose (multiply)                       | 6     | G B U D E C | Combine transforms            |
| Inverse                                  | 6     | G B U D E C | Reverse transform             |
| Transform point                          | 6     | B U D E M C | Apply full transform to point |
| Transform vector/direction               | 5     | B U D E C   | Apply rotation+scale only     |
| Create from components (pos, rot, scale) | 5     | B U D E C   | TRS-style construction        |
| Identity transform                       | 6     | G B U D E C | No-op transform               |
| Translate                                | 6     | G T U D E C | Add translation               |
| Rotate                                   | 6     | G T U D E C | Add rotation                  |
| Scale                                    | 6     | G T U D E C | Add scale                     |

---

### NICE TO HAVE (2-4 libraries)

#### Scalar

| Operation                          | Count | Libraries | Notes                            |
| ---------------------------------- | ----- | --------- | -------------------------------- |
| smootherStep (quintic)             | 2     | T D       | Ken Perlin's improved smoothstep |
| saturate / clamp01                 | 3     | U D E     | Clamp to [0,1]                   |
| step (Heaviside)                   | 3     | G T D     | Return 0 or 1 at threshold       |
| damp (frame-rate-independent lerp) | 2     | T U       | Exponential decay interpolation  |
| moveTowardsAngle                   | 2     | U D       | Step angle toward target         |
| smoothDamp (scalar)                | 2     | U D       | Spring-damper scalar             |
| lerpConst (move by distance)       | 2     | C D       | Linear move capped by distance   |
| ease(curve, t)                     | 2     | D P       | Easing curve evaluation          |
| SQRT_2 constant                    | 3     | U D E     | Square root of 2                 |
| QUARTER_PI                         | 3     | U D E     | PI/4                             |
| isFinite / isNaN checks            | 4     | B U D E   | Validity guards                  |
| Frobenius norm (matrix)            | 2     | G E       | Matrix norm                      |
| nearest power of two               | 3     | U D T     | Round to power of 2              |

#### Angle Operations

| Operation                                | Count | Libraries | Notes                                    |
| ---------------------------------------- | ----- | --------- | ---------------------------------------- |
| smoothDampAngle                          | 2     | U D       | Spring-damper for angles                 |
| rotate_toward(current, target, maxDelta) | 2     | U D       | Angular moveTowards                      |
| cubic_interpolate_angle                  | 2     | D E       | Cubic interpolation for angles           |
| angle unwrapping                         | 2     | B D       | Remove discontinuities from angle series |

#### Vector2

| Operation                                 | Count | Libraries | Notes                                |
| ----------------------------------------- | ----- | --------- | ------------------------------------ |
| slide (project onto plane)                | 2     | D C       | Vector projected along surface       |
| bounce                                    | 2     | D C       | Bounce off normal                    |
| snap / snapped                            | 2     | D C       | Snap to grid                         |
| manhattanLength                           | 2     | T D       | L1 norm                              |
| manhattanDistance                         | 2     | T D       | L1 distance                          |
| inverse (1/x, 1/y)                        | 2     | G E       | Component-wise reciprocal            |
| isNormalized                              | 3     | D E C     | Check if length is ~1                |
| isZero / isZeroApprox                     | 3     | D E C     | Check if near zero vector            |
| angle_to (signed angle to another vector) | 4     | U D P C   | Signed angle between two vectors     |
| angle_to_point                            | 2     | D C       | Angle from one point to another      |
| lerpVectors(a, b, t)                      | 2     | T D       | Standalone lerp taking both inputs   |
| cubic_interpolate                         | 3     | D E P     | Cubic (Catmull-Rom) interpolation    |
| bezier_interpolate                        | 2     | D P       | Bezier curve evaluation              |
| from_angle (static)                       | 4     | D E P C   | Create unit vector from angle        |
| rotateAround(center, angle)               | 3     | T D M     | Rotate around a point (not origin)   |
| aspect ratio                              | 2     | D E       | x/y ratio                            |
| abs (component-wise)                      | 3     | D E C     |                                      |
| sign (component-wise)                     | 3     | D E C     |                                      |
| posmod (per-component)                    | 2     | D C       | Positive modulo per component        |
| smoothDamp (vector)                       | 2     | U D       | Spring-damper for vectors            |
| SmoothDamp with velocity                  | 2     | U D       | Smooth movement with output velocity |
| clampf (per-component scalar clamp)       | 2     | D E       | Clamp each component independently   |
| width/height aliases                      | 2     | T D       | Aliases for x/y                      |

#### Rotation (2D)

| Operation                 | Count | Libraries | Notes                          |
| ------------------------- | ----- | --------- | ------------------------------ |
| slerp (rotation)          | 3     | B E C     | Spherical interpolation        |
| Get axes (X-axis, Y-axis) | 2     | B E       | Extract rotation basis vectors |
| Normalize rotation        | 2     | B E       | Re-normalize cos/sin pair      |
| Validity check            | 2     | B E       | Check cos^2+sin^2 ~= 1         |
| Integrate rotation        | 2     | B E       | Apply angular velocity over dt |

#### Transform (2D)

| Operation                   | Count | Libraries | Notes                          |
| --------------------------- | ----- | --------- | ------------------------------ |
| Affine inverse              | 3     | D E C     | Handles scale (not just rigid) |
| Get rotation from transform | 3     | D E C     | Extract rotation component     |
| Get scale from transform    | 3     | D E C     | Extract scale component        |
| Get translation/origin      | 4     | D E C B   | Extract position               |
| Get skew                    | 2     | D E       | Extract skew component         |
| interpolate_with            | 3     | D E C     | Transform interpolation        |
| Orthonormalize              | 2     | D E       | Remove accumulated error       |
| Is conformal                | 2     | D E       | Check for uniform scale        |
| looking_at                  | 2     | D E       | Orient toward target           |
| Transpose                   | 3     | G T E     | Matrix transpose               |
| Adjoint / adjugate          | 2     | G E       | Classical adjoint              |

#### Bounds / AABB

| Operation             | Count | Libraries | Notes                  |
| --------------------- | ----- | --------- | ---------------------- |
| Create from points    | 3     | M D E     | Construct bounding box |
| Contains point        | 3     | M D E     | Point-in-AABB test     |
| Overlaps another AABB | 3     | M D E     | AABB intersection test |
| Union / expand        | 2     | M E       | Merge two AABBs        |
| Translate             | 2     | M E       | Move AABB              |

---

### EVALUATE (1 library only)

| Operation                             | Library    | Notes                              |
| ------------------------------------- | ---------- | ---------------------------------- |
| `forEach` (batch operation on arrays) | gl-matrix  | Operate on strided typed arrays    |
| `fromBufferAttribute`                 | three.js   | WebGL buffer interop               |
| `euclideanModulo`                     | three.js   | Could use standard `mod`           |
| `generateUUID`                        | three.js   | Unrelated to math                  |
| `seededRandom`                        | three.js   | Deterministic random (but useful)  |
| `CorrelatedColorTemperatureToRGB`     | Unity      | Domain-specific                    |
| `PerlinNoise`                         | Unity      | Noise generation                   |
| `FloatToHalf` / `HalfToFloat`         | Unity      | Float16 conversion                 |
| `Gamma` / linear-gamma conversion     | Unity      | Color space                        |
| `linear_to_db` / `db_to_linear`       | Godot      | Audio-specific                     |
| `step_decimals`                       | Godot      | Count decimal places               |
| `cwiseInverse`, `cwiseSqrt`           | Eigen      | Component-wise advanced ops        |
| `homogeneous` / `hnormalized`         | Eigen      | Homogeneous coordinates            |
| `asDiagonal`                          | Eigen      | Vector as diagonal matrix          |
| `blueNorm`, `stableNorm`, `hypotNorm` | Eigen      | Numerically stable norms           |
| `rem` (vector modulo)                 | p5.js      | Component-wise modulo              |
| `clampToZero`                         | p5.js      | Zero-snap for near-zero components |
| `cpTransformBoneScale`                | Chipmunk2D | Skeletal animation specific        |
| `cpTransformWrap` / `WrapInverse`     | Chipmunk2D | Transform wrapping                 |
| `cpTransformAxialScale`               | Chipmunk2D | Scale along arbitrary axis         |

---

## Part 3: Priority Summary Matrix

### Operations by Category and Priority

#### A. Scalar Utilities

| Priority   | Operations                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| **MUST**   | PI, EPSILON, clamp, abs, min, max, sign, lerp, DEG_TO_RAD, RAD_TO_DEG, sqrt                                   |
| **SHOULD** | TAU, HALF_PI, smoothStep, inverseLerp, remap, approximately, euclideanMod, repeat/wrap, pingPong, moveTowards |
| **NICE**   | smootherStep, saturate/clamp01, step, damp, SQRT_2, QUARTER_PI, isFinite/isNaN, nearestPowerOfTwo, lerpConst  |

#### B. Angle Operations

| Priority   | Operations                                                                              |
| ---------- | --------------------------------------------------------------------------------------- |
| **MUST**   | degToRad, radToDeg (as functions and/or constants)                                      |
| **SHOULD** | normalizeAngle [-PI,PI], normalizeAngle [0,TAU], lerpAngle, deltaAngle                  |
| **NICE**   | moveTowardsAngle, smoothDampAngle, rotateToward, cubicInterpolateAngle, angleUnwrapping |

#### C. Vector2

| Priority   | Operations                                                                                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MUST**   | create, clone, copy, set, add, subtract, scale, divideScalar, negate, dot, cross, length, lengthSquared, distance, distanceSquared, normalize, lerp, equals                                                                                                                     |
| **SHOULD** | componentMultiply, componentDivide, componentMin, componentMax, ceil, floor, round, angle/heading, rotate, perpendicular, reflect, project, randomUnit, scaleAndAdd, safeNormalize, clampLength, setLength, directionTo, transformByMatrix, fromArray, toArray, toString, slerp |
| **NICE**   | slide, bounce, snap, manhattanLength, manhattanDistance, inverse, isNormalized, isZero, angleTo, signedAngle, angleToPoint, lerpVectors, cubicInterpolate, bezierInterpolate, fromAngle, rotateAround, abs, sign, posmod, smoothDamp, aspect                                    |

#### D. Rotation (2D)

| Priority   | Operations                                                           |
| ---------- | -------------------------------------------------------------------- |
| **SHOULD** | createFromAngle, getAngle, compose, inverse, applyToVector, identity |
| **NICE**   | slerp, getAxes, normalizeRotation, validityCheck, integrateRotation  |

#### E. Matrix 2x2

| Priority   | Operations                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- |
| **MUST**   | identity, multiply, determinant, inverse                                                     |
| **SHOULD** | create, clone, copy, set, transpose, fromRotation, fromScaling, rotate, scale, add, subtract |
| **NICE**   | adjoint, multiplyScalar, Frobenius norm, exactEquals, equals                                 |

#### F. Matrix 3x3 (as 2D affine)

| Priority   | Operations                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| **MUST**   | identity, multiply, determinant, inverse                                                                                   |
| **SHOULD** | create, clone, copy, set, transpose, fromRotation, fromScaling, fromTranslation, rotate, scale, translate, transformVector |
| **NICE**   | adjoint, multiplyScalar, Frobenius norm, fromMat2d, projection, equals                                                     |

#### G. Transform (2D)

| Priority   | Operations                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| **SHOULD** | identity, compose, inverse, transformPoint, transformDirection, createFromComponents, translate, rotate, scale         |
| **NICE**   | affineInverse, getRotation, getScale, getTranslation, getSkew, interpolateWith, orthonormalize, isConformal, lookingAt |

---

## Part 4: Consensus Count Table

Quick-reference: how many libraries provide each operation.

```
OPERATION                        G  T  B  U  D  E  P  M  C  TOTAL
------------------------------------------------------------------
SCALAR / CONSTANTS
  PI                             x  x  x  x  x  x  x  x  x   9
  EPSILON                        x  x  x  x  x  x  .  x  x   8
  TAU                            .  .  .  .  x  .  .  .  x   2*
  DEG_TO_RAD                     x  x  .  x  x  x  .  .  .   5
  RAD_TO_DEG                     x  x  .  x  x  x  .  .  .   5
  clamp                          x  x  x  x  x  x  x  .  x   8
  sign                           .  .  .  x  x  x  .  .  .   3*
  abs                            .  .  x  x  x  x  .  .  x   5
  lerp (scalar)                  .  x  .  x  x  .  x  .  x   5
  inverseLerp                    .  x  .  x  x  .  x  .  .   4
  remap / mapLinear              .  x  .  .  x  .  x  .  .   3
  smoothStep                     .  x  .  x  x  x  .  .  .   4
  smootherStep                   .  x  .  .  x  .  .  .  .   2
  euclidean modulo               .  x  .  .  x  .  .  .  .   2*
  repeat / wrap                  .  .  .  x  x  .  .  .  .   2*
  pingPong                       .  x  .  x  x  .  .  .  .   3
  moveTowards                    .  .  .  x  x  .  .  .  x   3
  approximately                  x  .  x  x  x  x  .  .  x   6

ANGLE OPERATIONS
  normalizeAngle [-PI,PI]        .  .  x  x  x  x  .  .  .   4
  normalizeAngle [0,TAU]         .  .  x  .  .  x  .  .  .   2
  deltaAngle                     .  .  x  x  x  .  .  .  .   3
  lerpAngle                      .  .  .  x  x  .  x  .  .   3
  moveTowardsAngle               .  .  .  x  x  .  .  .  .   2
  smoothDampAngle                .  .  .  x  .  .  .  .  .   1

VECTOR2
  create/constructor             x  x  x  x  x  x  x  x  x   9
  clone/copy                     x  x  x  x  x  x  x  x  x   9
  set                            x  x  x  x  x  x  x  .  .   7
  add                            x  x  x  x  x  x  x  x  x   9
  subtract                       x  x  x  x  x  x  x  x  x   9
  scale (scalar mult)            x  x  x  x  x  x  x  x  x   9
  divide by scalar               x  x  .  x  x  x  x  x  .   7
  negate                         x  x  x  x  x  x  x  x  x   9
  dot                            x  x  x  x  x  x  x  x  x   9
  cross (2D)                     x  x  x  x  x  x  x  x  x   9
  length/magnitude               x  x  x  x  x  x  x  x  x   9
  lengthSquared                  x  x  x  x  x  x  x  x  x   9
  distance                       x  x  x  x  x  x  x  .  x   8
  distanceSquared                x  .  x  .  x  x  .  .  x   5
  normalize                      x  x  x  x  x  x  x  x  x   9
  lerp                           x  x  x  x  x  x  x  .  x   8
  slerp                          .  .  .  .  x  x  x  .  x   4
  equals                         x  x  .  x  x  x  x  .  x   7
  angle/heading                  x  x  .  .  x  .  x  x  x   6
  rotate                         x  .  .  .  x  .  x  x  x   5
  perpendicular                  .  .  x  x  x  .  .  x  x   5
  reflect                        .  x  .  x  x  .  x  .  .   4
  project                        .  .  .  .  x  .  .  .  x   2*
  scaleAndAdd                    x  x  x  .  .  x  .  .  .   4
  normalize safe                 .  .  x  .  x  x  .  .  x   4
  clampLength / limit            .  x  .  x  x  .  x  .  x   5
  setLength / setMag             .  x  .  .  .  .  x  .  .   2
  directionTo                    .  .  .  .  x  .  .  .  .   1*
  componentMultiply              x  x  .  x  x  x  x  .  .   6
  componentDivide                x  x  .  .  x  x  .  .  .   4
  componentMin                   x  x  .  x  x  x  .  .  .   5
  componentMax                   x  x  .  x  x  x  .  .  .   5
  ceil                           x  x  .  .  x  .  .  .  .   3
  floor                          x  x  .  .  x  .  .  .  .   3
  round                          x  x  .  .  x  .  .  .  .   3
  abs (component)                .  .  x  .  x  x  .  .  .   3
  random unit                    x  x  .  .  x  x  x  x  .   6
  transformByMatrix              x  x  x  x  x  x  .  .  x   7
  fromAngle (static)             .  .  .  .  x  .  x  .  x   3
  fromArray / toArray            x  x  .  .  x  x  x  .  .   5
  toString                       x  x  .  x  x  x  x  .  .   6
  rotateAround(center)           .  x  .  .  x  .  .  x  .   3
  bounce                         .  .  .  .  x  .  .  .  x   2
  slide                          .  .  .  .  x  .  .  .  x   2
  snap / snapped                 .  .  .  .  x  .  .  .  .   1
  manhattanLength                .  x  .  .  x  .  .  .  .   2
  manhattanDistance               .  x  .  .  .  .  .  .  .   1
  isNormalized                   .  .  .  .  x  x  .  .  .   2
  isZero approx                  .  .  .  .  x  x  .  .  .   2
  cubicInterpolate               .  .  .  .  x  .  .  .  .   1*
  bezierInterpolate              .  .  .  .  x  .  .  .  .   1*
  smoothDamp (vector)            .  .  .  x  x  .  .  .  .   2

ROTATION 2D
  Create from angle              .  .  x  .  x  x  x  .  x   5
  Get angle                      .  .  x  .  x  x  x  .  x   5
  Compose (multiply)             .  .  x  .  x  x  .  .  x   4
  Inverse                        .  .  x  .  x  x  .  .  x   4
  Apply to vector                .  .  x  .  x  x  x  x  x   6
  Identity                       .  .  x  .  x  x  .  .  x   4
  slerp                          .  .  .  .  x  x  .  .  x   3
  Get axes                       .  .  x  .  .  x  .  .  .   2
  Normalize                      .  .  x  .  .  x  .  .  .   2
  Validity check                 .  .  x  .  .  x  .  .  .   2

MATRIX 2x2
  identity                       x  .  .  .  .  x  .  .  .   2*
  multiply                       x  .  .  .  .  x  .  .  .   2*
  determinant                    x  .  .  .  .  x  .  .  .   2*
  inverse                        x  .  .  .  .  x  .  .  .   2*
  transpose                      x  .  .  .  .  x  .  .  .   2*
  fromRotation                   x  .  .  .  .  x  .  .  .   2*
  fromScaling                    x  .  .  .  .  x  .  .  .   2*
  rotate                         x  .  .  .  .  .  .  .  .   1
  scale                          x  .  .  .  .  .  .  .  .   1

MATRIX 3x3 (as 2D affine)
  identity                       x  x  .  x  x  x  .  .  x   6
  multiply                       x  x  .  x  x  x  .  .  x   6
  determinant                    x  x  .  x  x  x  .  .  .   5
  inverse                        x  x  .  x  x  x  .  .  x   6
  transpose                      x  x  .  .  .  x  .  .  .   3
  translate                      x  x  .  x  x  x  .  .  x   6
  rotate                         x  x  .  x  x  x  .  .  x   6
  scale                          x  x  .  x  x  x  .  .  x   6
  fromRotation                   x  x  .  .  .  .  .  .  .   2
  fromScaling                    x  x  .  .  .  .  .  .  .   2
  fromTranslation                x  x  .  .  .  .  .  .  .   2

TRANSFORM 2D
  identity                       .  .  x  x  x  x  .  .  x   5
  compose                        .  .  x  x  x  x  .  .  x   5
  inverse                        .  .  x  x  x  x  .  .  x   5
  transformPoint                 .  .  x  x  x  x  .  .  x   5
  transformDirection              .  .  x  x  x  x  .  .  x   5
  createFromComponents           .  .  x  x  x  x  .  .  x   5
  getRotation                    .  .  x  .  x  x  .  .  .   3
  getScale                       .  .  .  .  x  x  .  .  .   2
  getTranslation                 .  .  x  .  x  x  .  .  x   4
  interpolate                    .  .  .  .  x  x  .  .  .   2
  affineInverse                  .  .  .  .  x  x  .  .  x   3
```

_Notes: Entries marked with `_` may appear in additional libraries under different naming or as part of a different abstraction. Counts are conservative -- only explicit, documented API surface is counted.\*

---

## Part 5: Key Patterns Observed Across Libraries

### 1. Validation Tiers

- **Box2D**: `b2Normalize` (asserts) vs `b2NormalizeChecked` (returns zero on failure)
- **Godot**: No distinct tiers; uses `is_zero_approx` guard functions
- **Unity**: Generally no safe variants; assumes valid input
- **Chipmunk2D**: `cpvnormalize` vs `cpvnormalize_safe`
- **lenguados pattern**: Three tiers (`op`, `opSafe`, `opUnchecked`) is the most comprehensive approach

### 2. Out-Parameter Pattern

- **gl-matrix**: All functions take `out` as first parameter
- **Box2D v3**: Returns by value (C struct)
- **Eigen**: Returns by value; in-place variants available
- **lenguados pattern**: `out` as last optional parameter -- a good middle ground

### 3. Rotation Representation

- **Box2D**: cos/sin pair (b2Rot) -- most efficient for physics
- **Chipmunk2D**: Complex number (cpVect used as rotation)
- **Eigen**: Rotation2D wrapping angle, with toRotationMatrix
- **Unity/Godot**: Angle as raw float or Matrix
- **lenguados**: Both Rotation2 (cos/sin) and Complex -- comprehensive

### 4. CS-Variant Pattern (pre-computed cos/sin)

- **Box2D**: Core design; b2Rot stores {c, s} to avoid recomputing
- **Chipmunk2D**: cpvrotate uses complex multiply (equivalent)
- **lenguados**: `*CS` suffix methods -- unique to lenguados, well-justified for hot paths

### 5. Deterministic Math

- **Box2D v3**: Explicit `b2ComputeCosSin` for cross-platform determinism
- **lenguados**: fdlibm-based deterministic kernels -- similar philosophy, more complete

---

_End of Comprehensive Reference Catalog_
