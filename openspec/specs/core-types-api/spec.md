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

---

### Requirement: Matrix3 static decomposition getters

Matrix3 SHALL provide static methods `getRotation()`, `getScale()`, and `getTranslation()` that accept `ReadonlyMatrix3Like` input, enabling allocation-free decomposition without constructing a Matrix3 instance.

#### Scenario: Static getRotation extracts angle

- **WHEN** a Matrix3 is composed from `fromRotation(PI / 4)` (45-degree rotation)
- **THEN** `Matrix3.getRotation(matrix)` SHALL return a value within EPSILON of `PI / 4`

#### Scenario: Static getRotation with near-zero scale

- **WHEN** a Matrix3 has near-zero scale (columns near zero magnitude)
- **THEN** `Matrix3.getRotation(matrix)` SHALL return `0`

#### Scenario: Static getScale extracts scale vector

- **WHEN** a Matrix3 is composed from `fromScaling(new Vector2(2, 3))`
- **THEN** `Matrix3.getScale(matrix)` SHALL return a Vector2 within EPSILON of `(2, 3)`
- **AND** `Matrix3.getScale(matrix, out)` SHALL write to `out` and return it

#### Scenario: Static getTranslation extracts position

- **WHEN** a Matrix3 is composed from `fromTranslation(new Vector2(10, 20))`
- **THEN** `Matrix3.getTranslation(matrix)` SHALL return a Vector2 within EPSILON of `(10, 20)`
- **AND** `Matrix3.getTranslation(matrix, out)` SHALL write to `out` and return it

#### Scenario: Static/instance getter parity

- **WHEN** `Matrix3.getRotation(m)` and `m.getRotation()` are called on the same matrix
- **THEN** both SHALL return identical results
- **AND** same for `getScale()` and `getTranslation()`

---

### Requirement: Transform2.multiply instance allocation-free

The instance method `Transform2.multiply(other)` SHALL compute rotation composition inline without allocating intermediate objects, while producing bit-identical results to the current implementation.

#### Scenario: Multiply produces same result after optimization

- **WHEN** `Transform2.multiply(a, b)` (static) and `a.clone().multiply(b)` (instance) are called with identical inputs
- **THEN** both SHALL produce bit-identical results for position, rotation (cos, sin), and scale

#### Scenario: Multiply with identity transform

- **WHEN** `transform.multiply(Transform2.IDENTITY)` is called
- **THEN** the transform SHALL remain unchanged

---

## API Consistency Audit — Added Requirements (2026-03-20)

_Synced from delta spec: `openspec/changes/math2d-api-consistency-audit/specs/core-types-api`_

### Requirement: R-ROT-FROMMATRIX2 — Rotation2.fromMatrix2(matrix) SHALL extract rotation from Matrix2

`Rotation2.fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2` SHALL extract the rotation angle from the Matrix2 using `atan2(m01, m00)` and construct a Rotation2 via `fromAngle`. This completes the Rotation2 <-> Matrix2 round-trip conversion.

#### Scenario: WHEN fromMatrix2 is called with a pure rotation matrix THEN the rotation is extracted

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 4)`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be near-equal to `Rotation2.fromAngle(PI / 4)` within `EPSILON`

#### Scenario: WHEN fromMatrix2 is called with a scaled rotation matrix THEN rotation is still correct

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 3), Matrix2.fromScale(2, 3))`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be near-equal to `Rotation2.fromAngle(PI / 3)` within `EPSILON`

#### Scenario: WHEN fromMatrix2 is called with identity THEN identity rotation is returned

- **GIVEN** `matrix = Matrix2.IDENTITY`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be `Rotation2(1, 0)` (identity rotation, angle = 0)

#### Scenario: WHEN fromMatrix2 is called with out parameter THEN result is written to out

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 6)` and `out = new Rotation2()`
- **WHEN** `result = Rotation2.fromMatrix2(matrix, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.cos` SHALL be approximately `cos(PI / 6)`

---

### NOTE: Rotation2.slerp alias — REMOVED (Agnostic Library Review)

The original proposal to add `Rotation2.slerp` as an alias for `Rotation2.lerp` has been **removed**. For 2D rotations represented as unit complex numbers, `lerp` already performs spherical interpolation — there is no mathematical distinction. The `slerp` name imports 3D quaternion terminology into a 2D context and creates confusion about whether the two methods differ. Discoverability is better served by a `@remarks` note in `Rotation2.lerp` JSDoc stating the equivalence with slerp for users familiar with quaternion APIs.

**Action:** Add `@remarks` to `Rotation2.lerp` JSDoc: "For 2D rotations represented as unit complex numbers, lerp is equivalent to slerp (spherical linear interpolation). No separate slerp method is provided."

---

### Requirement: R-MAT2-GETROT — Matrix2.getRotation(matrix) static SHALL exist

`Matrix2.getRotation(matrix: ReadonlyMatrix2Like): number` SHALL extract the rotation angle from a Matrix2 using `atan2(m01, m00)` and return the angle in radians. This mirrors the existing `Matrix3.getRotation` API.

#### Scenario: WHEN getRotation is called on a pure rotation matrix THEN the angle is extracted

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 3)`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be approximately `PI / 3` within `EPSILON`

#### Scenario: WHEN getRotation is called on a scaled rotation THEN only rotation is returned

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 6), Matrix2.fromScale(3, 3))`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be approximately `PI / 6` within `EPSILON`

#### Scenario: WHEN getRotation is called on identity THEN angle is zero

- **GIVEN** `matrix = Matrix2.IDENTITY`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be `0`

---

### Requirement: R-MAT2-GETSCALE — Matrix2.getScale(matrix, out?) static SHALL exist

`Matrix2.getScale(matrix: ReadonlyMatrix2Like, out?: Vector2): Vector2` SHALL extract the scale from a Matrix2 by computing column magnitudes: `sx = hypot(m00, m01)`, `sy = hypot(m10, m11)`. The returned scales are always non-negative (magnitudes). This mirrors the existing `Matrix3.getScale` API.

#### Scenario: WHEN getScale is called on a pure scale matrix THEN scale is extracted

- **GIVEN** `matrix = Matrix2.fromScale(2, 3)`
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be `2` and `scale.y` SHALL be `3`

#### Scenario: WHEN getScale is called on a rotated+scaled matrix THEN magnitudes are correct

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 4), Matrix2.fromScale(2, 3))`
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be approximately `2` and `scale.y` SHALL be approximately `3` within `EPSILON`

