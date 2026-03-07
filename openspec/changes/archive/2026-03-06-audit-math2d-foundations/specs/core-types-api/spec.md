## MODIFIED Requirements

### Requirement: Vector2 is the reference type for API patterns

Vector2 SHALL be the most complete core type and serve as the reference implementation
for all API patterns. All other types SHALL follow Vector2's patterns unless the
mathematical domain prevents it.

**AUDIT SCOPE**: The Vector2 API surface SHALL be validated against reference libraries:

- **gl-matrix vec2**: Which operations exist? What's missing? What's extra?
- **three.js Vector2**: Which operations exist? Naming differences? Pattern differences?
- **Unity float2**: Static functions vs instance methods coverage
- **Godot Vector2**: Operation naming and completeness
- **Box2D b2Vec2**: Minimal API — what does a physics engine actually need?
- **Eigen Vector2d**: Mathematical completeness

The audit SHALL produce a comparison matrix showing which operations exist in each library
and identifying gaps or redundancies in the current API.

#### Scenario: Vector2 operation coverage matrix produced

- **WHEN** the audit compares Vector2 against 6 reference libraries
- **THEN** it SHALL produce a table with each operation as a row and each library as a column, marking presence/absence and naming differences

#### Scenario: Static and instance parity

- **WHEN** a method exists as static on Vector2
- **THEN** a corresponding instance method SHALL exist (unless it is a factory or query returning a new type)

#### Scenario: Triality for fallible operations

- **WHEN** an operation can fail (normalize zero vector, divide by zero, reflect on zero normal)
- **THEN** it SHALL have strict/Safe/Unchecked variants on both static and instance

---

### Requirement: Cross-type method family consistency

All core types that support a method family SHALL implement it using the same pattern.

**AUDIT SCOPE**: The consistency matrix SHALL be re-evaluated:

- Does every "YES" entry actually exist in the code? (Verify, don't assume from previous audit)
- Are the method signatures truly consistent across types? (Same parameter order, same return type pattern)
- Do reference libraries maintain the same level of cross-type consistency?
- Is the `slerp` on types other than Rotation2 mathematically correct? (Matrix2.slerp — does this make sense?)
- The `inverse` semantic: component-wise (Vector2) vs algebraic (Matrix2, Complex) — is this confusing?

#### Scenario: Method signature consistency verified

- **WHEN** the audit checks `lerp` across all core types
- **THEN** every type's `lerp` SHALL accept `(a, b, t, out?)` for static and `(other, t)` for instance, with no deviations

#### Scenario: Inverse semantic clarified

- **WHEN** the audit evaluates `inverse` across types
- **THEN** it SHALL document: Vector2.inverse (component-wise 1/x, 1/y), Complex.inverse (multiplicative reciprocal), Matrix2.inverse (matrix inverse) — and determine if the same name for different operations is confusing or acceptable, citing Eigen's approach (`.inverse()` for matrix, no component-wise inverse)

---

### Requirement: Rotation2 conversion method — toMatrix2

Rotation2 already provides `toVector2(out?)` and `toComplex(out?)`.
The only missing conversion is:

- `toMatrix2(out?)` — returns the 2x2 rotation matrix **(NEW)**

**AUDIT SCOPE**: The Rotation2 conversion surface SHALL be re-evaluated:

- Is `toVector2` meaningful? (Rotation2 stores cos/sin, not x/y position — what does Vector2(cos, sin) represent?)
- Should the conversion surface include `toAngle()` for completeness?
- How do reference libraries handle rotation representation conversion? (three.js Euler ↔ Quaternion ↔ Matrix, Unity quaternion ↔ euler ↔ matrix)

#### Scenario: Rotation2 conversion completeness evaluated

- **WHEN** the audit evaluates Rotation2's conversion surface
- **THEN** it SHALL document whether `toVector2`, `toComplex`, `toMatrix2`, and `toAngle` form a complete and coherent conversion set, and whether any conversion is misleading or redundant

#### Scenario: Rotation2 to Matrix2 round-trip

- **WHEN** `Rotation2.fromAngle(angle).toMatrix2()` is called
- **THEN** the result SHALL nearEqual `Matrix2.fromRotation(angle)` within EPSILON

---

### Requirement: Interval set operations — partially existing

`Interval.union` and `Interval.intersect` already exist.

New methods to add:

- `expand(interval, delta, out?)` static + instance
- `shrink(interval, delta, out?)` static + instance

**AUDIT SCOPE**: The Interval API SHALL be validated against interval arithmetic literature:

- Moore's "Interval Analysis" — what operations should a basic interval type support?
- Boost.Interval (C++) — API surface comparison
- Is Interval math-core or should it be in a geometry layer?
- Does the current `union`/`intersect` naming match set theory conventions?

#### Scenario: Interval scope evaluated

- **WHEN** the audit evaluates Interval's role in the library
- **THEN** it SHALL determine whether Interval belongs in core math (1D range, used for parametric operations) or in a geometry layer (AABB is 2D interval), citing Moore's interval arithmetic scope

#### Scenario: Expand interval

- **WHEN** `Interval.expand({ min: 2, max: 8 }, 1)` is called
- **THEN** it SHALL return `Interval(1, 9)`
