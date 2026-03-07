## ADDED Requirements

### Requirement: Normalization operations use overflow-safe magnitude computation

All `normalize()` and `normalizeSafe()` static methods on core types (Vector2, Complex) SHALL use `hypot()` from deterministic-kernels for magnitude computation, consistent with their corresponding `magnitude()` methods. This prevents overflow for components exceeding ~1e154 and underflow for components below ~1e-154.

The `normalizeUnchecked()` variants MAY use `Math.sqrt(x*x + y*y)` for performance, as the Unchecked contract permits undefined behavior on extreme inputs.

#### Scenario: Vector2 normalize uses hypot

- **WHEN** `Vector2.normalize({ x: 1e200, y: 1e200 })` is called
- **THEN** the result SHALL be a finite unit vector approximately `(SQRT_HALF, SQRT_HALF)` within EPSILON tolerance
- **AND** the computation SHALL NOT overflow during intermediate magnitude calculation

#### Scenario: Vector2 normalizeSafe uses hypot

- **WHEN** `Vector2.normalizeSafe({ x: 1e-200, y: 1e-200 })` is called
- **THEN** the result SHALL be a finite unit vector approximately `(SQRT_HALF, SQRT_HALF)` within EPSILON tolerance
- **AND** the computation SHALL NOT underflow to zero during intermediate magnitude calculation

#### Scenario: Complex normalize uses hypot

- **WHEN** `Complex.normalize({ real: 1e200, imag: 1e200 })` is called
- **THEN** the result SHALL be a finite unit complex number within EPSILON tolerance

#### Scenario: Unchecked variants may use fast path

- **WHEN** `Vector2.normalizeUnchecked(v)` is called with components in safe range (|component| < 1e150)
- **THEN** the result SHALL match `Vector2.normalize(v)` within EPSILON tolerance
- **AND** the implementation MAY use `Math.sqrt(x*x + y*y)` for performance

### Requirement: Zero-threshold consistency across normalization operations

All normalization-related operations on a given type SHALL use the same zero-detection threshold. Specifically, `normalize()`, `normalizeSafe()`, and `getLengthAndNormalize()` on Vector2 SHALL all use `isNearZero()` (EPSILON = 1e-10) as the zero-magnitude threshold.

No normalization operation SHALL use `EPSILON * EPSILON` (1e-20) or any other ad-hoc threshold that differs from the type's standard zero detection.

#### Scenario: getLengthAndNormalize uses same threshold as normalize

- **WHEN** `Vector2.getLengthAndNormalize({ x: 1e-11, y: 0 })` is called (magnitude below EPSILON)
- **THEN** the result SHALL be `{ length: 0, unit: Vector2(0, 0) }`, matching the behavior of `Vector2.normalizeSafe()` for the same input

#### Scenario: Boundary consistency between normalize and getLengthAndNormalize

- **GIVEN** a vector `v` with `magnitudeSq(v) = 5e-11` (between 1e-20 and 1e-10)
- **WHEN** both `Vector2.normalizeSafe(v)` and `Vector2.getLengthAndNormalize(v)` are called
- **THEN** both SHALL treat `v` as zero-length and return the zero fallback
