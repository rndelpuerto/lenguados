# Core Types API — Delta Spec (math2d-audit-fixes)

## Constant Deletions

### REQ-CONST-DEL-1: Remove epsilon container constants

The following constants SHALL be removed from the public API:

- `Vector2.EPSILON_VECTOR`
- `Complex.EPSILON_COMPLEX`
- `Matrix2.EPSILON_MATRIX`
- `Matrix3.EPSILON_MATRIX`

**Justification:** Tolerance comparison is performed via scalar epsilon parameters in all comparison methods (nearEquals, isNearZero, etc.). No API method accepts an epsilon vector/matrix. Zero internal usage verified.

### REQ-CONST-DEL-2: Remove Complex scalar wrapper constants

The following constants SHALL be removed:

- `Complex.SQRT2`
- `Complex.SQRT2_INV`
- `Complex.PI`
- `Complex.E`

**Justification:** Wrapping platform scalar constants (Math.SQRT2, Math.SQRT1_2, Math.PI, Math.E) as Complex(x, 0) provides no algebraic value. The essential Complex basis {ZERO, ONE, I, NEG_I, NEG_ONE} is retained.

### REQ-CONST-DEL-3: Remove Matrix degenerate/arbitrary constants

The following constants SHALL be removed:

- `Matrix2.ONE`, `Matrix3.ONE` — misleading name (not the multiplicative identity), degenerate rank-1 matrix
- `Matrix2.SCALE_2`, `Matrix3.SCALE_2` — arbitrary scale factor; use `fromScale(2, 2)` factory
- `Matrix2.SCALE_HALF`, `Matrix3.SCALE_HALF` — arbitrary scale factor; use `fromScale(0.5, 0.5)` factory

### REQ-CONST-DEL-4: Remove Interval.PERCENT

`Interval.PERCENT` SHALL be removed. The 0-100 percentage convention is ambiguous (vs 0-1). `Interval.UNIT` [0, 1] covers normalized percentages.

## Constant Restorations

### REQ-CONST-KEEP-1: Vector2 directional constants

The following constants SHALL remain in the public API WITHOUT @deprecated annotations:

- `Vector2.NEGATIVE_ONE` — completes the ONE/NEGATIVE_ONE symmetry pattern matching UNIT_X/NEGATIVE_UNIT_X
- `Vector2.UNIT_DIAGONAL` — 45° unit direction (√2/2, √2/2), fundamental in 2D gamedev
- `Vector2.NEGATIVE_UNIT_DIAGONAL` — 225° unit direction, negative pair of UNIT_DIAGONAL

### REQ-CONST-KEEP-2: Interval angular range constants

The following constants SHALL remain WITHOUT @deprecated:

- `Interval.DEGREES` [0, 360] — standard degree range for a 2D angle library
- `Interval.RADIANS` [0, 2π] — standard radian range, the library's native angular representation

## Rotation2 Negate API

### REQ-ROT-NEGATE-1: Fix negated getter

`Rotation2.negated` SHALL return `new Rotation2(-this.cos, -this.sin)` (component-wise sign flip), NOT `new Rotation2(this.cos, -this.sin)` (which is conjugation/inversion). The @deprecated annotation SHALL be removed.

### REQ-ROT-NEGATE-2: Add static negate method

`Rotation2.negate(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2` SHALL be added. It SHALL return `Rotation2.ensureOut(out).set(-rotation.cos, -rotation.sin)`.

### REQ-ROT-NEGATE-3: Add instance negate method

`Rotation2.prototype.negate(): this` SHALL be added. It SHALL mutate `this.cos = -this.cos; this.sin = -this.sin` and return `this`.

### REQ-ROT-NEGATE-4: Negate semantics

For a Rotation2 representing angle θ, `negate()` SHALL produce a rotation representing angle θ + π (the opposite direction). This is distinct from `inverse()` which produces -θ.
