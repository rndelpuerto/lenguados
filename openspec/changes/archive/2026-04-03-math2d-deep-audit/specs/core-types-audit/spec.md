## ADDED Requirements

### Requirement: Rotation2 static clone() documentation (P3 — downgraded from P0)

Static `Rotation2.clone()` SHALL document WHY it normalizes, rather than changing its behavior.

**Evidence:** The devil's advocate demonstrated that static `clone` accepts `ReadonlyRotation2Like` — an interface with NO unit-length invariant guarantee. A raw `{cos: 0.98, sin: 0.2}` POJO would produce a denormalized Rotation2 without normalization. Box2D's `b2Rot` and nalgebra's `UnitComplex` always normalize from raw components (DEFINITIVE from source). The normalization is a FEATURE protecting the type invariant, not a bug.

**The asymmetry with instance clone() is INTENTIONAL:** Instance `clone()` operates on `this` (already validated `Rotation2`). Static `clone()` operates on `ReadonlyRotation2Like` (unvalidated interface). Different trust levels → different behavior.

#### Scenario: Documentation explains normalization rationale

- **WHEN** a developer reads `Rotation2.clone()` JSDoc
- **THEN** it SHALL include `@remarks` explaining: "Normalizes the cloned values to enforce the unit-length invariant, since the source is a ReadonlyRotation2Like that may not be unit-length. Use instance clone() for bit-identical copies of validated Rotation2 objects."

### Requirement: Rotation2 setDirect private method (P1)

Rotation2 SHALL have a private `setDirect(cos, sin)` method for internal use in arithmetic operations.

**Evidence:** Box2D's `b2MulRot` performs direct complex multiplication with NO normalization (DEFINITIVE from `math_functions.h` source). nalgebra's `UnitComplex::mul` uses `Unit::new_unchecked()` which explicitly skips normalization (DEFINITIVE from `unit_complex_ops.rs` source). Industry standard is no-normalization on composition of unit values.

**Mitigations:**

1. `setDirect` SHALL be `private` (TypeScript compile-time enforcement)
2. `setDirect` SHALL include a dev-mode assertion: `assert(Math.abs(cos*cos + sin*sin - 1) < EPSILON, 'setDirect: input must be unit-length')`
3. Only used in static arithmetic methods (`multiply`, `inverse`, `negate`, `conjugate`, `relative`) where inputs are guaranteed unit-length

#### Scenario: Static multiply skips normalization

- **WHEN** `Rotation2.multiply(a, b)` is called with unit-length inputs
- **THEN** it SHALL NOT perform `hypot` + division normalization
- **THEN** the result SHALL be within EPSILON of unit-length (verified by dev-mode assertion)

### Requirement: Rotation2 relativeTo documentation fix (P3 — downgraded from P0)

The `relativeTo` instance method SHALL receive documentation clarification, NOT a rename.

**Evidence:** The devil's advocate demonstrated the math IS consistent. Static `relative(a, b)` = `conj(a) * b` is documented as "b relative to a". Instance `relativeTo(other)` = `conj(this) * other` = "other relative to this". The computation is the rotation FROM this TO other. The name "relativeTo" is ambiguous but NOT mathematically wrong. Multiple 3D engines use `InverseTransformRotation(other)` for the same operation.

**Cost of renaming:** Breaking API change for a subjective naming preference. Documentation is cheaper and resolves all confusion.

#### Scenario: Clear documentation

- **WHEN** a developer reads `relativeTo` JSDoc
- **THEN** it SHALL include `@remarks`: "Computes the rotation FROM this TO other (equivalent to `Rotation2.relative(this, other)` = `conj(this) * other`). The result, when composed with this rotation, produces other: `this.multiply(this.relativeTo(other)) ≈ other`."

### Requirement: Rotation2 negated getter docstring fix (P3)

The `negated` getter docstring SHALL reference `{@link inverted}` (not `{@link inversed}`).

**Evidence:** The rename from `inversed` to `inverted` was applied in the 2026-03-21 comprehensive-review (D-CR-01). Code verification confirmed the docstring still references the old name.

#### Scenario: Correct documentation link

- **WHEN** a developer reads the `negated` getter JSDoc
- **THEN** it SHALL reference `{@link inverted}`, not `{@link inversed}`