#### Scenario: WHEN getScale is called with out parameter THEN result is written to out

- **GIVEN** `matrix = Matrix2.fromScale(5, 7)` and `out = new Vector2()`
- **WHEN** `result = Matrix2.getScale(matrix, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.x` SHALL be `5` and `out.y` SHALL be `7`

#### Scenario: WHEN getScale is called on a reflected matrix THEN scales are positive

- **GIVEN** `matrix = Matrix2.fromScale(2, -3)` (reflection in Y)
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be `2` and `scale.y` SHALL be `3` (positive magnitudes, not signed)

---

### NOTE: Vector2.moveTowards — REMOVED then RE-ADDED

The original proposal to add `Vector2.moveTowards(current, target, maxDelta, out?)` was initially **removed** as a game engine convenience. Subsequently **re-added** as part of `implement-audit-p1-p2-fixes` (2026-04-02). Full specification in `openspec/specs/audit-p2-additions/spec.md`.

---

### Requirement: R-VEC-TIERS — Vector2 SHALL have setMagnitudeUnchecked, reflectUnchecked, directionToSafe instance methods

The following instance methods SHALL be added to complete validation tier symmetry:

1. `Vector2.prototype.setMagnitudeUnchecked(length)` — sets magnitude without zero-check.
2. `Vector2.prototype.reflectUnchecked(normal)` — reflects without validating normal is unit-length.
3. `Vector2.prototype.directionToSafe(target)` — returns direction to target, returning `Vector2(0, 0)` if coincident.

#### Scenario: WHEN setMagnitudeUnchecked is called on a non-zero vector THEN magnitude is set

- **GIVEN** `v = new Vector2(3, 4)` (magnitude = 5)
- **WHEN** `v.setMagnitudeUnchecked(10)` is called
- **THEN** `v` SHALL be `Vector2(6, 8)` (direction preserved, magnitude = 10)

#### Scenario: WHEN setMagnitudeUnchecked is called on a zero vector THEN result is NaN

- **GIVEN** `v = new Vector2(0, 0)`
- **WHEN** `v.setMagnitudeUnchecked(5)` is called
- **THEN** the function SHALL NOT throw (unchecked variant)
- **AND** the result MAY contain `NaN` components

#### Scenario: WHEN reflectUnchecked is called THEN no validation occurs on normal

- **GIVEN** `v = new Vector2(1, -1)` and `normal = { x: 0, y: 1 }`
- **WHEN** `v.reflectUnchecked(normal)` is called
- **THEN** `v` SHALL be `Vector2(1, 1)` (reflected about Y-axis normal)
- **AND** no `isUnit(normal)` check SHALL be performed

#### Scenario: WHEN directionToSafe is called with coincident points THEN zero vector is returned

- **GIVEN** `v = new Vector2(5, 5)` and `target = { x: 5, y: 5 }`
- **WHEN** `v.directionToSafe(target)` is called
- **THEN** `v` SHALL be `Vector2(0, 0)` (safe fallback for zero-distance)

#### Scenario: WHEN directionToSafe is called with distinct points THEN direction is computed

- **GIVEN** `v = new Vector2(0, 0)` and `target = { x: 3, y: 4 }`
- **WHEN** `v.directionToSafe(target)` is called
- **THEN** `v` SHALL be `Vector2(0.6, 0.8)` (normalized direction)

---

### Requirement: R-CX-DIVSCALAR — Complex.divideScalar/Safe/Unchecked SHALL exist

`Complex.divideScalar(z: ReadonlyComplexLike, s: number, out?: Complex): Complex` SHALL divide both real and imaginary components by the scalar `s`. Three tiers SHALL exist following the exact pattern of `Vector2.divideScalar`:

1. `divideScalar` — throws `RangeError` when `s` is near zero.
2. `divideScalarSafe` — returns `Complex(0, 0)` when `s` is near zero.
3. `divideScalarUnchecked` — no validation.

Instance counterparts SHALL also exist.

