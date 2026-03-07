## ADDED Requirements

### Requirement: Complex.pow zero base with negative exponent

`Complex.pow(z, n)` where `z` has zero magnitude and `n < 0` SHALL throw a `RangeError` in the strict variant instead of producing `Complex(Infinity, NaN)`. The safe variant `Complex.powSafe` SHALL return `Complex(0, 0)` as the fallback. The unchecked variant has no obligation.

#### Scenario: Strict pow of zero to negative exponent throws

- **GIVEN** `z = Complex(0, 0)` and `exponent = -1`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating that zero cannot be raised to a negative exponent

#### Scenario: Strict pow of zero to negative fractional exponent throws

- **GIVEN** `z = Complex(0, 0)` and `exponent = -0.5`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: Safe pow of zero to negative exponent returns fallback

- **GIVEN** `z = Complex(0, 0)` and `exponent = -2`
- **WHEN** `Complex.powSafe(z, exponent)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (safe fallback, not `Complex(Infinity, NaN)`)

#### Scenario: Pow of zero to positive exponent is unchanged

- **GIVEN** `z = Complex(0, 0)` and `exponent = 2`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (existing behavior preserved)

---

### Requirement: Complex.slerp zero-magnitude guard

`Complex.slerp` SHALL check for near-zero magnitude inputs and fall back to linear interpolation (`Complex.lerp`) when either input has magnitude below `EPSILON`, matching the guard pattern established by `Vector2.slerp`. Without this guard, zero-magnitude inputs produce `NaN` results via `Complex.argument` on a zero-magnitude complex number.

#### Scenario: Slerp with zero-magnitude first argument falls back to lerp

- **GIVEN** `a = Complex(0, 0)` and `b = Complex(3, 4)` and `t = 0.5`
- **WHEN** `Complex.slerp(a, b, t)` is called
- **THEN** the result SHALL equal `Complex.lerp(a, b, 0.5)`, which is `Complex(1.5, 2)`

#### Scenario: Slerp with zero-magnitude second argument falls back to lerp

- **GIVEN** `a = Complex(1, 0)` and `b = Complex(0, 0)` and `t = 0.5`
- **WHEN** `Complex.slerp(a, b, t)` is called
- **THEN** the result SHALL equal `Complex.lerp(a, b, 0.5)`, which is `Complex(0.5, 0)`

#### Scenario: Slerp with both zero-magnitude arguments falls back to lerp

- **GIVEN** `a = Complex(0, 0)` and `b = Complex(0, 0)` and `t = 0.5`
- **WHEN** `Complex.slerp(a, b, t)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (not `Complex(NaN, NaN)`)

#### Scenario: Slerp with non-zero magnitudes is unchanged

- **GIVEN** `a = Complex(1, 0)` and `b = Complex(0, 1)` and `t = 0.5`
- **WHEN** `Complex.slerp(a, b, t)` is called
- **THEN** the result SHALL interpolate magnitude and angle as before (existing behavior preserved)

---

### Requirement: Complex.lerp JSDoc accuracy

The JSDoc for `Complex.lerp` (both static and instance) SHALL be corrected from `@param t - Interpolation factor [0, 1], clamped` to `@param t - Interpolation factor (not clamped, allows extrapolation)`. The `lerpClamped` variant is the one that clamps `t`; the base `lerp` does not clamp.

#### Scenario: Complex.lerp does not clamp t above 1

- **GIVEN** `a = Complex(0, 0)` and `b = Complex(2, 4)` and `t = 2.0`
- **WHEN** `Complex.lerp(a, b, t)` is called
- **THEN** the result SHALL be `Complex(4, 8)` (extrapolated, not clamped to `Complex(2, 4)`)

#### Scenario: Complex.lerp does not clamp t below 0