### Requirement: Rotation2 fromCS/fromValues internal delegation (P2)

`Rotation2.fromValues` SHALL delegate to `fromCS` internally. Both SHALL remain public per the completeness principle.

**Evidence:** The "completeness over minimalism" pillar (D-AF-02) and "no @deprecated" policy (D-AF-01) require both to exist. `fromValues` matches gl-matrix convention; `fromCS` matches the \*CS naming convention. Both serve discoverability for different audiences.

#### Scenario: Internal delegation

- **WHEN** `Rotation2.fromValues(cos, sin)` is called
- **THEN** it SHALL delegate to `Rotation2.fromCS(cos, sin)` internally

### Requirement: Rotation2 angleBetween static method (P4)

`Rotation2.angleBetween(a, b)` SHALL return the signed angle between two rotations without allocation.

#### Scenario: Allocation-free angle computation

- **WHEN** `Rotation2.angleBetween(a, b)` is called
- **THEN** it SHALL return `atan2(a.cos*b.sin - a.sin*b.cos, a.cos*b.cos + a.sin*b.sin)` without creating intermediate Rotation2 objects

### Requirement: Rotation2 toString DRY (P3)

`Rotation2.toString` SHALL use `radiansToDegrees` instead of inline `180 / PI`.

#### Scenario: DRY compliance

- **WHEN** `Rotation2.toString` converts to degrees
- **THEN** it SHALL use `radiansToDegrees(this.angle)` or `this.angleDegrees`

### Requirement: Rotation2 fromMatrix2 docstring fix (P3)

The `fromMatrix2` docstring SHALL remove the incorrect "via atan2" claim.

**Evidence:** Code verification confirmed the implementation uses `set(m00, m01)` which normalizes via `hypot`, not `atan2`.

#### Scenario: Accurate documentation

- **WHEN** a developer reads `fromMatrix2` JSDoc
- **THEN** it SHALL NOT claim the rotation is extracted "via atan2"

### Requirement: Rotation2 nearEquals docstring fix (P3)

The `nearEquals` docstring SHALL clarify that `angleDifference` is computed inline.

#### Scenario: Accurate documentation

- **WHEN** a developer reads `Rotation2.nearEquals` JSDoc
- **THEN** it SHALL NOT reference `{@link angleDifference}` as if it's called (the angle difference is computed inline via cross/dot products)

### Requirement: Complex fromObject parameter type fix (P3)

`Complex.fromObject` SHALL accept `ReadonlyComplexLike` instead of `ComplexLike`.

**Evidence:** Code verification confirmed at `complex.ts:378`. The library convention (D-F1-20) is `ReadonlyLike` for all input parameters.

#### Scenario: Readonly input acceptance

- **WHEN** `Complex.fromObject(readonlyComplex)` is called
- **THEN** it SHALL compile without type errors with `ReadonlyComplexLike`

### Requirement: Complex setFromPolar validation (P3)

`Complex.setFromPolar` SHALL validate the angle parameter with `assertFinite`.

**Evidence:** Code verification confirmed at `complex.ts:1562` — no validation. The static `fromPolar` (line 291) DOES validate. Per the assertion boundary architecture (hidden rationale D-3.4), core types validate their inputs.

#### Scenario: NaN angle rejection in dev mode

- **WHEN** `complex.setFromPolar(1, NaN)` is called in development mode
- **THEN** it SHALL throw an assertion error

### Requirement: Complex sqrt with branch-cut special cases (P1)

`Complex.sqrt` SHALL use the direct algebraic formula WITH mandatory branch-cut special cases matching C99 Annex G.

**Evidence FOR the algebraic formula:** Production C libraries (musl, glibc, CPython `cmath.sqrt`) use the algebraic formula, NOT polar form (DEFINITIVE from cppreference and source code). Higham documents precision advantages. The current `pow(0.5)` approach goes through `atan2 → sinCos` which is slower and less precise.

**CRITICAL WARNING from devil's advocate:** The naive formula `(sqrt((r+a)/2), sign(b)*sqrt((r-a)/2))` FAILS on the negative real axis. For `z = -1 + 0i`: `sign(0) = 0`, so the imaginary part becomes `0 * sqrt(1) = 0` instead of `1`. The formula MUST include special cases.

