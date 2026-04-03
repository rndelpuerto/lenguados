## ADDED Requirements

### Requirement: Matrix2 eigenvalue decomposition

The system SHALL provide `Matrix2.eigenvalues(matrix)` that computes the eigenvalues of a 2x2 matrix using the closed-form quadratic solution on the characteristic polynomial `lambda^2 - trace*lambda + det = 0`.

The discriminant `d = trace^2 - 4*det` determines the result type:

- When `d >= 0` (real eigenvalues): SHALL return `{ type: 'real', lambda1: number, lambda2: number }` where `lambda1 >= lambda2`.
- When `d < 0` (complex conjugate eigenvalues): SHALL return `{ type: 'complex', realPart: number, imaginaryPart: number }` representing `realPart +/- imaginaryPart*i`.

The system SHALL also provide `Matrix2.eigendecompose(matrix)` that returns eigenvalues AND eigenvectors when eigenvalues are real. For complex eigenvalues, eigenvectors SHALL NOT be returned (they would require Complex-valued vectors).

**Mathematical basis**: For a 2x2 matrix `[[a,b],[c,d]]`, the eigenvalues satisfy `lambda = (trace +/- sqrt(trace^2 - 4*det)) / 2` where `trace = a+d` and `det = a*d - b*c`. This is the standard closed-form solution. Present in Eigen, NumPy, Apache Commons Math, Boost, and MathNet (5/7 reference math libraries).

**Synergy**: Builds on existing `Matrix2.determinant()`, `Matrix2.trace()`, and `Matrix2.decompose()`. Enables characterizing 2D linear transformations (pure rotation vs scale vs shear), principal axis analysis, and stability analysis of 2D dynamical systems.

#### Scenario: Real distinct eigenvalues (diagonal matrix)

- **WHEN** `Matrix2.eigenvalues(Matrix2.fromValues(2, 0, 0, 3))` is called
- **THEN** the result SHALL have `type: 'real'` with `lambda1: 3, lambda2: 2`

#### Scenario: Real repeated eigenvalue (identity)

- **WHEN** `Matrix2.eigenvalues(Matrix2.IDENTITY)` is called
- **THEN** the result SHALL have `type: 'real'` with `lambda1: 1, lambda2: 1`

#### Scenario: Complex conjugate eigenvalues (rotation matrix)

- **WHEN** `Matrix2.eigenvalues(Matrix2.ROTATE_90)` is called
- **THEN** the result SHALL have `type: 'complex'` with `realPart: 0` and `imaginaryPart` near `1` (within EPSILON tolerance)

#### Scenario: Symmetric matrix has real eigenvalues and orthogonal eigenvectors

- **WHEN** `Matrix2.eigendecompose(symmetricMatrix)` is called on a symmetric 2x2 matrix
- **THEN** the eigenvalues SHALL be real and the eigenvectors SHALL be orthogonal (dot product near zero within EPSILON tolerance)

#### Scenario: Eigenvalue-trace-determinant consistency

- **WHEN** eigenvalues `{lambda1, lambda2}` are computed for any 2x2 matrix
- **THEN** `lambda1 + lambda2` SHALL equal `Matrix2.trace(matrix)` within EPSILON tolerance
- **AND** `lambda1 * lambda2` SHALL equal `Matrix2.determinant(matrix)` within EPSILON tolerance

### Requirement: Matrix3 solveLinearSystem with triality

The system SHALL provide `Matrix3.solveLinearSystem(matrix, b, out?)`, `Matrix3.solveLinearSystemSafe(matrix, b, out?)`, and `Matrix3.solveLinearSystemUnchecked(matrix, b, out?)` that solve the 3x3 linear system `Ax = b` using Cramer's rule.

This is a natural extension of the existing `Matrix2.solveLinearSystem` (which already has full triality and uses `ReadonlyVector2Like` for `b` and returns `Vector2`). The implementation SHALL reuse the existing `Matrix3.determinant()` and cofactor infrastructure.

**Design note on types**: Since the library has no `Vector3` type (this is a 2D math library where Matrix3 serves as a homogeneous coordinate container for 2D affine transforms), the `b` parameter SHALL be a 3-element readonly tuple `readonly [number, number, number]` and the result SHALL be returned as a `[number, number, number]` tuple. This follows the pattern established by `Matrix3.fromColumns` and `Matrix3.fromRows` which already use 3-element tuples for column/row data.

The strict variant SHALL throw when `|determinant| <= EPSILON`. The safe variant SHALL return `[0, 0, 0]`. The unchecked variant SHALL skip validation.

**Mathematical basis**: Cramer's rule for 3x3: `x_i = det(A_i) / det(A)` where `A_i` is `A` with column `i` replaced by `b`. Present in Eigen, NumPy, Apache Commons Math, Boost, and MathNet (5/7 reference math libraries).

#### Scenario: Solve identity system

- **WHEN** `Matrix3.solveLinearSystem(Matrix3.IDENTITY, [1, 2, 3])` is called
- **THEN** the result SHALL be `[1, 2, 3]`

#### Scenario: Solve general invertible system

- **WHEN** `Matrix3.solveLinearSystem(A, b)` is called with an invertible matrix A and `b = [b0, b1, b2]`
- **THEN** the result `[x0, x1, x2]` SHALL satisfy the system component-wise: `A.m00*x0 + A.m10*x1 + A.m20*x2` SHALL be near-equal to `b0`, `A.m01*x0 + A.m11*x1 + A.m21*x2` SHALL be near-equal to `b1`, and `A.m02*x0 + A.m12*x1 + A.m22*x2` SHALL be near-equal to `b2`, all within EPSILON tolerance

#### Scenario: Singular matrix strict throws

- **WHEN** `Matrix3.solveLinearSystem(Matrix3.ZERO, [1, 2, 3])` is called
- **THEN** the function SHALL throw (determinant is zero)

#### Scenario: Singular matrix safe returns fallback

- **WHEN** `Matrix3.solveLinearSystemSafe(Matrix3.ZERO, [1, 2, 3])` is called
- **THEN** the function SHALL return `[0, 0, 0]`

#### Scenario: Unchecked skips validation

- **WHEN** `Matrix3.solveLinearSystemUnchecked(invertibleMatrix, b)` is called
- **THEN** the function SHALL compute the result without checking the determinant
