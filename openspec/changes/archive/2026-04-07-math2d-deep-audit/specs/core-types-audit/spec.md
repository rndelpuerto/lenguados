## ADDED Requirements

### Requirement: Vector2 API completeness against reference libraries

`Vector2` SHALL contain every operation present in ≥3 of the reference libraries (three.js, gl-matrix vec2, Godot Vector2, Unity Vector2, Box2D b2Vec2) that is applicable to a pure 2D math core. The audit SHALL produce a verdict table with columns: operation, three.js, gl-matrix, Godot, Unity, Box2D, current status, verdict.

#### Scenario: Vector2 arithmetic operations are present

- **WHEN** the audit checks for add, subtract, multiply (component), divide (component), negate, multiplyScalar, divideScalar
- **THEN** all SHALL exist as both static (pure) and instance (mutating) variants

#### Scenario: Vector2 geometric operations are present

- **WHEN** the audit checks for length, lengthSquared, manhattanLength, normalize, distanceTo, distanceToSquared, dot, cross (scalar), angle, rotate, reflect, project, perpendicular (CCW), perpendicular (CW)
- **THEN** all SHALL exist; any missing one present in ≥3 references SHALL receive an ADD verdict

#### Scenario: Vector2 hot-path variants exist for rotation

- **WHEN** the audit checks for `rotateCS(cos: number, sin: number)` (pre-computed trig variant)
- **THEN** it SHALL exist as both a static and instance method since rotation is the most common hot-path operation in physics loops

#### Scenario: Vector2 `out` parameter coverage

- **WHEN** the audit checks every static method that returns a Vector2
- **THEN** each SHALL accept an optional `out: Vector2` parameter as the last argument

---

### Requirement: Vector2 static/instance symmetry is complete

For every Vector2 instance method `v.op(...)`, there SHALL be a corresponding static method `Vector2.op(a, b, out?)`. For every static factory `Vector2.from*(...)`, there SHALL be an instance mutating variant `v.set*(...)` or `v.copy*(...)` where semantically appropriate.

#### Scenario: Static method exists for every instance method

- **WHEN** the audit enumerates all instance methods of Vector2
- **THEN** every method that transforms state SHALL have a static pure equivalent that accepts `ReadonlyVector2Like` inputs

#### Scenario: Instance methods return `this` for chaining

- **WHEN** any instance method (add, subtract, normalize, etc.) is called
- **THEN** it SHALL return `this` to allow method chaining

---

### Requirement: Rotation2 uses cached sin/cos matching Box2D b2Rot pattern

`Rotation2` SHALL store `cos` and `sin` as its primary fields (not a raw angle), matching Box2D's `b2Rot` design. The angle SHALL be a derived getter. This pattern enables hot-loop rotation without repeated trig computation. The audit SHALL verify this is the current design and flag any deviation.

#### Scenario: Rotation2 stores c and s fields

- **WHEN** a `Rotation2` is constructed from an angle
- **THEN** `rotation.cos` and `rotation.sin` SHALL be directly accessible without any computation

#### Scenario: Rotation2 `*CS` methods accept pre-computed values

- **WHEN** the audit checks for methods that accept `(cos: number, sin: number)` instead of `(angle: number)`
- **THEN** at minimum `applyCS`, `applyInverseCS`, and composition via `multiplyCS` SHALL exist for hot paths

#### Scenario: `getAngle()` reconstruction is deterministic

- **WHEN** `Rotation2.fromAngle(θ).getAngle()` is called
- **THEN** result SHALL equal θ within EPSILON for all angles in (-π, π]

---

### Requirement: Complex number API is mathematically complete

`Complex` SHALL support: arithmetic (add, subtract, multiply, divide), magnitude, angle (argument), conjugate, normalize (unit complex), reciprocal, powers (sqrt, pow), conversion from polar, interpolation (lerp, slerp). The API SHALL distinguish between using Complex as a rotation operator (apply to Vector2) and as a general complex number.

