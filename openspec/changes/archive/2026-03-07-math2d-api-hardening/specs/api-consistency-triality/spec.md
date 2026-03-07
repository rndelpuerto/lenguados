## ADDED Requirements

### Requirement: Interval.sqrt SHALL have Safe and Unchecked variants

`Interval.sqrt()` currently throws on negative intervals with no safe fallback. The triality pattern (strict/Safe/Unchecked) SHALL be completed:

- `sqrt()` (strict): throws `RangeError` if interval contains negative values
- `sqrtSafe()`: clamps min to 0 before sqrt, returns `[0, 0]` for fully negative intervals
- `sqrtUnchecked()`: computes sqrt without validation (caller guarantees non-negative)

#### Scenario: sqrtSafe with fully negative interval

- **WHEN** `Interval.sqrtSafe([-4, -1])` is called (static) or `new Interval(-4, -1).sqrtSafe()` (instance)
- **THEN** it SHALL return `[0, 0]` (degenerate point interval)

#### Scenario: sqrtSafe with partially negative interval

- **WHEN** `Interval.sqrtSafe([-1, 4])` is called
- **THEN** it SHALL return `[0, 2]` (min clamped to 0, sqrt(4) = 2)

#### Scenario: sqrtSafe with valid interval

- **WHEN** `Interval.sqrtSafe([1, 9])` is called
- **THEN** it SHALL return `[1, 3]` (same as strict sqrt)

#### Scenario: sqrtUnchecked with valid interval

- **WHEN** `Interval.sqrtUnchecked([4, 16])` is called
- **THEN** it SHALL return `[2, 4]` without any validation

#### Scenario: sqrtUnchecked with negative interval (undefined behavior)

- **WHEN** `Interval.sqrtUnchecked([-4, -1])` is called
- **THEN** the result is unspecified (NaN is acceptable); the caller is responsible for valid input

### Requirement: Matrix2 and Matrix3 mod/modScalar SHALL have static equivalents

`mod()` and `modScalar()` exist as instance-only methods on Matrix2 and Matrix3, violating the library convention that every instance method has a static counterpart. Static equivalents SHALL be added.

#### Scenario: Matrix2.mod static method

- **WHEN** `Matrix2.mod(a, b, out?)` is called with two Matrix2-like inputs
- **THEN** it SHALL return a new Matrix2 with element-wise modulo and optionally write to `out`

#### Scenario: Matrix2.modScalar static method

- **WHEN** `Matrix2.modScalar(m, scalar, out?)` is called
- **THEN** it SHALL return a new Matrix2 with each element modulo the scalar

#### Scenario: Matrix3.mod static method

- **WHEN** `Matrix3.mod(a, b, out?)` is called with two Matrix3-like inputs
- **THEN** it SHALL return a new Matrix3 with element-wise modulo

#### Scenario: Matrix3.modScalar static method

- **WHEN** `Matrix3.modScalar(m, scalar, out?)` is called
- **THEN** it SHALL return a new Matrix3 with each element modulo the scalar

#### Scenario: Static and instance mod produce identical results

- **WHEN** `Matrix2.mod(a, b)` and `a.clone().mod(b)` are called with the same inputs
- **THEN** both results SHALL be identical

## MODIFIED Requirements

### Requirement: Zero-length normalization fallback SHALL be documented per type

The normalization Safe fallback values SHALL be explicitly documented:

- `Vector2.normalizeSafe` returns `(0, 0)` — zero vector (no direction)
- `Complex.normalizeSafe` returns `(1, 0)` — multiplicative identity
- `Rotation2.normalizeSafe` returns `(cos=1, sin=0)` — identity rotation

Additionally, `Complex.get normalized` SHALL return `(1, 0)` for zero-magnitude input, aligning with `normalizeSafe()` and the algebraic identity convention.

**BREAKING (v0.6.0 → v0.7.0)**: `Complex.get normalized` returned `(0, 0)` for zero-magnitude in v0.6.0. In v0.7.0 it returns `(1, 0)`. No deprecated alias is provided.

#### Scenario: Vector2.normalizeSafe on zero vector

- **WHEN** `Vector2.normalizeSafe({x:0, y:0})` is called
- **THEN** it SHALL return a vector with `x=0, y=0`

#### Scenario: Complex.normalizeSafe on zero complex

- **WHEN** `Complex.normalizeSafe({real:0, imag:0})` is called
- **THEN** it SHALL return a complex with `real=1, imag=0`

#### Scenario: Rotation2.normalizeSafe on zero rotation

- **WHEN** `Rotation2.normalizeSafe({cos:0, sin:0})` is called
- **THEN** it SHALL return a rotation with `cos=1, sin=0`

#### Scenario: Complex.get normalized on zero-magnitude returns identity (BREAKING)

- **WHEN** `new Complex(0, 0).normalized` is accessed
- **THEN** it SHALL return a complex with `real=1, imag=0` (was `real=0, imag=0`)

#### Scenario: Complex.get normalized on valid input unchanged

- **WHEN** `new Complex(3, 4).normalized` is accessed
- **THEN** it SHALL return `(0.6, 0.8)` (unchanged behavior)