- **GIVEN** `a = Complex(2, 4)` and `b = Complex(4, 8)` and `t = -1.0`
- **WHEN** `Complex.lerp(a, b, t)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (extrapolated, not clamped to `Complex(2, 4)`)

#### Scenario: JSDoc @param t accurately describes behavior

- **GIVEN** the static `Complex.lerp` method
- **WHEN** the JSDoc is inspected
- **THEN** `@param t` SHALL read `Interpolation factor (not clamped, allows extrapolation)` and SHALL NOT contain the word "clamped"

#### Scenario: Instance lerp JSDoc matches static

- **GIVEN** the instance `complex.lerp(other, t)` method
- **WHEN** the JSDoc is inspected
- **THEN** `@param t` SHALL match the static method's corrected documentation

---

### Requirement: Rotation2.fromComplex @throws removal

The JSDoc for `Rotation2.fromComplex` SHALL remove the `@throws {RangeError} If the complex number has zero magnitude` annotation. The method calls `normalize()` internally, which delegates to `normalizeComponents()`, which returns identity `{ cos: 1, sin: 0 }` for zero-magnitude inputs. The method never throws.

#### Scenario: fromComplex with zero-magnitude complex returns identity

- **GIVEN** `z = Complex(0, 0)`
- **WHEN** `Rotation2.fromComplex(z)` is called
- **THEN** the result SHALL be `Rotation2(1, 0)` (identity rotation, not a thrown `RangeError`)

#### Scenario: JSDoc does not declare @throws

- **GIVEN** the `Rotation2.fromComplex` method
- **WHEN** the JSDoc is inspected
- **THEN** there SHALL be no `@throws` annotation
- **AND** the `@remarks` or description SHALL note that zero-magnitude inputs produce the identity rotation

---

### Requirement: Matrix2/Matrix3 column membership documentation

The class-level documentation headers for `Matrix2` and `Matrix3` SHALL correctly reflect column membership using the `m[column][row]` naming convention. Column 0 contains elements `m00, m01` (for Matrix2) and `m00, m01, m02` (for Matrix3), NOT `m00, m10` as currently documented. This is confirmed by `getColumn(0)` returning `[m00, m01]` and `[m00, m01, m02]` respectively.

#### Scenario: Matrix2 doc header column layout is correct

- **GIVEN** the `Matrix2` class documentation
- **WHEN** the column-major memory layout description is inspected
- **THEN** Column 0 SHALL list `m00, m01` and Column 1 SHALL list `m10, m11`

#### Scenario: Matrix3 doc header column layout is correct

- **GIVEN** the `Matrix3` class documentation
- **WHEN** the column-major memory layout description is inspected
- **THEN** Column 0 SHALL list `m00, m01, m02`, Column 1 SHALL list `m10, m11, m12`, and Column 2 SHALL list `m20, m21, m22`

#### Scenario: Documentation matches getColumn behavior

- **GIVEN** `m = Matrix3.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9)`
- **WHEN** `m.getColumn(0)` is called
- **THEN** the result SHALL match the elements listed under "Column 0" in the class documentation

---

### Requirement: Matrix3.ortho zero-width/height guard with triality

`Matrix3.ortho` SHALL validate that `width = right - left` and `height = top - bottom` are not near zero before dividing. The strict variant SHALL throw `RangeError`. The safe variant `Matrix3.orthoSafe` SHALL return the identity matrix. The unchecked variant `Matrix3.orthoUnchecked` SHALL skip validation.

#### Scenario: Strict ortho with zero width throws

- **GIVEN** `left = 5`, `right = 5`, `bottom = 0`, `top = 10`
- **WHEN** `Matrix3.ortho(left, right, bottom, top)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating zero width

#### Scenario: Strict ortho with zero height throws