#### Scenario: Complex multiplication matches definition

- **WHEN** `Complex.multiply(a, b)` is computed for a = (1, 0) and b = (0, 1)
- **THEN** result SHALL be (-1, 0) + (0+0) = wait: (1)(0)-(0)(1) = 0, (1)(1)+(0)(0) = 1 → result = (0, 1). Let me recalculate: (a+bi)(c+di) = (ac-bd) + (ad+bc)i. (1+0i)(0+1i) = (0-0) + (1+0)i = (0,1). Correct.
- **WHEN** `Complex.multiply({re:1, im:0}, {re:0, im:1})` is called
- **THEN** result SHALL have re=0, im=1

#### Scenario: Complex sqrt of -1 yields i

- **WHEN** `Complex.sqrt({re:-1, im:0})` is called
- **THEN** result SHALL have re=0, im=1 (or re=0, im=-1 for the other branch — convention SHALL be documented)

#### Scenario: Relationship between Rotation2 and unit Complex

- **WHEN** `Rotation2.fromAngle(θ)` and `Complex.fromPolar(1, θ)` are both evaluated
- **THEN** applying both to the same Vector2 SHALL produce identical results (within EPSILON)

---

### Requirement: Interval arithmetic is sufficient for a pure math core

`Interval` SHALL provide: construction (fromValues, fromCenterRadius), basic arithmetic (add, subtract, multiply, scalar multiply, divide scalar), set operations (hull, intersect, union), containment (contains, strictlyContains, isSubsetOf, overlaps), sampling (sample, inverseLerp), properties (center, radius, width, isDegenerate), and interpolation. The audit SHALL verify that every operation has clear semantic justification as a math-core primitive (not a geometry algorithm).

#### Scenario: `hull` produces the smallest containing interval

- **WHEN** `Interval.hull({min:2, max:5}, {min:1, max:3})` is called
- **THEN** result SHALL be {min:1, max:5}

#### Scenario: `intersect` returns null/undefined for non-overlapping intervals

- **WHEN** `Interval.intersect({min:1, max:2}, {min:3, max:4})` is called
- **THEN** result SHALL either be null/undefined or a degenerate interval — the behavior SHALL be explicitly defined

#### Scenario: Interval `sample` maps t=0 to min and t=1 to max

- **WHEN** `interval.sample(0.0)` and `interval.sample(1.0)` are called
- **THEN** results SHALL be `interval.min` and `interval.max` respectively

---

### Requirement: Matrix2 provides 2x2 matrix operations and is a rotation/scale primitive

`Matrix2` SHALL provide: identity, rotation (fromRotation), scale (fromScale), shear (fromShear), arithmetic (add, subtract, multiply, multiplyScalar, negate), determinant, transpose, inverse, vector transformation (transformVector), eigenvalue decomposition. The audit SHALL verify whether `ROTATE_90`, `ROTATE_180`, `FLIP_X`, `FLIP_Y` constants earn their place by being used in downstream composition — if they are convenience constants with no callers they SHALL receive REMOVE verdicts.

#### Scenario: Matrix2 multiply produces correct composition

- **WHEN** `Matrix2.fromRotation(θ1).multiply(Matrix2.fromRotation(θ2))` is computed
- **THEN** the result SHALL equal `Matrix2.fromRotation(θ1 + θ2)` within EPSILON

#### Scenario: Matrix2 inverse of rotation is its transpose

- **WHEN** `Matrix2.fromRotation(θ).inverse()` is computed
- **THEN** result SHALL equal `Matrix2.fromRotation(-θ)` AND `Matrix2.fromRotation(θ).transpose()` within EPSILON

#### Scenario: Rotation constant `ROTATE_90` has upstream callers

- **WHEN** the audit traces all callers of `Matrix2.ROTATE_90` across the entire codebase
- **THEN** if no callers exist in non-test code it SHALL receive a REMOVE verdict

---

