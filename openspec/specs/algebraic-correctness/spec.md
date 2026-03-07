## ADDED Requirements

### Requirement: SO(2) group properties verified for Rotation2

Rotation2 represents an element of the special orthogonal group SO(2). The audit SHALL verify
that all Rotation2 operations satisfy the SO(2) group axioms:

1. **Closure**: Composition of two rotations produces a valid rotation
2. **Associativity**: `compose(compose(a, b), c) === compose(a, compose(b, c))`
3. **Identity**: `compose(rotation, IDENTITY) === rotation`
4. **Inverse**: `compose(rotation, inverse(rotation)) === IDENTITY`

These SHALL be verified against Dorst et al. "Geometric Algebra for Computer Science" (chapter
on rotors in 2D) and Lengyel "Foundations of Game Engine Development Vol. 1" (section on 2D
rotations).

#### Scenario: Closure under composition

- **WHEN** two Rotation2 instances are composed
- **THEN** the result `cos^2 + sin^2` SHALL be within EPSILON of 1.0, and the audit SHALL document the drift rate per composition

#### Scenario: Associativity within tolerance

- **WHEN** `compose(compose(a, b), c)` and `compose(a, compose(b, c))` are compared for 1000 random rotations
- **THEN** they SHALL be nearEquals within EPSILON, and the audit SHALL document the maximum observed deviation

#### Scenario: Inverse produces identity

- **WHEN** `compose(r, inverse(r))` is computed for rotations including edge cases (0, PI, -PI, PI/2)
- **THEN** the result SHALL be nearEquals to IDENTITY within EPSILON

---

### Requirement: Complex number algebra verified

Complex numbers form a field. The audit SHALL verify that Complex operations satisfy:

1. **Additive group**: closure, associativity, identity (0+0i), inverse (negation)
2. **Multiplicative group** (excluding zero): closure, associativity, identity (1+0i), inverse (reciprocal)
3. **Distributivity**: `a * (b + c) === a*b + a*c`
4. **Conjugate properties**: `conj(a*b) === conj(a)*conj(b)`, `a * conj(a) === |a|^2`
5. **Euler's formula**: `exp(i*theta) === cos(theta) + i*sin(theta)` — connecting Complex to Rotation2

These SHALL be verified against standard complex analysis and Lengyel's treatment of complex
numbers for 2D rotations.

#### Scenario: Multiplicative inverse accuracy

- **WHEN** `Complex.multiply(z, Complex.reciprocal(z))` is computed for various z (including near-zero magnitude)
- **THEN** the result SHALL be nearEquals to `Complex(1, 0)` within EPSILON, and the audit SHALL document the condition number sensitivity

#### Scenario: Complex-Rotation2 equivalence

- **WHEN** a unit complex number `cos(theta) + i*sin(theta)` multiplies a complex `a + bi`
- **THEN** the result SHALL match `Rotation2.fromAngle(theta).apply(Vector2(a, b))` within EPSILON, and the audit SHALL document this equivalence as a fundamental identity of the library

---

### Requirement: Matrix2 linear transformation properties verified

Matrix2 represents a 2x2 linear transformation. The audit SHALL verify:

1. **Determinant correctness**: `det(A*B) === det(A) * det(B)` (multiplicative property)
2. **Inverse correctness**: `A * A^-1 === I` for invertible matrices
3. **Transpose properties**: `(A*B)^T === B^T * A^T`
4. **Rotation matrix**: `Matrix2.fromRotation(theta)` SHALL produce an orthogonal matrix with determinant +1
5. **Scaling matrix**: `Matrix2.fromScale(sx, sy)` SHALL produce a diagonal matrix
6. **Column-major storage**: Internal representation SHALL be verified as column-major, matching the convention documented

These SHALL be verified against Strang's "Linear Algebra and Its Applications" and Eberly's
"Geometric Tools for Computer Graphics" (section on 2D transformations).

#### Scenario: Determinant of composition

- **WHEN** `Matrix2.determinant(Matrix2.multiply(A, B))` is compared to `Matrix2.determinant(A) * Matrix2.determinant(B)`
- **THEN** they SHALL be nearEquals within EPSILON for 1000 random matrix pairs

#### Scenario: Column-major storage verified