- **GIVEN** `left = 0`, `right = 10`, `bottom = 5`, `top = 5`
- **WHEN** `Matrix3.ortho(left, right, bottom, top)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating zero height

#### Scenario: Safe ortho with zero width returns identity

- **GIVEN** `left = 5`, `right = 5`, `bottom = 0`, `top = 10`
- **WHEN** `Matrix3.orthoSafe(left, right, bottom, top)` is called
- **THEN** the result SHALL be `Matrix3.IDENTITY`

#### Scenario: Ortho with valid dimensions is unchanged

- **GIVEN** `left = -1`, `right = 1`, `bottom = -1`, `top = 1`
- **WHEN** `Matrix3.ortho(left, right, bottom, top)` is called
- **THEN** the result SHALL be the standard orthographic projection matrix (existing behavior preserved)

---

### Requirement: Matrix3.isOrthogonal affine matrix documentation and alternative

`Matrix3.isOrthogonal` checks all three columns of the full 3x3 matrix for unit length and mutual orthogonality. For 2D affine matrices (rotation + translation), the third column `[tx, ty, 1]` is never unit length when `tx` or `ty` is nonzero, so `isOrthogonal` correctly returns `false` for valid rotation+translation transforms. This behavior SHALL be documented prominently. A new method `isLinearPartOrthogonal` SHALL be added that checks only the upper-left 2x2 submatrix (columns 0 and 1, rows 0 and 1).

#### Scenario: isOrthogonal returns false for rotation+translation

- **GIVEN** a matrix `m = Matrix3.fromRotation(PI / 4)` then translated by `(10, 20)`
- **WHEN** `Matrix3.isOrthogonal(m)` is called
- **THEN** the result SHALL be `false` (because column 2 is `[10, 20, 1]`, not unit length)

#### Scenario: isLinearPartOrthogonal returns true for rotation+translation

- **GIVEN** a matrix `m = Matrix3.fromRotation(PI / 4)` then translated by `(10, 20)`
- **WHEN** `Matrix3.isLinearPartOrthogonal(m)` is called
- **THEN** the result SHALL be `true` (the upper-left 2x2 is a valid rotation)

#### Scenario: isLinearPartOrthogonal returns false for shear

- **GIVEN** a matrix with a non-orthogonal upper-left 2x2 (e.g., shear matrix)
- **WHEN** `Matrix3.isLinearPartOrthogonal(m)` is called
- **THEN** the result SHALL be `false`

#### Scenario: isOrthogonal JSDoc documents affine limitation

- **GIVEN** the `Matrix3.isOrthogonal` method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@remarks` noting that for affine matrices (with translation), this method returns `false` even for valid rotation+translation transforms, and SHALL reference `isLinearPartOrthogonal` as the alternative

---

### Requirement: getScale vs decompose sign consistency documentation

`Matrix2.getScale()` and `Matrix3.getScale()` return positive magnitudes (computed via `hypot`), while `decompose()` adjusts `sy` by the sign of the determinant to capture reflections. This inconsistency SHALL be documented on both `getScale()` and `decompose()` with cross-references explaining the distinction.

#### Scenario: getScale returns positive for reflected matrix

- **GIVEN** `m = Matrix2.fromScale(2, -3)` (reflection in Y)
- **WHEN** `Matrix2.getScale(m)` is called
- **THEN** the result SHALL be `Vector2(2, 3)` (positive magnitudes)

#### Scenario: decompose captures reflection sign

- **GIVEN** `m = Matrix2.fromScale(2, -3)` (reflection in Y)
- **WHEN** `Matrix2.decompose(m)` is called
- **THEN** `scale` SHALL be `Vector2(2, -3)` (sign preserved via determinant)

#### Scenario: getScale JSDoc documents positive-only behavior

- **GIVEN** the `Matrix2.getScale` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL note that the returned scale components are always non-negative (magnitudes) and SHALL reference `decompose()` for sign-preserving scale extraction

#### Scenario: Matrix3 getScale vs decompose consistency

- **GIVEN** `m = Matrix3.fromScale(-2, 3)`
- **WHEN** `Matrix3.getScale(m)` returns `Vector2(2, 3)` and `Matrix3.decompose(m)` returns `scale = Vector2(-2, 3)` (or equivalent determinant-adjusted values)
- **THEN** the documentation on both methods SHALL explain this distinction

---

### Requirement: Multiply example comments transformation order

The JSDoc examples for `Matrix2.multiply` and `Matrix3.multiply` (both static and instance) SHALL use correct transformation order comments. In matrix multiplication `A * B`, the transformation `B` is applied first and `A` second. The current comments say "rotate then scale" and "translate then rotate" which describe the order `A then B`, but the actual application order is `B then A`.

#### Scenario: Matrix2.multiply static example corrected

- **GIVEN** the static `Matrix2.multiply(rot, scl)` example
- **WHEN** the inline comment is inspected
- **THEN** it SHALL read `// scale then rotate` (not `// rotate then scale`), because `scl` is applied first when the result multiplies a vector