### Requirement: Matrix3 serves as the 2D affine transformation matrix

`Matrix3` SHALL be a 3×3 matrix used to represent 2D affine transforms (translation + rotation + scale + shear). It SHALL provide: construction from Transform2, Matrix2, translation, rotation, scale, decomposition (getTranslation, getScale, getRotation), transform application (transformPoint with perspective divide, transformVector), composition (multiply, premultiply), and queries (isIdentity, isAffine, isInvertible, determinant). The audit SHALL verify that `Matrix3` does NOT include any 3D operations (e.g., projection matrices) since those are out of scope.

#### Scenario: Matrix3 point transform is homogeneous

- **WHEN** `Matrix3.fromTranslation(tx, ty).transformPoint({x:0, y:0})`
- **THEN** result SHALL be {x:tx, y:ty}

#### Scenario: Matrix3 vector transform ignores translation

- **WHEN** `Matrix3.fromTranslation(5, 10).transformVector({x:1, y:0})`
- **THEN** result SHALL be {x:1, y:0} (translation does not affect vectors, only points)

#### Scenario: No 3D projection operations exist in Matrix3

- **WHEN** the audit scans Matrix3's exported API for perspective, frustum, ortho, lookAt
- **THEN** none SHALL exist — these belong in a downstream rendering package

---

### Requirement: Transform2 is a compact rigid/affine body transform

`Transform2` SHALL store position (Vector2), rotation (Rotation2), and scale (Vector2 or scalar). It SHALL provide: composition (multiply), inverse, point/vector transformation, interpolation (lerp with decomposition), Matrix3 conversion, and queries (isIdentity, hasUniformScale, hasNegativeScale, determinant). The `out` parameter SHALL be present on all static transform methods.

#### Scenario: Transform2 inverse undoes forward transform

- **WHEN** `t.transformPoint(p)` is computed and then the result is passed to `t.inverseTransformPoint()`
- **THEN** the final result SHALL equal `p` within EPSILON for any non-degenerate transform `t`

#### Scenario: Transform2 multiply is associative

- **WHEN** `a.multiply(b.multiply(c))` vs `a.multiply(b).multiply(c)` are computed
- **THEN** results SHALL be equal within EPSILON (transform composition is associative)

#### Scenario: Transform2.fromMatrix and toMatrix are round-trip consistent

- **WHEN** `Transform2.fromMatrix(t.toMatrix())` is called for a transform with uniform scale
- **THEN** the result SHALL equal `t` within EPSILON

---

### Requirement: EigenvalueResult types have justified placement in core

The `RealEigenvalues`, `ComplexEigenvalues`, `EigenvalueResult`, `RealEigendecomposition`, `ComplexEigendecomposition`, and `EigendecomposeResult` types currently exist in `types/`. The audit SHALL determine whether eigenvalue decomposition is actually used by a `Matrix2` or `Matrix3` method in `core/`. If yes, the types SHALL remain in `types/`. If no current core method uses eigendecomposition, and no downstream physics use-case requires it at this layer, the types SHALL receive a REMOVE verdict.

#### Scenario: Eigenvalue types have callers in core

- **WHEN** the audit traces all usages of `EigenvalueResult` and related types
- **THEN** if they are referenced by `Matrix2` or `Matrix3` methods they SHALL be kept; otherwise they SHALL be removed from the public API

---

### Requirement: All core type static factories match instance setters

Every core type (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2) SHALL maintain symmetry between static factory methods and instance mutating setters:

- `Type.fromX(...)` → `instance.setX(...)` or `instance.copyFromX(...)`
- `Type.fromArray(arr)` → `instance.toArray(arr?)` pair
- `Type.fromObject(obj)` → `instance.toObject()` pair

#### Scenario: fromArray/toArray round-trip

- **WHEN** any core type `T` has `fromArray` and `toArray` methods
- **THEN** `T.fromArray(instance.toArray()).equals(instance)` SHALL be true for any valid instance
