## ADDED Requirements

### Requirement: Core layer test coverage SHALL reach 95% statements

The core/ layer files SHALL achieve at minimum 95% statement coverage:

- `complex.ts`: from ~85% to 95%+
- `matrix2.ts`: from ~86% to 95%+
- `matrix3.ts`: from ~86% to 95%+
- `interval.ts`: from ~89% to 95%+

`validation/assert.ts` is excluded from this target (86% by design due to DCE guards in production).

#### Scenario: complex.ts coverage at 95%

- **WHEN** `npx jest --coverage --testPathPattern="core/complex"` is run
- **THEN** statement coverage for `complex.ts` SHALL be at least 95%

#### Scenario: matrix2.ts coverage at 95%

- **WHEN** `npx jest --coverage --testPathPattern="core/matrix2"` is run
- **THEN** statement coverage for `matrix2.ts` SHALL be at least 95%

#### Scenario: matrix3.ts coverage at 95%

- **WHEN** `npx jest --coverage --testPathPattern="core/matrix3"` is run
- **THEN** statement coverage for `matrix3.ts` SHALL be at least 95%

#### Scenario: interval.ts coverage at 95%

- **WHEN** `npx jest --coverage --testPathPattern="core/interval"` is run
- **THEN** statement coverage for `interval.ts` SHALL be at least 95%

### Requirement: Near-singular matrix tests SHALL be added to boundary test suite

Boundary tests for near-singular matrix operations SHALL be added to `test/boundaries/` covering the EPSILON threshold for matrix inversion and transform inversion.

#### Scenario: Boundary test file exists

- **WHEN** the test directory is examined
- **THEN** a boundary test file covering near-singular matrix operations SHALL exist

#### Scenario: Matrix2 determinant boundary tested

- **WHEN** a Matrix2 with determinant varying from 1e-15 to 1e-5 is tested
- **THEN** the transition from throwing to succeeding SHALL occur at the EPSILON boundary

#### Scenario: Transform2 scale boundary tested

- **WHEN** a Transform2 with scale varying from 0 to 1e-5 is tested
- **THEN** the transition from throwing to succeeding SHALL be documented and tested