#### Scenario: Matrix2.multiply instance example corrected

- **GIVEN** the instance `rot.multiply(scale)` example
- **WHEN** the inline comment is inspected
- **THEN** it SHALL read `// rot is now: scale then rotate` (not `// rot is now rotated then scaled`)

#### Scenario: Matrix3.multiply example corrected

- **GIVEN** the static `Matrix3.multiply(translate, rotate)` example
- **WHEN** the inline comment is inspected
- **THEN** it SHALL read `// rotate then translate` (not `// translate then rotate`), because `rotate` is applied first

---

### Requirement: Transform2.inverse SHALL correct position computation order

`Transform2.inverse` SHALL compute the inverse position as `-(S⁻¹ · R⁻¹ · t)` where `t` is the original position, `R⁻¹` is the inverse rotation, and `S⁻¹` is the inverse scale. This means: apply inverse rotation to the position first, then apply inverse scale, then negate. The current implementation incorrectly applies inverse scale first (`-(R⁻¹ · S⁻¹ · t)`), which produces wrong results for non-uniform scale transforms.

Both the static `Transform2.inverse()` and the instance `inverse()` method SHALL use the corrected order. The `inverseSafe` and `inverseUnchecked` variants SHALL also apply the same correction.

**Note:** Even with this correction, `Transform2.inverse` remains an **approximation** for non-uniform scale (see the "Transform2.inverse non-uniform scale documentation" requirement below). This fix corrects only the translation vector; the linear part is still approximate because the SRT format computes `R⁻¹ · S⁻¹` whereas the true inverse `(R · S)⁻¹ = S⁻¹ · R⁻¹` applies the operations in reverse order. These differ when `scale.x ≠ scale.y`.

#### Scenario: Inverse position computed with correct order for non-uniform scale

- **GIVEN** `t = Transform2(position=(2, 0), rotation=PI/2, scale=(2, 1))`
- **WHEN** `inv = Transform2.inverse(t)` is computed
- **THEN** `inv.position` SHALL equal `Vector2(0, 2)` (computed as `-(S⁻¹ · R⁻¹ · (2,0))` = `-(S⁻¹ · (0,-2))` = `-(0,-2)` = `(0,2)`)
- **AND** `inv.position` SHALL NOT equal `Vector2(0, 1)` (the old incorrect value from `-(R⁻¹ · S⁻¹ · (2,0))`)

#### Scenario: Inverse with uniform scale is exact round-trip

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(3, 3))`
- **WHEN** `Transform2.multiply(t, Transform2.inverse(t))` is computed
- **THEN** the result SHALL be near-equal to `Transform2.IDENTITY` within `EPSILON`

#### Scenario: Static and instance inverse produce identical results

- **GIVEN** `t = Transform2(position=(3, -7), rotation=PI/6, scale=(2, 4))`
- **WHEN** both `Transform2.inverse(t)` and `t.inverse()` are computed
- **THEN** both results SHALL have identical position, rotation, and scale components

---

### Requirement: Transform2.inverse non-uniform scale documentation

After fixing the translation computation order, the `Transform2.inverse` JSDoc SHALL prominently document that the result is an **approximation** for non-uniform scale. The fix corrects the translation vector only; the linear part also remains approximate because the SRT format computes `R⁻¹ · S⁻¹` whereas the true inverse `(R · S)⁻¹ = S⁻¹ · R⁻¹` applies operations in reverse order, and `R⁻¹ · S⁻¹ ≠ S⁻¹ · R⁻¹` for non-uniform scale. The true inverse of a non-uniform-scale SRT transform requires shear which cannot be represented in the SRT format.

The `@remarks` SHALL explain this limitation, reference `inverseTransformPoint` as the correct method for point transformation (it applies the inverse operation directly without SRT decomposition), and reference `Matrix3.inverse` via `toMatrix3` as the exact alternative for full inverse computation.

This approach follows a common SRT limitation documented by engines such as DigitalRune. Industry leaders (Godot, Unity, Phaser) sidestep this entirely by using full matrix inverse for their transform types.

#### Scenario: Inverse documentation states approximation for non-uniform scale

- **GIVEN** the `Transform2.inverse` method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@remarks` section stating that the inverse is exact only for uniform scale (where `scale.x === scale.y`), that both the translation AND linear part are approximate for non-uniform scale, and that `inverseTransformPoint` should be used for exact point transformation