#### Scenario: WHEN divideScalar is called with valid scalar THEN components are divided

- **GIVEN** `z = Complex(6, 8)` and `s = 2`
- **WHEN** `Complex.divideScalar(z, s)` is called
- **THEN** the result SHALL be `Complex(3, 4)`

#### Scenario: WHEN divideScalar is called with zero scalar THEN it throws

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalar(z, s)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN divideScalarSafe is called with zero scalar THEN fallback is returned

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalarSafe(z, s)` is called
- **THEN** the result SHALL be `Complex(0, 0)`

#### Scenario: WHEN divideScalarUnchecked is called with zero scalar THEN no throw

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalarUnchecked(z, s)` is called
- **THEN** the function SHALL NOT throw (result is `Complex(Infinity, Infinity)` or similar)

#### Scenario: WHEN instance divideScalar is called THEN it mutates this

- **GIVEN** `z = new Complex(10, 20)`
- **WHEN** `z.divideScalar(5)` is called
- **THEN** `z` SHALL be `Complex(2, 4)` and the return value SHALL be `z`

---

### Requirement: R-CX-FROMVEC2 — Complex.fromVector2(v, out?) static factory SHALL exist

`Complex.fromVector2(v: ReadonlyVector2Like, out?: Complex): Complex` SHALL create a Complex number from a Vector2, mapping `v.x` to real and `v.y` to imaginary. This completes the bidirectional conversion alongside `Vector2.fromComplex` (or equivalent).

#### Scenario: WHEN fromVector2 is called THEN x maps to real and y maps to imaginary

- **GIVEN** `v = { x: 3, y: 4 }`
- **WHEN** `Complex.fromVector2(v)` is called
- **THEN** the result SHALL be `Complex(3, 4)` (`real = 3`, `imag = 4`)

#### Scenario: WHEN fromVector2 is called with zero vector THEN zero complex is returned

- **GIVEN** `v = { x: 0, y: 0 }`
- **WHEN** `Complex.fromVector2(v)` is called
- **THEN** the result SHALL be `Complex(0, 0)`

#### Scenario: WHEN fromVector2 is called with out parameter THEN result is written to out

- **GIVEN** `v = { x: 1, y: 2 }` and `out = new Complex()`
- **WHEN** `result = Complex.fromVector2(v, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.real` SHALL be `1` and `out.imag` SHALL be `2`

---

### Requirement: R-CX-RECIP — Complex.reciprocal static and instance SHALL use identical zero-detection (magnitude)

Both the static `Complex.reciprocal(z, out?)` and the instance `Complex.prototype.reciprocal()` SHALL use `isNearZero(magnitude)` for their zero-detection guard. The instance method currently uses `magnitudeSquared`, which triggers at `|z| < sqrt(EPSILON) ~ 3.16e-6` instead of `|z| < EPSILON = 1e-10`. This discrepancy SHALL be fixed by changing the instance method to use `magnitude`.

**Note:** This requirement applies specifically to zero-detection in reciprocal. It does NOT establish a blanket ban on magnitudeSq usage. The `isUnit` check correctly uses `|magnitudeSq - 1| < EPSILON` per the ratified api-consistency-triality spec.

#### Scenario: WHEN a complex with magnitude between EPSILON and sqrt(EPSILON) is tested THEN static and instance agree

- **GIVEN** `z = Complex(5e-6, 0)` (magnitude = 5e-6, between `1e-10` and `3.16e-6`)
- **WHEN** `Complex.reciprocal(z)` (static) is called
- **THEN** the result SHALL be `Complex(200000, 0)` (reciprocal computed normally, magnitude `5e-6 > EPSILON`)
- **AND** `new Complex(5e-6, 0).reciprocal()` (instance) SHALL produce the same result

#### Scenario: WHEN a truly zero complex is tested THEN both static and instance throw

- **GIVEN** `z = Complex(0, 0)`
- **WHEN** `Complex.reciprocal(z)` is called
- **THEN** it SHALL throw `RangeError`
- **AND** `new Complex(0, 0).reciprocal()` SHALL also throw `RangeError`

#### Scenario: WHEN a near-zero complex is tested with magnitude below EPSILON THEN both detect zero

- **GIVEN** `z = Complex(5e-11, 0)` (magnitude = 5e-11 < EPSILON)
- **WHEN** `Complex.reciprocalSafe(z)` and `new Complex(5e-11, 0).reciprocalSafe()` are called
- **THEN** both SHALL return the safe fallback value

---

### Requirement: R-INT-ABS — Interval.abs() static + instance SHALL follow Moore's definition

`Interval.abs(interval: ReadonlyIntervalLike, out?: Interval): Interval` and `Interval.prototype.abs()` SHALL compute the absolute value of an interval following Moore's interval arithmetic definition:

- If `interval.min >= 0`: result is `[min, max]` (identity).
- If `interval.max <= 0`: result is `[-max, -min]` (flip and negate).
- If interval crosses zero (`min < 0 < max`): result is `[0, max(|min|, |max|)]`.

#### Scenario: WHEN abs is called on a positive interval THEN it is identity

- **GIVEN** `interval = Interval(2, 5)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN abs is called on a negative interval THEN it flips and negates

- **GIVEN** `interval = Interval(-5, -2)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN abs is called on an interval crossing zero THEN min is zero