- **WHEN** the audit reads the Matrix2 internal representation
- **THEN** element `m01` SHALL represent column 0, row 1 (first column, second row), matching GLSL/OpenGL column-major convention, and the audit SHALL cite the GLSL spec section 5.4.2 for matrix layout

#### Scenario: Inverse of singular matrix

- **WHEN** `Matrix2.inverse` is called on a singular matrix (determinant === 0)
- **THEN** the behavior (throw, return identity, return Safe variant) SHALL be documented and compared against Eigen's approach (assertion in debug) and gl-matrix's approach (return identity with console.warn)

---

### Requirement: Matrix3 affine transformation properties verified

Matrix3 represents a 3x3 affine transformation (2D homogeneous coordinates). The audit SHALL verify:

1. **Affine composition**: `Matrix3.multiply(A, B)` correctly composes two affine transforms
2. **Point vs vector transformation**: `transformPoint` includes translation, `transformVector` excludes it
3. **Decomposition**: TRS decomposition (translate, rotate, scale) is consistent with composition
4. **Inverse of affine**: The inverse of an affine matrix is affine
5. **Identity**: `Matrix3.IDENTITY` is the identity transformation

These SHALL be verified against Lengyel chapter 2 (affine transformations in 2D) and the
three.js Matrix3 implementation.

#### Scenario: Point transformation includes translation

- **WHEN** a Matrix3 with translation (10, 20) transforms point (0, 0)
- **THEN** the result SHALL be (10, 20)

#### Scenario: Vector transformation excludes translation

- **WHEN** a Matrix3 with translation (10, 20) transforms vector (1, 0)
- **THEN** the result SHALL be (1, 0) — translation does not affect directions

#### Scenario: TRS composition order

- **WHEN** `Matrix3.fromTRS(tx, ty, angle, sx, sy)` is called
- **THEN** it SHALL be equivalent to `T * R * S` (Scale first, then Rotate, then Translate), verified against Unity's Transform documentation and Lengyel's TRS convention

---

### Requirement: Transform2 decomposition correctness verified

Transform2 stores position + rotation + scale as a decomposed representation. The audit SHALL verify:

1. **Round-trip through Matrix3**: `Transform2.toMatrix3().toTransform2()` preserves all components (for shear-free transforms)
2. **Composition correctness**: `Transform2.compose(A, B)` matches `Matrix3.multiply(A.toMatrix3(), B.toMatrix3())` within tolerance
3. **Inverse correctness**: `Transform2.compose(T, Transform2.inverse(T))` produces identity
4. **Shear limitation**: When non-uniform scale + rotation creates shear, the limitation is clearly documented and escalation to Matrix3 is available

These SHALL be verified against Eberly's decomposition algorithms and Unity's Transform component.

#### Scenario: Compose matches Matrix3 multiply

- **WHEN** `Transform2.compose(A, B)` is compared to `Matrix3.multiply(A.toMatrix3(), B.toMatrix3()).toTransform2()` for 1000 random shear-free transforms
- **THEN** all components SHALL match within EPSILON

#### Scenario: Shear case documented

- **WHEN** a Transform2 has non-uniform scale (2, 1) and rotation PI/4
- **THEN** the audit SHALL document what information is lost vs the equivalent Matrix3 representation, and cite Eberly's analysis of polar decomposition limitations

---

### Requirement: Interval arithmetic properties verified

Interval represents a closed interval [min, max]. The audit SHALL verify:

1. **Set operations**: union, intersection satisfy set algebra identities
2. **Containment**: `contains(point)` and `overlaps(other)` are consistent with set membership
3. **Arithmetic**: Any interval arithmetic (add, scale) preserves the invariant `min <= max`
4. **Edge cases**: Empty interval (min > max), point interval (min === max), infinite intervals

These SHALL be verified against Moore's interval arithmetic and Boost.Interval (C++).

#### Scenario: Union is commutative

- **WHEN** `Interval.union(A, B)` and `Interval.union(B, A)` are compared
- **THEN** they SHALL be exactEquals for all finite interval pairs

#### Scenario: Intersection of disjoint intervals

- **WHEN** `Interval.intersect([1, 3], [5, 7])` is called
- **THEN** it SHALL return `undefined` (empty set), and the audit SHALL document this choice vs alternatives (return degenerate interval, throw) citing Moore's convention and Boost.Interval's approach

#### Scenario: min <= max invariant preserved

