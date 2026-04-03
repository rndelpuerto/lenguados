## ADDED Requirements

### Requirement: Rotation2.fromMatrix2 uses direct column extraction

`Rotation2.fromMatrix2` SHALL extract `cos` and `sin` directly from the matrix columns (`cos = m00`, `sin = m01`) and normalize via `hypot`, instead of round-tripping through `atan2` and `fromAngle`.

#### Scenario: Direct extraction from pure rotation matrix

- **WHEN** `Rotation2.fromMatrix2` is called with a rotation matrix for 45 degrees `(cos45, -sin45, sin45, cos45)`
- **THEN** the result SHALL have `cos` and `sin` values within `1e-15` of the input matrix values (no trig round-trip error)

#### Scenario: Extraction from scaled rotation matrix

- **WHEN** `Rotation2.fromMatrix2` is called with a matrix that includes scaling `(2*cos30, -2*sin30, 2*sin30, 2*cos30)`
- **THEN** the result SHALL be normalized to unit length (cos² + sin² = 1 within EPSILON)
- **AND** the rotation angle SHALL match the original 30-degree rotation

#### Scenario: Near-zero magnitude matrix

- **WHEN** `Rotation2.fromMatrix2` is called with a near-zero matrix `(1e-15, 0, 0, 1e-15)`
- **THEN** the strict version SHALL throw an assertion error
- **AND** the safe version (`fromMatrix2Safe` if it exists) SHALL return identity

#### Scenario: Precision improvement over atan2 round-trip

- **WHEN** comparing the old approach (`atan2(m01, m00)` → `fromAngle`) vs direct extraction for 1000 random rotation matrices
- **THEN** the direct extraction SHALL produce results with equal or better precision (measured as `|cos² + sin² - 1|`)

## REMOVED Requirements

### Requirement: ITERATIVE_TOLERANCE constant

**Reason**: Zero consumers in the codebase. Not used by any iterative solver or convergence check.
**Migration**: Users who need an iterative tolerance should define their own constant appropriate to their use case.

### Requirement: MAX_SAFE_INTEGER_F64 constant

**Reason**: Pure alias for `Number.MAX_SAFE_INTEGER` with no abstraction or encapsulation value.
**Migration**: Use `Number.MAX_SAFE_INTEGER` directly.

### Requirement: E constant (Euler's number)

**Reason**: Pure alias for `Math.E` with zero consumers. Not relevant for 2D physics operations.
**Migration**: Use `Math.E` directly.

### Requirement: GOLDEN_RATIO constant

**Reason**: Zero consumers in the codebase. Not geometrically relevant for 2D physics. Resolves prior audit contradiction.
**Migration**: Use `(1 + Math.sqrt(5)) / 2` directly if needed.

### Requirement: GOLDEN_RATIO_CONJUGATE constant

**Reason**: Zero consumers. Companion to GOLDEN_RATIO which is also removed.
**Migration**: Use `(Math.sqrt(5) - 1) / 2` directly if needed.
