## ADDED Requirements

### Requirement: Complex instance sqrt MUST use algebraic formula

The `Complex` instance `sqrt()` method SHALL use the C99 Annex G algebraic formula (matching the static `Complex.sqrt` implementation) instead of delegating to `this.pow(0.5)` via polar form.

#### Scenario: Complex instance sqrt uses algebraic path

WHEN `new Complex(-4, 0).sqrt()` is called
THEN the result SHALL be computed using the algebraic formula: `realPart = sqrt((|z| + re) / 2)`, `imagPart = sign(im) * sqrt((|z| - re) / 2)`
AND the result SHALL NOT go through polar form (atan2 -> sinCos round-trip)
AND the result SHALL match `Complex.sqrt(z)` for the same input within IEEE 754 exact equality

#### Scenario: Complex instance sqrt handles branch cut correctly

WHEN `new Complex(-1, 0).sqrt()` is called
THEN `real` SHALL be approximately `0`
AND `imag` SHALL be approximately `1`
AND the result SHALL be the principal square root (positive imaginary part for negative real input with zero imaginary part)

#### Scenario: Complex instance sqrt handles pure real positive

WHEN `new Complex(4, 0).sqrt()` is called
THEN `real` SHALL be `2`
AND `imag` SHALL be `0`

### Requirement: Static and instance sqrt MUST produce identical results

For any input Complex number `z`, `Complex.sqrt(z)` and `z.clone().sqrt()` SHALL produce bit-identical results. There SHALL be no numerical divergence between the two code paths.

#### Scenario: Static and instance sqrt are equivalent

WHEN both `Complex.sqrt(z)` and `z.clone().sqrt()` are computed for `z = new Complex(3, 4)`
THEN the `real` components SHALL be exactly equal (`===`)
AND the `imag` components SHALL be exactly equal (`===`)

### Requirement: All copy methods MUST follow consistent normalization semantics

Across all core types, `copy()` SHALL be a raw byte-for-byte transfer without normalization or validation. This is already the case for Vector2, Matrix2, Matrix3, Complex, Interval, and Transform2. Rotation2.copy already follows this pattern but SHALL be explicitly documented.

#### Scenario: copy is raw transfer across all types

WHEN `Type.copy(source, destination)` is called on any core type
THEN the destination SHALL contain the exact same component values as the source
AND no normalization, validation, or transformation SHALL be applied
AND this SHALL be explicitly documented in each type's `copy` TSDoc

### Requirement: Comparison methods MUST document scale sensitivity

Static comparison methods that use absolute epsilon thresholds on derived quantities (cross product, dot product) SHALL document their scale-sensitivity in `@remarks`.

#### Scenario: isParallel documents scale sensitivity

WHEN reviewing `Vector2.isParallel` documentation
THEN the `@remarks` SHALL explain that the cross product magnitude grows with vector length
AND it SHALL suggest normalizing vectors first for scale-invariant comparisons
AND the same documentation SHALL appear on the instance `isParallelTo` method

#### Scenario: isPerpendicular documents scale sensitivity

WHEN reviewing `Vector2.isPerpendicular` documentation
THEN the `@remarks` SHALL explain that the dot product magnitude grows with vector length
AND it SHALL suggest normalizing vectors first for scale-invariant comparisons
AND the same documentation SHALL appear on the instance `isPerpendicularTo` method