#### Scenario: Inverse documentation references Matrix3 and inverseTransformPoint alternatives

- **GIVEN** the `Transform2.inverse` JSDoc
- **WHEN** the `@remarks` section is inspected
- **THEN** it SHALL reference both `inverseTransformPoint` (for exact point transformation) and `Matrix3.inverse` via `toMatrix3` (for exact full inverse)

#### Scenario: Inverse round-trip exact for uniform scale

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(3, 3))`
- **WHEN** `Transform2.multiply(t, Transform2.inverse(t))` is computed
- **THEN** the result SHALL be near-equal to `Transform2.IDENTITY` within `EPSILON`

#### Scenario: Inverse round-trip approximate for non-uniform scale

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 5))`
- **WHEN** `Transform2.multiply(t, Transform2.inverse(t))` is computed
- **THEN** the result MAY NOT equal identity exactly (the error depends on the scale ratio)

---

### Requirement: applyMatrix3 perspective division silent collapse documentation

`Vector2.applyMatrix3` performs perspective division by the homogeneous coordinate `w`. When `w` is near zero, `divideSafe(1, w)` returns `0`, silently collapsing the point to the origin `(0, 0)`. This behavior SHALL be documented in the JSDoc `@remarks`. A strict variant `applyMatrix3Strict` MAY be added in a future change that throws `RangeError` when `w` is near zero.

#### Scenario: applyMatrix3 with near-zero w collapses to origin

- **GIVEN** a projective matrix where `w = m02 * x + m12 * y + m22` evaluates to approximately `0`
- **WHEN** `Vector2.applyMatrix3(v, matrix)` is called
- **THEN** the result SHALL be `Vector2(0, 0)` (due to `divideSafe` returning `0`)

#### Scenario: applyMatrix3 JSDoc documents collapse behavior

- **GIVEN** the `Vector2.applyMatrix3` static method
- **WHEN** the JSDoc is inspected
- **THEN** `@remarks` SHALL note that for projective matrices where the homogeneous coordinate `w` is near zero, the result silently collapses to the origin

#### Scenario: Affine matrices bypass perspective division

- **GIVEN** an affine matrix where `m02 = 0`, `m12 = 0`, `m22 = 1`
- **WHEN** `Vector2.applyMatrix3(v, matrix)` is called
- **THEN** the `w - 1` is near zero, so the fast path is taken and no perspective division occurs (existing behavior preserved)

---

### Requirement: Rotation2 constructor non-normalizing documentation

The `Rotation2` constructor directly assigns `cos` and `sin` without normalization, while `set(cos, sin)` normalizes via `normalizeComponents`. This inconsistency SHALL be documented prominently in the constructor JSDoc and in the class-level documentation. Users must be aware that `new Rotation2(2, 0)` creates a rotation with magnitude 2, which violates the unit-length invariant.

#### Scenario: Constructor does not normalize

- **GIVEN** `cos = 2` and `sin = 0`
- **WHEN** `new Rotation2(cos, sin)` is called
- **THEN** the result SHALL have `cos = 2` and `sin = 0` (NOT normalized to `cos = 1, sin = 0`)

#### Scenario: set() normalizes

- **GIVEN** a `Rotation2` instance `r`
- **WHEN** `r.set(2, 0)` is called
- **THEN** the result SHALL have `cos = 1` and `sin = 0` (normalized)

#### Scenario: Constructor JSDoc documents non-normalizing behavior