- **WHEN** any Interval operation is performed
- **THEN** the result SHALL satisfy `result.min <= result.max`, and the audit SHALL verify this invariant is enforced or documented for all operations

---

### Requirement: Inter-type conversion graph is complete and coherent

The core types form a network of conversions. The audit SHALL verify that the conversion
graph has no holes and that all round-trip conversions preserve information:

```
    Vector2 ←→ Complex ←→ Rotation2
       ↕                      ↓
    Matrix2 ←── fromRotation ←┘
       ↓
    Matrix3 ←→ Transform2
```

Required conversions:

- Complex ↔ Rotation2 (unit complex = rotation, bidirectional)
- Complex → Vector2 (real, imag → x, y)
- Rotation2 → Vector2 (cos, sin → x, y — verify if semantically meaningful)
- Rotation2 → Matrix2 (rotation matrix)
- Matrix2 ← Rotation2 (fromRotation factory)
- Transform2 ↔ Matrix3 (toMatrix3/fromMatrix3 — lossy for shear)

The audit SHALL document which conversions are lossless and which are lossy (and under what conditions).

#### Scenario: Complex-Rotation2 round-trip is lossless for unit complex

- **WHEN** a unit Complex is converted to Rotation2 and back
- **THEN** the result SHALL be nearEquals to the original within EPSILON

#### Scenario: Transform2-Matrix3 round-trip is lossy for shear

- **WHEN** a Matrix3 with shear is converted to Transform2 and back to Matrix3
- **THEN** the audit SHALL document what information is lost and whether the library communicates this to the developer

#### Scenario: Conversion graph has no orphan types

- **WHEN** the audit maps all from*/to* conversions
- **THEN** every core type SHALL have at least one conversion path to/from another type, forming a connected graph

---

### Requirement: Composition and facade relationships are mathematically correct

When one core type's method delegates to another (e.g., Vector2.applyRotation2 delegates to
Rotation2.apply), the mathematical result SHALL be identical to the direct operation. The audit
SHALL verify every facade relationship for:

1. **Mathematical equivalence**: facade produces identical result to direct call within EPSILON
2. **No hidden allocation**: facade does not introduce allocations that the direct call avoids
3. **Canonical owner**: the type that "owns" the mathematical operation is identified (e.g., Rotation2 owns rotation application, not Vector2)

#### Scenario: Facade produces same result as canonical

- **WHEN** `vector.applyRotation2(r)` and `Rotation2.apply(r, vector, out)` are compared
- **THEN** results SHALL be exactEquals (not just nearEquals — they should use the same code path)

#### Scenario: Canonical owner identified for every cross-type operation

- **WHEN** the audit maps all cross-type operations
- **THEN** each SHALL have one canonical owner (the type whose mathematical domain includes the operation) and zero or more facades on other types that delegate to it

---

### Requirement: Angular interpolation mathematical correctness verified

Angular interpolation functions (lerpAngle, smoothStepAngle) SHALL be verified for:

1. **Shortest path**: `lerpAngle(from, to, t)` always takes the shortest arc
2. **Boundary correctness**: Results at t=0, t=0.5, t=1 are exact
3. **Wrap-around**: Interpolation across the -PI/PI boundary is seamless
4. **Monotonicity**: The interpolated angle changes monotonically with t for t in [0, 1]

These SHALL be verified against Shoemake's quaternion SLERP (adapted to 2D), three.js MathUtils.lerp
for angles, and Godot's `lerp_angle` implementation.

#### Scenario: Shortest path across boundary

- **WHEN** `lerpAngle(350deg, 10deg, 0.5)` is called (crossing 0/360 boundary)
- **THEN** the result SHALL be nearEquals to 0deg (shortest arc through 360), NOT 180deg (long arc)

#### Scenario: Exact boundary values

- **WHEN** `lerpAngle(a, b, 0)` and `lerpAngle(a, b, 1)` are called
- **THEN** they SHALL return exactly `a` and a value nearEquals to `b` respectively, within ANGLE_EPSILON

#### Scenario: Anti-podal angles

- **WHEN** `lerpAngle(0, PI, 0.5)` is called (exactly opposite, two equal shortest paths)
- **THEN** the behavior SHALL be documented — which direction is chosen and why — citing Shoemake's handling of anti-podal quaternions