**Mandatory special cases (C99 Annex G):**

1. If `z = 0`: return `(0, 0)`
2. If `imag = 0 && real >= 0`: return `(sqrt(real), 0)`
3. If `imag = 0 && real < 0`: return `(0, sign(imag) === -0 ? -sqrt(-real) : sqrt(-real))` — Note: `sign(-0)` must be handled via `Object.is(imag, -0)` per signed-zero convention (D-E1-05)
4. General case: `(sqrt((r+a)/2), sign(b)*sqrt((r-a)/2))` where `r = hypot(a, b)`

#### Scenario: Branch cut — negative real axis

- **WHEN** `Complex.sqrt({real: -1, imag: 0})` is called
- **THEN** it SHALL return `{real: 0, imag: 1}` (i.e., `i`) with precision to EPSILON

#### Scenario: Positive real

- **WHEN** `Complex.sqrt({real: 4, imag: 0})` is called
- **THEN** it SHALL return `{real: 2, imag: 0}` with precision to EPSILON

#### Scenario: General complex

- **WHEN** `Complex.sqrt({real: 0, imag: 2})` is called
- **THEN** `sqrt(z)^2` SHALL equal `z` within EPSILON

### Requirement: Complex reciprocal performance (P1)

`Complex.reciprocal` (strict variant) SHALL use direct `magnitudeSq` instead of `hypot` + squaring.

**Evidence:** Code verification confirmed `reciprocal` computes `magnitude` via `hypot` then squares it, while `reciprocalUnchecked` already correctly uses `magnitudeSq` directly. The strict variant wastes a `hypot` call.

#### Scenario: Correctness preserved

- **WHEN** `Complex.reciprocal({real: 3, imag: 4})` is called
- **THEN** it SHALL return `{real: 0.12, imag: -0.16}` with precision to EPSILON

### Requirement: Complex fromRotation2 addition (P4)

`Complex.fromRotation2(rotation, out?)` factory SHALL be added for symmetry with `Rotation2.fromComplex`.

#### Scenario: Rotation to complex conversion

- **WHEN** `Complex.fromRotation2(rotation)` is called
- **THEN** it SHALL return a unit complex with `real = rotation.cos` and `imag = rotation.sin`

### Requirement: Vector2 directionToUnchecked symmetry gap (P2)

Vector2 SHALL have a `directionToUnchecked()` instance method.

#### Scenario: Instance symmetry

- **WHEN** `vector.directionToUnchecked(target)` is called
- **THEN** it SHALL produce the same result as `Vector2.directionUnchecked(vector, target)`

### Requirement: Vector2 fromObject JSDoc fix (P3)

`Vector2.fromObject` SHALL NOT have a `@throws` annotation.

**Evidence:** Code verification confirmed at `vector2.ts:316-328` — the method does not validate or throw.

#### Scenario: Accurate documentation

- **WHEN** a developer reads `Vector2.fromObject` JSDoc
- **THEN** there SHALL be no `@throws` annotation

### Requirement: Vector2 chebyshev metrics addition (P4 — lowest priority)

Vector2 SHALL have `chebyshevLength` (L-infinity norm) and `chebyshevDistance` methods.

**Evidence:** Completes the Minkowski norm family (L1/manhattan, L2/euclidean, L-inf/chebyshev). The devil's advocate noted this primarily serves grid-based pathfinding (gameplay), but the L-inf norm IS a mathematical primitive. Lowest priority among P4 additions.

#### Scenario: Chebyshev length

- **WHEN** `Vector2.chebyshevLength({x: 3, y: -5})` is called
- **THEN** it SHALL return `5` (max of absolute components)

#### Scenario: Chebyshev distance

- **WHEN** `Vector2.chebyshevDistance({x: 1, y: 2}, {x: 4, y: 3})` is called
- **THEN** it SHALL return `3`

### Requirement: Interval divideSafe/divideUnchecked instance methods (P2)

Interval SHALL have `divideSafe(scalar)` and `divideUnchecked(scalar)` instance methods.

**Evidence:** Static API has all three tiers. Instance API only has `divide`. Per symmetry principle (D-F1-21, completeness pillar).

#### Scenario: Instance symmetry