- **GIVEN** the `Rotation2` constructor
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@remarks` warning that the constructor does NOT normalize and that callers must provide unit-length `(cos, sin)` pairs, or use `Rotation2.fromAngle()` or `set()` for automatic normalization

---

### Requirement: Rotation2.multiply drift renormalization guidance

The `Rotation2` class-level documentation SHALL include guidance on periodic renormalization after repeated `multiply` compositions. In long-running physics simulations, floating-point drift causes the cos/sin pair to deviate from unit length, producing scaling artifacts. The documentation SHALL recommend calling `normalize()` periodically (N = 60–120 frames is a practical heuristic for real-time applications at 60 fps; the exact interval depends on the required angular precision and the magnitude of per-frame rotations), referencing Box2D's pattern of renormalizing `b2Rot` periodically (see `b2Body.cpp` `SynchronizeTransform`, Erin Catto GDC 2015).

#### Scenario: Class-level docs include drift guidance

- **GIVEN** the `Rotation2` class documentation
- **WHEN** the `@remarks` section is inspected
- **THEN** it SHALL contain a paragraph about numerical drift from repeated composition and recommend periodic `normalize()` calls

#### Scenario: multiply JSDoc cross-references drift guidance

- **GIVEN** the `Rotation2.multiply` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@see` reference to the class-level drift guidance or a `@remarks` note about drift for long sequences

---

### Requirement: Vector2 instance limit missing lengthSq > 0 guard

The instance method `Vector2.prototype.limit(maxLength)` SHALL include the `lengthSq > 0` guard that the static `Vector2.limit(v, maxLength)` already has. Without this guard, a zero-length vector with `maxLength > 0` evaluates `lengthSq > maxLength * maxLength` as `0 > positive` which is `false`, so the bug is harmless in this direction. However, when `maxLength = 0`, the instance method attempts `0 / sqrtSafe(0)` which produces `NaN`, while the static method's `lengthSq > 0` guard prevents this.

#### Scenario: Instance limit with zero vector and zero maxLength

- **GIVEN** `v = Vector2(0, 0)` and `maxLength = 0`
- **WHEN** `v.limit(maxLength)` is called
- **THEN** the result SHALL be `Vector2(0, 0)` (not `Vector2(NaN, NaN)`)

#### Scenario: Instance limit matches static behavior

- **GIVEN** `v = Vector2(3, 4)` and `maxLength = 2.5`
- **WHEN** `v.limit(maxLength)` is called
- **THEN** the result SHALL be identical to `Vector2.limit(Vector2(3, 4), 2.5)`

#### Scenario: Instance limit with zero vector and positive maxLength

- **GIVEN** `v = Vector2(0, 0)` and `maxLength = 5`
- **WHEN** `v.limit(maxLength)` is called
- **THEN** the result SHALL be `Vector2(0, 0)` (unchanged, already within limit)

---

### Requirement: Orphaned JSDoc blocks removal in Matrix2 and Matrix3

Matrix2 has orphaned JSDoc blocks for `nearEquals` at lines 1169-1176 (static) and 2780-2785 (instance) that are detached from their methods, sitting immediately before the `exactEquals` JSDoc. Matrix3 has the same pattern at lines 1370-1373 (static) and 3747-3756 (instance). These orphaned blocks SHALL be removed or reattached to their correct methods.

#### Scenario: Matrix2 static nearEquals JSDoc is attached to nearEquals

- **GIVEN** the `Matrix2` source file
- **WHEN** the `nearEquals` static method is inspected
- **THEN** there SHALL be exactly one JSDoc block directly preceding the method declaration, and no orphaned JSDoc block before `exactEquals`

#### Scenario: Matrix2 instance nearEquals JSDoc is attached to nearEquals

- **GIVEN** the `Matrix2` source file
- **WHEN** the instance `nearEquals` method is inspected
- **THEN** there SHALL be exactly one JSDoc block directly preceding the method declaration, and no orphaned JSDoc block before the instance `exactEquals`

#### Scenario: Matrix3 static and instance JSDoc blocks are clean

- **GIVEN** the `Matrix3` source file
- **WHEN** the `nearEquals` and `exactEquals` methods (both static and instance) are inspected
- **THEN** each method SHALL have exactly one JSDoc block directly preceding it, with no orphaned blocks

---

### Requirement: Matrix lerp rotation documentation

The `Matrix2.lerp` and `Matrix3.lerp` methods perform component-wise linear interpolation. When applied to rotation matrices, component-wise lerp does NOT produce valid rotation matrices (the result is not orthogonal and may have a determinant other than 1). This limitation SHALL be documented in the JSDoc `@remarks` for both methods.

#### Scenario: Matrix2.lerp JSDoc documents rotation limitation

