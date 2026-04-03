## ADDED Requirements

### Requirement: `Matrix2.eigenvalues` SHALL handle degenerate matrices correctly

The closed-form eigenvalue decomposition added in `audit-missing-operations` must correctly handle all mathematical edge cases including the zero matrix, repeated eigenvalues (zero discriminant), and negative eigenvalues.

#### Scenario: eigenvalues of zero matrix

- **WHEN** `Matrix2.eigenvalues({ a: 0, b: 0, c: 0, d: 0 })` is called
- **THEN** the result SHALL have `type: 'real'`, `lambda1 = 0`, `lambda2 = 0`

#### Scenario: eigenvalues of Jordan block with repeated eigenvalue

- **WHEN** `Matrix2.eigenvalues({ a: 2, b: 1, c: 0, d: 2 })` is called
- **THEN** the result SHALL have `type: 'real'`, `lambda1 = 2`, `lambda2 = 2` (discriminant = 0)

#### Scenario: eigenvalues of matrix with negative real eigenvalues

- **WHEN** `Matrix2.eigenvalues({ a: -1, b: 0, c: 0, d: -2 })` is called
- **THEN** the result SHALL have `type: 'real'`, eigenvalues SHALL be `-1` and `-2` (in either order)
- **AND** the trace SHALL equal `lambda1 + lambda2 = -3`
- **AND** the determinant SHALL equal `lambda1 * lambda2 = 2`

### Requirement: `Matrix2.solveLinearSystemUnchecked` SHALL follow GIGO contract

`Matrix2.solveLinearSystemUnchecked` is an Unchecked method. Per the GIGO contract documented in `testing-deep-patterns.md`: Unchecked methods do NOT throw on invalid input; they produce NaN or Infinity.

#### Scenario: solveLinearSystemUnchecked with singular matrix produces NaN or Infinity (GIGO)

- **WHEN** `Matrix2.solveLinearSystemUnchecked(singularMatrix, { x: 1, y: 1 })` is called
  where `singularMatrix` has determinant 0 (e.g., `{ a: 1, b: 2, c: 2, d: 4 }`)
- **THEN** the result SHALL NOT throw
- **AND** the result SHALL contain `NaN` or `Infinity` components (IEEE 754 division by zero)

### Requirement: `Matrix3.solveLinearSystemUnchecked` SHALL follow GIGO contract

`Matrix3.solveLinearSystemUnchecked` is an Unchecked method and MUST NOT throw on a singular matrix.

#### Scenario: solveLinearSystemUnchecked with singular matrix produces NaN or Infinity (GIGO)

- **WHEN** `Matrix3.solveLinearSystemUnchecked(singularMatrix, rhs)` is called
  where `singularMatrix` has determinant 0
- **THEN** the result SHALL NOT throw
- **AND** at least one component of the result tuple SHALL be `NaN` or `Infinity`