- **WHEN** `interval.divideSafe(0)` is called
- **THEN** it SHALL return `this` with values `[0, 0]`

### Requirement: Interval mod semantics documentation (P3)

`Interval.mod` SHALL document that it is component-wise, NOT interval-theoretic.

**Evidence:** Code verification confirmed. Cannot be removed per the all-or-nothing principle (D-AF-03). The component-wise interpretation is well-defined but may surprise users expecting interval arithmetic.

#### Scenario: Documentation clarity

- **WHEN** a developer reads `Interval.mod` JSDoc
- **THEN** it SHALL include `@remarks`: "This is component-wise modulo (applied to min and max independently), NOT interval-theoretic modulo. The result may not enclose all possible modulo values of points within the interval."

### Requirement: Interval copy validation documentation (P4)

Instance `Interval.copy()` SHALL document its trust assumption.

**Evidence:** Code verification confirmed direct assignment without validation at `interval.ts:1499-1503`.

#### Scenario: Trust documentation

- **WHEN** a developer reads `Interval.copy()` JSDoc
- **THEN** it SHALL include `@remarks`: "Trusted fast path — does not validate min ≤ max. Use `set()` for validated assignment from untrusted sources."

### Requirement: Interval distance addition (P4)

`Interval.distance(a, b)` SHALL compute the gap between non-overlapping intervals.

**Evidence:** Pure interval arithmetic operation. Needed for SAT separation distance. `distance = max(0, max(a.min - b.max, b.min - a.max))`.

#### Scenario: Non-overlapping intervals

- **WHEN** `Interval.distance({min: 0, max: 3}, {min: 5, max: 8})` is called
- **THEN** it SHALL return `2`

#### Scenario: Overlapping intervals

- **WHEN** `Interval.distance({min: 0, max: 5}, {min: 3, max: 8})` is called
- **THEN** it SHALL return `0`

### Requirement: Interval enclosing addition (P4)

`Interval.enclosing(interval, value, out?)` SHALL extend an interval to include a point.

**Evidence:** Pure interval operation: `[min(interval.min, value), max(interval.max, value)]`. Matches Box2D `b2AABB::Combine` pattern.

#### Scenario: Point outside interval

- **WHEN** `Interval.enclosing({min: 2, max: 5}, 8)` is called
- **THEN** it SHALL return `{min: 2, max: 8}`

#### Scenario: Point inside interval

- **WHEN** `Interval.enclosing({min: 2, max: 5}, 3)` is called
- **THEN** it SHALL return `{min: 2, max: 5}`

### Requirement: Matrix2 inverted getter consistency (P3)

The `Matrix2.inverted` getter SHALL use `1 / det` instead of `divideSafe(1, det)` after the `isNearZero` guard.

**Evidence:** Code verification confirmed at `matrix2.ts:2235-2238`. The `isNearZero` guard already catches near-zero det, making `divideSafe` redundant dead code.

#### Scenario: Consistent inversion

- **WHEN** `matrix.inverted` is accessed on a singular matrix
- **THEN** it SHALL return identity (the `isNearZero` guard handles this)

### Requirement: Matrix2 instance comparison DRY delegation (P2)

9 Matrix2 instance comparison methods SHALL delegate to their static counterparts.

**Evidence:** Code verification confirmed 9 methods duplicate static logic: `isIdentity`, `isZero`, `isNearZero`, `isFinite`, `hasNaN`, `isSymmetric`, `isSkewSymmetric`, `isDiagonal`, `isOrthogonal`. Methods `exactEquals`, `nearEquals`, `hasInfinity` already correctly delegate.

#### Scenario: Delegation pattern

- **WHEN** `matrix.isIdentity(epsilon)` is called
- **THEN** it SHALL execute `return Matrix2.isIdentity(this, epsilon)`

### Requirement: Matrix3 instance comparison DRY delegation (P2)

9 Matrix3 instance comparison methods SHALL delegate to their static counterparts, matching the Matrix2 pattern.

#### Scenario: Consistent delegation

- **WHEN** `matrix3.isOrthogonal(epsilon)` is called
- **THEN** it SHALL delegate to `Matrix3.isOrthogonal(this, epsilon)`

### Requirement: Matrix2 frobeniusNorm documentation fix (P3)

