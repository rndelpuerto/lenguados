## ADDED Requirements

### Requirement: assertRotation2Normalized validates unit constraint

The validation layer SHALL provide an `assertRotation2Normalized(cos, sin, tolerance?)` function that validates both finiteness AND the unit constraint cos² + sin² ≈ 1 within the given tolerance (default EPSILON). This function is tree-shakeable via DCE in production builds.

#### Scenario: Valid unit rotation passes

- **WHEN** calling `assertRotation2Normalized(0.6, 0.8)`
- **THEN** no error SHALL be thrown (0.36 + 0.64 = 1.0)

#### Scenario: Non-unit rotation throws

- **WHEN** calling `assertRotation2Normalized(2, 0)` with assertions enabled
- **THEN** an Error SHALL be thrown indicating the unit constraint violation
- **AND** the error message SHALL include the actual magnitude squared value

#### Scenario: Nearly-unit rotation within tolerance passes

- **WHEN** calling `assertRotation2Normalized(cos, sin)` where cos²+sin² = 1 + 1e-11
- **THEN** no error SHALL be thrown (within default EPSILON tolerance)

#### Scenario: Non-finite components throw

- **WHEN** calling `assertRotation2Normalized(NaN, 0)`
- **THEN** an Error SHALL be thrown indicating the component is not finite

#### Scenario: Production build DCE

- **WHEN** `DEV_MODE` is false
- **THEN** `assertRotation2Normalized` SHALL return immediately without validation

### Requirement: deterministic layer has zero upward dependencies

The `deterministic/` layer SHALL NOT import from `auxiliary/` or any higher layer. All exports from the deterministic barrel SHALL originate from files within the deterministic layer.

#### Scenario: sqrtSafe not re-exported from deterministic

- **WHEN** examining `deterministic/deterministic-kernels.ts` imports
- **THEN** there SHALL be zero import statements referencing `../auxiliary/`
- **AND** `sqrtSafe` SHALL be accessible via the `auxiliary/numeric/` barrel and the package main barrel

#### Scenario: sqrtSafe accessible from package barrel

- **WHEN** importing `{ sqrtSafe }` from `@lenguados/math2d`
- **THEN** the import SHALL resolve successfully via the auxiliary layer re-export