- **GIVEN** the `Matrix2.lerp` static method
- **WHEN** the JSDoc is inspected
- **THEN** `@remarks` SHALL note that component-wise lerp between rotation matrices does not produce valid rotation matrices, and SHALL reference `Rotation2.lerp` or `Rotation2.slerp` as correct alternatives for angle interpolation

#### Scenario: Matrix3.lerp JSDoc documents rotation limitation

- **GIVEN** the `Matrix3.lerp` static method
- **WHEN** the JSDoc is inspected
- **THEN** `@remarks` SHALL note the same limitation and reference `decompose()` + individual component interpolation as the correct approach for affine transform interpolation

#### Scenario: Lerp of two rotation matrices is not a rotation matrix

- **GIVEN** `a = Matrix2.fromRotation(0)` and `b = Matrix2.fromRotation(PI / 2)` and `t = 0.5`
- **WHEN** `Matrix2.lerp(a, b, t)` is called
- **THEN** the result SHALL NOT satisfy `Matrix2.isOrthogonal(result)` (determinant is not 1, columns are not unit length)

---

### Requirement: Transform2.toObject returns plain object for rotation

`Transform2.toObject()` SHALL return a plain object `{ cos, sin }` for the rotation field, not the `Rotation2` class instance. Currently, `position` and `scale` use `.toObject()` to produce plain objects, but `rotation: this.rotation` returns the live `Rotation2` instance, leaking a mutable reference. The rotation field SHALL use `{ cos: this.rotation.cos, sin: this.rotation.sin }` or an equivalent `Rotation2.toObject()` method.

#### Scenario: toObject returns plain rotation object

- **GIVEN** `t = new Transform2()` with `t.rotation.angle = PI / 4`
- **WHEN** `obj = t.toObject()` is called
- **THEN** `obj.rotation` SHALL be a plain object `{ cos, sin }` (not an instance of `Rotation2`)
- **AND** `obj.rotation instanceof Rotation2` SHALL be `false`
- **AND** `obj.rotation.cos` SHALL approximately equal `cos(PI / 4)`

#### Scenario: toObject rotation is a snapshot, not a live reference

- **GIVEN** `t = new Transform2()` and `obj = t.toObject()`
- **WHEN** `t.rotation.angle = PI / 2` is set after serialization
- **THEN** `obj.rotation.cos` SHALL still equal `1` (the value at serialization time, not the updated value)

#### Scenario: position and scale already use toObject

- **GIVEN** `t = new Transform2()` and `obj = t.toObject()`
- **WHEN** `obj.position` and `obj.scale` are inspected
- **THEN** both SHALL be plain objects (not `Vector2` instances), confirming that rotation is the only inconsistent field

---

### Requirement: Rotation2.NEGATIVE_QUARTER and THREE_QUARTER_TURN alias documentation

`Rotation2.NEGATIVE_QUARTER` and `Rotation2.THREE_QUARTER_TURN` are both defined as `Object.freeze(new Rotation2(0, -1))`. They represent the same rotation (270 degrees CCW = 90 degrees CW). The JSDoc for both constants SHALL document that they are aliases representing the same rotation value, and SHALL cross-reference each other.

#### Scenario: NEGATIVE_QUARTER JSDoc references THREE_QUARTER_TURN

- **GIVEN** the `Rotation2.NEGATIVE_QUARTER` constant
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@see` or `@remarks` noting that this is equivalent to `THREE_QUARTER_TURN` (both are `Rotation2(0, -1)`)

#### Scenario: THREE_QUARTER_TURN JSDoc references NEGATIVE_QUARTER

- **GIVEN** the `Rotation2.THREE_QUARTER_TURN` constant
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@see` or `@remarks` noting that this is equivalent to `NEGATIVE_QUARTER` (both are `Rotation2(0, -1)`)

#### Scenario: Both constants produce identical values

- **GIVEN** `a = Rotation2.NEGATIVE_QUARTER` and `b = Rotation2.THREE_QUARTER_TURN`
- **WHEN** their `cos` and `sin` values are compared
- **THEN** `a.cos === b.cos` and `a.sin === b.sin` SHALL both be `true` (both are `{ cos: 0, sin: -1 }`)