Both static and instance `frobeniusNorm` SHALL fix the `@remarks`.

**Evidence:** Code verification confirmed the code uses `Math.sqrt` (IEEE 754 deterministic), NOT a custom deterministic kernel. The `@remarks` is misleading.

#### Scenario: Accurate remarks

- **WHEN** a developer reads `frobeniusNorm` `@remarks`
- **THEN** it SHALL say "Uses Math.sqrt which is deterministic per IEEE 754 (correctly rounded to 0.5 ULP)" — referencing the foundational finding D-F1-05

### Requirement: Matrix2 new operations (P4)

Matrix2 SHALL add `fromDiagonal`, `fromReflection`, and `solveLinearSystem`.

**fromDiagonal evidence:** Trivial factory, useful for mass/inertia matrices in physics.

**fromReflection evidence:** Householder transformation `I - 2*n*nᵀ` (DEFINITIVE: Wikipedia, PlanetMath, Cornell CS 6210). Matrix3.fromReflection already exists (added 2026-03-20). Matrix2 needs the same for the 2x2 case.

**solveLinearSystem evidence:** Box2D's `b2Solve22` uses Cramer's rule for 2x2 systems (DEFINITIVE from source). Cramer's rule is numerically appropriate for 2x2 (single cross-multiplication for determinant). Every 2D physics constraint solver needs this.

#### Scenario: fromDiagonal

- **WHEN** `Matrix2.fromDiagonal({x: 2, y: 3})` is called
- **THEN** it SHALL return a matrix with `m00=2, m01=0, m10=0, m11=3`

#### Scenario: fromReflection

- **WHEN** `Matrix2.fromReflection({x: 0, y: 1})` is called with a unit normal
- **THEN** it SHALL return the Householder matrix `[[1-2*0*0, -2*0*1], [-2*0*1, 1-2*1*1]]` = `[[1, 0], [0, -1]]`

#### Scenario: solveLinearSystem

- **WHEN** `Matrix2.solveLinearSystem(identityMatrix, {x: 3, y: 5})` is called
- **THEN** it SHALL return `{x: 3, y: 5}` (identity preserves the right-hand side)
- **WHEN** the matrix is singular
- **THEN** the strict variant SHALL throw, Safe SHALL return `(0, 0)`, Unchecked SHALL return NaN/Infinity

### Requirement: Transform2 inverse DRY refactoring (P2)

Static `Transform2.inverse()` and `inverseSafe()` SHALL delegate to `inverseUnchecked()`.

**Evidence:** Code verification confirmed three copies of the same 10-line math at `transform2.ts:592-704`.

#### Scenario: Behavioral equivalence

- **WHEN** the refactored methods are called
- **THEN** they SHALL produce identical results to pre-refactor behavior for all inputs including NaN, Infinity, and zero-scale

### Requirement: Transform2 instance inverse allocation fix (P1)

Transform2 instance `inverse()` and `inverseUnchecked()` SHALL inline the rotation inverse.

**Evidence:** Code verification confirmed these allocate a temporary `Rotation2` via `Rotation2.inverse(this.rotation)`. The static versions inline `cos, -sin` directly. This is an unnecessary allocation in a hot-path operation.

#### Scenario: Allocation-free inverse

- **WHEN** `transform.inverse()` is called
- **THEN** it SHALL NOT allocate a temporary Rotation2 object

### Requirement: Transform2 fromComponents precision fix (P1)

`Transform2.fromComponents` SHALL copy cos/sin directly when given a `Rotation2Like`.

**Evidence:** Code verification confirmed at `transform2.ts:350` the code does `atan2(rotation.sin, rotation.cos)` then `setAngle` calls `sinCos` — a lossy roundtrip.

#### Scenario: Precision preservation

- **WHEN** `Transform2.fromComponents(pos, {cos: c, sin: s}, scale)` is called
- **THEN** the cos/sin values SHALL be copied directly, not roundtripped through atan2→sinCos

### Requirement: Transform2 missing instance Safe methods (P2)

Transform2 SHALL add `inverseTransformPointSafe` and `inverseTransformVectorSafe` instance methods.

#### Scenario: Instance symmetry

- **WHEN** `transform.inverseTransformPointSafe(point)` is called
- **THEN** it SHALL produce the same result as `Transform2.inverseTransformPointSafe(transform, point)`