- **GIVEN** `interval = Interval(-3, 7)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(0, 7)` (max of `|-3|=3` and `|7|=7` is `7`)

#### Scenario: WHEN abs is called on a symmetric interval THEN max is the absolute bound

- **GIVEN** `interval = Interval(-4, 4)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(0, 4)`

#### Scenario: WHEN instance abs is called THEN it mutates this

- **GIVEN** `i = new Interval(-5, -2)`
- **WHEN** `i.abs()` is called
- **THEN** `i.min` SHALL be `2` and `i.max` SHALL be `5`
- **AND** the return value SHALL be the same reference as `i`

---

### Requirement: R-INT-UNSORTED — Interval.fromUnsorted(a, b) SHALL create with min/max ordering

`Interval.fromUnsorted(a: number, b: number, out?: Interval): Interval` SHALL create an interval from two values that may not be in order, using `Math.min(a, b)` for `min` and `Math.max(a, b)` for `max`.

#### Scenario: WHEN fromUnsorted is called with ordered values THEN result is correct

- **GIVEN** `a = 2` and `b = 5`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN fromUnsorted is called with reversed values THEN result is ordered

- **GIVEN** `a = 5` and `b = 2`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN fromUnsorted is called with equal values THEN degenerate interval is created

- **GIVEN** `a = 3` and `b = 3`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(3, 3)`

#### Scenario: WHEN fromUnsorted is called with out parameter THEN result is written to out

- **GIVEN** `a = 10` and `b = -5` and `out = new Interval()`
- **WHEN** `result = Interval.fromUnsorted(a, b, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.min` SHALL be `-5` and `out.max` SHALL be `10`

---

### Requirement: R-INT-CENTER — Interval.center() SHALL use overflow-safe formula min + (max-min)\*0.5

`Interval.center()` (both static and instance) SHALL compute the center using `min + (max - min) * 0.5` instead of `(min + max) * 0.5`. The naive `(min + max) * 0.5` overflows to `Infinity` when both `min` and `max` are large positive or large negative values (e.g., `min = 1e308`, `max = 1e308`).

#### Scenario: WHEN center is called on a normal interval THEN correct midpoint is returned

- **GIVEN** `interval = Interval(2, 8)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `5`

#### Scenario: WHEN center is called on an interval with extreme values THEN no overflow occurs

- **GIVEN** `interval = Interval(1e308, 1.5e308)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `1.25e308` (not `Infinity`)

#### Scenario: WHEN center is called on a degenerate interval THEN min is returned

- **GIVEN** `interval = Interval(3, 3)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `3`

#### Scenario: WHEN instance center is called THEN it matches static

- **GIVEN** `i = new Interval(0, 10)`
- **WHEN** `i.center()` is called
- **THEN** the result SHALL be `5` (same as `Interval.center(i)`)

---

### Requirement: R-INT-HULL — Interval.hull() array form SHALL use instanceof check for out param

When `Interval.hull(array, second?)` is called with an array as the first argument, the `second` parameter serves as the `out` parameter. The implementation SHALL use `instanceof Interval` (or equivalent type guard) to distinguish between `second` being an `out` parameter vs. a value to include in the hull computation. This prevents the ambiguity where a plain `IntervalLike` object passed as `second` could be misinterpreted.

#### Scenario: WHEN hull receives array and Interval instance as second THEN second is out

- **GIVEN** `values = [1, 5, 3]` and `out = new Interval()`
- **WHEN** `Interval.hull(values, out)` is called
- **THEN** `out` SHALL be mutated to `Interval(1, 5)` and the return value SHALL be `out`

#### Scenario: WHEN hull receives array without second THEN new Interval is created

- **GIVEN** `values = [2, 8, 5]`
- **WHEN** `Interval.hull(values)` is called
- **THEN** the result SHALL be a new `Interval(2, 8)`

#### Scenario: WHEN hull receives two scalars THEN second is a value

- **GIVEN** `first = 3` and `second = 7`
- **WHEN** `Interval.hull(first, second)` is called
- **THEN** the result SHALL be `Interval(3, 7)`

---

### Requirement: R-T2-TRANSFORMDIR — Transform2.transformDirection/inverseTransformDirection SHALL exist

`Transform2.transformDirection(transform: ReadonlyTransform2Like, direction: ReadonlyVector2Like, out?: Vector2): Vector2` SHALL apply only the rotation component of the transform to a vector, ignoring scale and translation. This is a standard linear algebra operation: extracting and applying the orthogonal (rotational) part of an affine transform. The JSDoc SHALL explicitly state "applies rotation only, ignores scale and translation."

`Transform2.inverseTransformDirection(transform: ReadonlyTransform2Like, direction: ReadonlyVector2Like, out?: Vector2): Vector2` SHALL apply the inverse rotation.

Following the existing `*CS` convention (R4), `transformDirectionCS(cos, sin, direction, out?)` and `inverseTransformDirectionCS(cos, sin, direction, out?)` static variants SHALL also exist, accepting pre-computed cos/sin values for use in performance-critical code paths.

Instance counterparts SHALL also exist for all variants.

#### Scenario: WHEN transformDirection is called THEN only the rotation component is applied

- **GIVEN** `transform = Transform2(position=(10, 20), rotation=PI/2, scale=(2, 3))`
- **WHEN** `Transform2.transformDirection(transform, { x: 1, y: 0 })` is called
- **THEN** the result SHALL be approximately `Vector2(0, 1)` (rotated 90 degrees; scale and translation are ignored)

#### Scenario: WHEN inverseTransformDirection is called THEN inverse rotation is applied

- **GIVEN** `transform = Transform2(position=(10, 20), rotation=PI/2, scale=(2, 3))`
- **WHEN** `Transform2.inverseTransformDirection(transform, { x: 0, y: 1 })` is called
- **THEN** the result SHALL be approximately `Vector2(1, 0)` (inverse rotation of 90 degrees)

#### Scenario: WHEN transformDirection round-trips THEN original direction is recovered

- **GIVEN** `transform` with any rotation and `dir = { x: 0.6, y: 0.8 }`
- **WHEN** `recovered = Transform2.inverseTransformDirection(transform, Transform2.transformDirection(transform, dir))` is computed
- **THEN** `recovered` SHALL be near-equal to `Vector2(0.6, 0.8)` within `EPSILON`

#### Scenario: WHEN instance transformDirection is called THEN it mutates this direction argument

- **GIVEN** `t = new Transform2()` with `rotation = PI/4` and `v = new Vector2(1, 0)`
- **WHEN** `t.transformDirection(v)` is called
- **THEN** `v` SHALL be approximately `Vector2(cos(PI/4), sin(PI/4))`

---

### Requirement: R-T2-PREMULTIPLY — Transform2.premultiply(other) SHALL compute other \* this

`Transform2.prototype.premultiply(other: ReadonlyTransform2Like): this` SHALL compute `this = other * this` (premultiplication). This is the reverse of `multiply(other)` which computes `this = this * other`. Since transform composition is non-commutative, both multiplication orders are required for algebraic completeness.

The implementation SHALL delegate to `Transform2.multiply(other, this, this)`.

#### Scenario: WHEN premultiply is called THEN other is applied first

- **GIVEN** `child = Transform2(position=(1, 0), rotation=0, scale=(1, 1))`
- **AND** `parent = Transform2(position=(0, 0), rotation=PI/2, scale=(1, 1))`
- **WHEN** `child.premultiply(parent)` is called
- **THEN** `child` SHALL represent the composition `parent * child`
- **AND** the result SHALL be different from `child.multiply(parent)` (which computes `child * parent`)

#### Scenario: WHEN premultiply is called THEN it returns this for chaining

- **GIVEN** `t = new Transform2()`
- **WHEN** `result = t.premultiply(Transform2.IDENTITY)` is called
- **THEN** `result` SHALL be the same reference as `t`

#### Scenario: WHEN premultiply with identity THEN transform is unchanged

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `t.premultiply(Transform2.IDENTITY)` is called
- **THEN** `t` SHALL be unchanged (identity is the neutral element for multiplication)

---

## Changes from math2d-comprehensive-audit (2026-03-20)

## ADDED Requirements

### NOTE: Vector2.moveTowards — REVERSED then RE-ADDED

This addition was originally proposed but REVERSED during adversarial review. The ratified spec at `openspec/specs/core-types-api/spec.md:649` rejected `moveTowards` as "a game engine convenience that composes existing mathematical primitives." Subsequently RE-ADDED as part of `implement-audit-p1-p2-fixes` (2026-04-02). Full specification in `openspec/specs/audit-p2-additions/spec.md`.

---

### Requirement: Matrix3.fromReflection static factory

`Matrix3.fromReflection(normal, out?)` SHALL create a 3x3 reflection matrix about a line passing through the origin with the given normal vector. The normal SHALL be a `ReadonlyVector2Like`. The reflection matrix for normal `(nx, ny)` is the Householder reflector `I - 2nn^T`:

```
| 1 - 2*nx*nx   -2*nx*ny      0 |
| -2*nx*ny       1 - 2*ny*ny   0 |
| 0              0              1 |
```

The normal is assumed to be unit length (no normalization performed). The Householder reflector is a fundamental linear algebra operation found in every numerical methods textbook.

#### Scenario: Reflection about Y-axis (normal = (1, 0))

- **GIVEN** `normal = { x: 1, y: 0 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** the result SHALL be a matrix that negates x-coordinates: `m00 = -1, m01 = 0, m10 = 0, m11 = 1`

#### Scenario: Reflection about X-axis (normal = (0, 1))

- **GIVEN** `normal = { x: 0, y: 1 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** the result SHALL be a matrix that negates y-coordinates: `m00 = 1, m01 = 0, m10 = 0, m11 = -1`

#### Scenario: Reflection about diagonal (normal = (√2/2, √2/2))

- **GIVEN** `normal = { x: Math.SQRT1_2, y: Math.SQRT1_2 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** `m00` and `m11` SHALL be approximately `0`, `m01` and `m10` SHALL be approximately `-1`
- **AND** applying this matrix to `Vector2(1, 0)` SHALL yield approximately `Vector2(0, -1)`

#### Scenario: out parameter avoids allocation

- **GIVEN** `normal = { x: 1, y: 0 }` and `out = new Matrix3()`
- **WHEN** `Matrix3.fromReflection(normal, out)` is called
- **THEN** the return value SHALL be `out` (same reference)

---

### NOTE: Complex.fromAngle — DEFERRED

This addition is DEFERRED pending further review. It is a trivial one-argument alias for `Complex.fromPolar(1, angle)`. The discoverability benefit may not outweigh the API surface cost.

---

### Requirement: Transform2 Symbol.iterator implementation

`Transform2` SHALL implement `Symbol.iterator` yielding its numeric components in the order `[position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y]`. This completes the pattern implemented by all other 6 core types (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3).

Note: The yielded components represent semantically heterogeneous quantities (position, rotation, scale). This iterator is primarily useful for serialization and array-buffer interop. The same heterogeneity concern applies to Matrix3 (which mixes rotation, translation, and scale) and it already has an iterator.

#### Scenario: Iterating Transform2 yields 6 numeric components

- **GIVEN** `t = new Transform2({ x: 1, y: 2 }, { cos: 0, sin: 1 }, { x: 3, y: 4 })`
- **WHEN** `[...t]` is evaluated
- **THEN** the result SHALL be `[1, 2, 0, 1, 3, 4]`

#### Scenario: Destructuring Transform2 components

- **GIVEN** `t = Transform2.IDENTITY`
- **WHEN** `const [px, py, rc, rs, sx, sy] = t` is evaluated
- **THEN** `px === 0, py === 0, rc === 1, rs === 0, sx === 1, sy === 1`

---

## MODIFIED Requirements

### NOTE: Vector2.isParallel/isPerpendicular tolerance normalization — DEFERRED

This modification is DEFERRED. The adversarial review found it violates the audit's own constraint of "ZERO behavioral changes to any existing public API that returns correct results." The current absolute tolerance is a mathematically valid (area-based) definition. The proposed normalized tolerance is a different (angle-based) definition. This requires a separate proposal that explicitly acknowledges the behavioral change.

---

### Requirement: Complex.smoothStep and Interval.smoothStep instance — remove redundant saturate

The instance methods `Complex.prototype.smoothStep` and `Interval.prototype.smoothStep` SHALL remove the internal call to `saturate(t)` before passing to `smoothStep(0, 1, t)`, since `smoothStep` already clamps `t` to [0, 1] internally via `saturate((x - edge0) / range)`.

Additionally, `Interval.smoothStep` static (L873) has the same redundancy and SHALL also be fixed.

Affected locations:

- `complex.ts:2431` — instance: `const clamped = saturate(t);` → remove, pass `t` directly
- `interval.ts:873` — static: `smoothStep(0, 1, saturate(t))` → `smoothStep(0, 1, t)`
- `interval.ts:2049` — instance: `smoothStep(0, 1, saturate(t))` → `smoothStep(0, 1, t)`

Note: The Complex static version (L869) and Vector2 versions are already correct (no redundant saturate).

#### Scenario: Complex instance smoothStep produces correct results

- **GIVEN** `z = Complex(0.5, 0)` and `edge0 = Complex(0, 0)` and `edge1 = Complex(1, 0)`
- **WHEN** `z.smoothStep(edge0, edge1)` is called
- **THEN** the result SHALL be identical to before (no behavioral change, just redundant code removal)

#### Scenario: Interval static smoothStep produces correct results

- **GIVEN** `a = Interval(0, 10)` and `b = Interval(20, 30)` and `t = 0.5`
- **WHEN** `Interval.smoothStep(a, b, t)` is called
- **THEN** the result SHALL be identical to before

---

### Requirement: Rotation2.negated deprecation

The `Rotation2.prototype.negated` getter SHALL be marked `@deprecated` with message "Use `inversed` instead — negated is an exact duplicate of inversed for unit rotations." The getter currently returns `{ cos, -sin }` which is identical to `inversed`. Confirmed byte-identical in source at L1551-1553 and L1608-1610.

#### Scenario: negated is deprecated but still functional

- **GIVEN** `r = Rotation2.fromAngle(Math.PI / 4)`
- **WHEN** `r.negated` is accessed
- **THEN** the result SHALL equal `r.inversed` (same cos, same sin values)
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Rotation2 frozen constants typing

Frozen constants `Rotation2.IDENTITY`, `Rotation2.HALF_PI`, `Rotation2.PI`, `Rotation2.NEGATIVE_HALF_PI` SHALL be typed as `ReadonlyRotation2` instead of `ReadonlyRotation2Like`, matching the pattern used by Vector2, Complex, Matrix2, Matrix3, and Interval frozen constants. This is a non-breaking change (widening the type).

#### Scenario: Frozen constants expose full Rotation2 methods

- **GIVEN** `r = Rotation2.IDENTITY`
- **WHEN** `r.angle` is accessed
- **THEN** it SHALL compile and return `0` (ReadonlyRotation2 exposes computed properties, ReadonlyRotation2Like does not)

---

## REMOVED Requirements

### Requirement: Vector2 non-standard constants

The following Vector2 constants SHALL be marked `@deprecated`:

- `EPSILON_VECTOR` — Use `Object.freeze(new Vector2(EPSILON, EPSILON))` as a locally defined constant instead
- `NEGATIVE_ONE` — Use `new Vector2(-1, -1)` instead
- `UNIT_DIAGONAL` — Use `new Vector2(Math.SQRT1_2, Math.SQRT1_2)` instead
- `NEGATIVE_UNIT_DIAGONAL` — Use `new Vector2(-Math.SQRT1_2, -Math.SQRT1_2)` instead

**Reason:** Zero internal usage, zero precedent in any of the 10+ reference libraries audited (including Unity, Godot, Three.js, gl-matrix, Box2D which provide directional constants but NOT these specific ones).
**Migration:** Replace with inline construction as documented in each deprecation tag.

#### Scenario: Deprecated constants still return correct values

- **WHEN** `Vector2.EPSILON_VECTOR` is accessed
- **THEN** it SHALL still return `Vector2(EPSILON, EPSILON)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Complex non-standard constants

The following Complex constants SHALL be marked `@deprecated`:

- `EPSILON_COMPLEX` — Use `Object.freeze(new Complex(EPSILON, EPSILON))` as a locally defined constant instead
- `SQRT2` — Use `new Complex(Math.SQRT2, 0)` instead
- `SQRT2_INV` — Use `new Complex(Math.SQRT1_2, 0)` instead
- `PI` — Use `new Complex(Math.PI, 0)` instead
- `E` — Use `new Complex(Math.E, 0)` instead

**Reason:** Zero internal usage, zero precedent. C++ `std::complex`, NumPy `cmath`, and no other complex number library provides real constants as complex-typed objects.
**Migration:** Replace with inline construction.

#### Scenario: Deprecated constants still return correct values

- **WHEN** `Complex.SQRT2` is accessed
- **THEN** it SHALL still return `Complex(Math.SQRT2, 0)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix2 non-standard constants

The following Matrix2 constants SHALL be marked `@deprecated`:

- `ONE` — Use `Matrix2.fromScalar(1)` instead
- `EPSILON_MATRIX` — No meaningful use case; construct manually if needed
- `SCALE_2` — Use `Matrix2.fromScale(2, 2)` instead
- `SCALE_HALF` — Use `Matrix2.fromScale(0.5, 0.5)` instead

**Reason:** Zero internal usage, zero precedent. Matrix libraries provide Identity, Zero, and construction factories — not arbitrary scale presets.
**Migration:** Replace with factory calls.

#### Scenario: Deprecated constants still function

- **WHEN** `Matrix2.ONE` is accessed
- **THEN** it SHALL still return a matrix with all components set to 1
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix3 non-standard constants

The following Matrix3 constants SHALL be marked `@deprecated`:

- `ONE` — Use `Matrix3.fromScalar(1)` (if available) or construct manually
- `EPSILON_MATRIX` — No meaningful use case
- `SCALE_2` — Use `Matrix3.fromScale(2, 2)` instead
- `SCALE_HALF` — Use `Matrix3.fromScale(0.5, 0.5)` instead

**Reason:** Same as Matrix2 — zero usage, zero precedent.
**Migration:** Replace with factory calls.

#### Scenario: Deprecated constants still function

- **WHEN** `Matrix3.SCALE_2` is accessed
- **THEN** it SHALL still return a 2x scale matrix
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Interval non-standard constants

The following Interval constants SHALL be marked `@deprecated`:

- `PERCENT` (`[0, 100]`) — Application-domain preset, not mathematical primitive
- `DEGREES` (`[0, 360]`) — Application-domain preset, not mathematical primitive
- `RADIANS` (`[0, 2π]`) — Application-domain preset, not mathematical primitive

**Reason:** These are application-domain ranges, not mathematical primitives. No interval arithmetic library (including Boost.Interval) provides preset ranges. Define application-level constants where needed.
**Migration:** Replace with `new Interval(0, 100)`, `new Interval(0, 360)`, `new Interval(0, 2 * Math.PI)`.

#### Scenario: Deprecated constants still function

- **WHEN** `Interval.DEGREES` is accessed
- **THEN** it SHALL still return `Interval(0, 360)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### NOTE: Scalar GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE — REVERSED

These deprecations were proposed but REVERSED during adversarial review. The ratified `performance-architecture` spec requires both constants and mandates they share a single `sqrt(5)` computation (already implemented). The prior foundations audit explicitly kept `GOLDEN_RATIO_CONJUGATE` as "computationally useful." GLM and C++20 `std::numbers::phi` also include the golden ratio.

---

### Requirement: Matrix2 component-wise operations deprecation

The following Matrix2 methods SHALL be marked `@deprecated` (both static and instance):

- `floor`, `ceil`, `round`, `trunc`, `sign` — Uncommon for matrices in game/physics math libraries. Access components directly if needed.

**Reason:** GLSL spec limits floor/ceil/round to `genFType` (vectors), NOT `matN` types. gl-matrix, Three.js, Unity, Godot, Box2D do NOT provide these on matrix types. Only GLM (which mirrors GLSL extensions) supports component-wise operations on matrices. For a physics engine math library, these lack precedent.
**Migration:** Access components directly for component-wise operations, which is also the safer approach (avoids accidentally rounding rotation elements).

NOTE: `mod`, `modScalar` are NOT deprecated — they were deliberately added by the ratified API hardening change (2026-03-07) to complete static/instance triality.

NOTE: `addScalar`, `subtractScalar` deprecation is DEFERRED pending further evaluation of their provenance and usage.

#### Scenario: Deprecated methods still produce correct results

- **GIVEN** `m = new Matrix2(1.5, 2.7, 3.1, 4.9)`
- **WHEN** `Matrix2.floor(m)` is called
- **THEN** the result SHALL be `Matrix2(1, 2, 3, 4)` (still functional)
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix3 component-wise operations deprecation

Same as Matrix2: `floor`, `ceil`, `round`, `trunc`, `sign` SHALL be marked `@deprecated` on Matrix3 (both static and instance).

**Reason:** Identical to Matrix2 — uncommon for matrices in game/physics libraries.
**Migration:** Access components directly if needed.

NOTE: `mod`, `modScalar` are NOT deprecated (ratified API hardening). `addScalar`, `subtractScalar` deprecation is DEFERRED.

#### Scenario: Deprecated methods still produce correct results

- **GIVEN** `m = new Matrix3(1.5, 2.7, 3.1, 4.9, 5.2, 6.8, 7.3, 8.1, 9.6)`
- **WHEN** `Matrix3.floor(m)` is called
- **THEN** the result SHALL be `Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9)` (still functional)
- **AND** TypeScript tooling SHALL show a deprecation warning

---

## Changes from implement-audit-p1-p2-fixes (2026-04-02)

_Synced from delta spec: `openspec/changes/implement-audit-p1-p2-fixes/specs/core-types-api`_

### Requirement: Vector2 public API surface

The Vector2 class SHALL include `moveTowards` as both a static method and an instance method, following the established static+instance duality pattern. The static method SHALL accept an optional `out` parameter as the last argument.

#### Scenario: moveTowards is exported

- **WHEN** a consumer imports from `@lenguados/math2d`
- **THEN** `Vector2.moveTowards` SHALL be available as a static method
- **AND** `new Vector2().moveTowards()` SHALL be available as an instance method

---

### Requirement: Matrix2 public API surface

The Matrix2 class SHALL include `fromAngleScale` as a static factory method, following the established factory pattern with optional `out` parameter.

#### Scenario: fromAngleScale is exported

- **WHEN** a consumer imports from `@lenguados/math2d`
- **THEN** `Matrix2.fromAngleScale` SHALL be available as a static method

### Requirement: R-ROTATION2-FROMANGLE-OPTIMIZE

`Rotation2.fromAngle(angle)` MUST assign the cos/sin values from `sinCos()` directly to the instance properties without passing through `set()` normalization. The `set()` method continues to normalize for arbitrary user input, but `fromAngle` is an internal construction path where normalization is mathematically redundant.

#### Scenario: fromAngle bypasses normalization

- **WHEN** `Rotation2.fromAngle(Math.PI / 4)` is called
- **THEN** the result has `cos ≈ 0.7071` and `sin ≈ 0.7071`
- **AND** no `hypot()` call is made during construction
- **AND** the result is bitwise identical to the previous implementation for all finite angles

NOTE: A comment MUST link `fromAngle` to `set()` explaining why they diverge: `fromAngle` trusts `sinCos()` output; `set()` normalizes arbitrary input.

---

## Changes from remove-math2d-aliases (2026-04-04)

_Synced from delta spec: openspec/changes/remove-math2d-aliases/specs/core-types-api_

## REMOVED Requirements

### Requirement: scale() as scalar multiplication method

**Reason**: Renamed to `multiplyScalar` across all 5 core types. `scale` was ambiguous with geometric scaling (`fromScale`, `scaleBy`). Research confirmed `multiplyScalar` is the ecosystem standard (glMatrix, Three.js).
**Migration**: Replace `Type.scale(x, s)` with `Type.multiplyScalar(x, s)`. Replace `x.scale(s)` with `x.multiplyScalar(s)`. Applies to Vector2, Complex, Interval, Matrix2, Matrix3.

### Requirement: Complex.argument() method

**Reason**: Replaced by `Complex.angle` (getter) and `Complex.angle(z)` (static). Consistent with `Vector2.angle` and `Rotation2.angle`.
**Migration**: Replace `z.argument()` with `z.angle`. Replace `Complex.argument(z)` with `Complex.angle(z)`.

### Requirement: Interval.divide/divideSafe/divideUnchecked (scalar overload)

**Reason**: Renamed to `divideScalar/divideScalarSafe/divideScalarUnchecked` to follow the `verbScalar(number)` convention used by all other types.
**Migration**: Replace `Interval.divide(i, s)` with `Interval.divideScalar(i, s)`. Same for Safe/Unchecked variants and instance methods.

## MODIFIED Requirements

### Requirement: Complex.pow zero base with negative exponent

`Complex.pow(z, n)` where `z` has zero magnitude and `n < 0` SHALL throw a `RangeError` in the strict variant instead of producing `Complex(Infinity, NaN)`. The safe variant `Complex.powSafe` SHALL return `Complex(0, 0)` as the fallback. The unchecked variant has no obligation.

Note: After `argument()` removal, internal usage within `pow` uses the `angle` getter directly.

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