### Requirement: Transform2 direction CS documentation (P3 — revised from API change)

`transformDirectionCS` and `inverseTransformDirectionCS` SHALL receive documentation explaining the parameter order difference.

**Evidence:** The devil's advocate demonstrated that the omission of the `transform` parameter is DELIBERATE. Direction transforms only use rotation. Accepting an unused `transform` would violate the Interface Segregation Principle (ISP) — users would pass transforms whose position/scale are silently ignored, creating subtle bugs.

#### Scenario: Documented API design rationale

- **WHEN** a developer reads `transformDirectionCS` JSDoc
- **THEN** it SHALL include `@remarks`: "Unlike transformPointCS/transformVectorCS, this method omits the transform parameter because direction transforms only use rotation (cos/sin), not position or scale. Accepting an unused transform would be misleading."

### Requirement: Transform2 lerp doc fix (P3)

Static `Transform2.lerp` SHALL document that t is NOT clamped.

**Evidence:** Code verification confirmed at `transform2.ts:1193` the `@param t` says "clamped" but the code does NOT clamp.

#### Scenario: Documentation accuracy

- **WHEN** a developer reads `Transform2.lerp` `@param t`
- **THEN** it SHALL say "not clamped, allows extrapolation"

### Requirement: Transform2 fromMatrix3 sign-loss warning (P3)

`Transform2.fromMatrix3` SHALL document that negative scale is lost during decomposition.

**Evidence:** `Matrix3.getScale()` uses `hypot` which always returns positive values. Negative scale information is lost in the roundtrip.

#### Scenario: Sign-loss documentation

- **WHEN** a developer reads `Transform2.fromMatrix3` JSDoc
- **THEN** it SHALL include `@remarks` warning about negative scale loss

### Requirement: Transform2 isIdentity DRY delegation (P3)

Instance `Transform2.isIdentity()` SHALL delegate to `Transform2.isIdentity(this, epsilon)`.

#### Scenario: Single source of truth

- **WHEN** `transform.isIdentity(epsilon)` is called
- **THEN** it SHALL delegate to the static method

### Requirement: Transform2 extractVector cleanup (P3)

Remove unused `label` parameter from the private `extractVector` helper.

#### Scenario: Dead code removal

- **WHEN** `extractVector` is called internally
- **THEN** the `label` parameter SHALL not exist in the signature

### Requirement: Matrix3 inverseAffine addition (P4)

Matrix3 SHALL add `inverseAffine` / `inverseAffineSafe` / `inverseAffineUnchecked` optimized for 2D affine transforms.

**Evidence:** Exploits the [0,0,1] bottom row to reduce from 9 cofactors to 4 minors. Godot distinguishes `inverse()` (orthonormal) from `affine_inverse()` (general) — DEFINITIVE from source. math2d's single-method + validation tiers is cleaner than Godot's confusing dual-method approach.

#### Scenario: Correct affine inverse

- **WHEN** `Matrix3.inverseAffine(affineMat)` is called on an affine matrix
- **THEN** it SHALL produce the same result as `Matrix3.inverse(affineMat)` but with fewer operations

#### Scenario: Non-affine matrix rejection

- **WHEN** `Matrix3.inverseAffine(nonAffineMat)` is called on a non-affine matrix
- **THEN** the strict variant SHALL throw (bottom row ≠ [0,0,1])

### Requirement: Matrix3 fromTransform2Like factory (P4)

`Matrix3.fromTransform2Like(transform)` SHALL accept `ReadonlyTransform2Like` directly.

#### Scenario: Structural type acceptance

- **WHEN** `Matrix3.fromTransform2Like({position: {x:1,y:2}, rotation: {cos:1,sin:0}, scale: {x:1,y:1}})` is called
- **THEN** it SHALL produce the correct SRT matrix without requiring a `Transform2` instance

### Requirement: Matrix3 setTranslation mutator (P4)

`Matrix3.setTranslation(translation)` instance method SHALL be added for common translation-only updates.

#### Scenario: Translation-only mutation

- **WHEN** `matrix.setTranslation({x: 5, y: 10})` is called
- **THEN** it SHALL only modify `m20` and `m21`, leaving all other elements unchanged
