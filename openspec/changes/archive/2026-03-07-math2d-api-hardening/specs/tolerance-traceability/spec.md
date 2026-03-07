## ADDED Requirements

### Requirement: Every tolerance-using function SHALL document its tolerance constant

Each public function that performs floating-point comparison using a tolerance constant SHALL include a `@remarks` JSDoc tag stating which constant it uses. The two tolerance constants in active use are:

- `EPSILON` (1e-10): General geometric comparisons (nearEquals, isNearZero, isIdentity, isOrthogonal, isInvertible, normalizeSafe, inverseSafe, etc.)
- `MIN_SAFE_DIVISOR`: Safe division guard (safeDivide, safeReciprocal, and functions that delegate to them)

Note: ANGLE_EPSILON and ITERATIVE_TOLERANCE do not exist in the codebase. All angle comparisons use EPSILON. All tolerance-using functions accept an optional `tolerance` or `epsilon` parameter with EPSILON as the default.

#### Scenario: nearEquals documents EPSILON usage

- **WHEN** a developer reads the JSDoc for `nearEquals(a, b, tolerance?)`
- **THEN** the `@remarks` tag SHALL state: "Uses EPSILON (1e-10) as the default tolerance"

#### Scenario: safeDivide documents MIN_SAFE_DIVISOR usage

- **WHEN** a developer reads the JSDoc for `safeDivide(a, b, fallback?)`
- **THEN** the `@remarks` tag SHALL state: "Uses MIN_SAFE_DIVISOR as the minimum divisor threshold"

#### Scenario: Core type isIdentity documents EPSILON usage

- **WHEN** a developer reads the JSDoc for `Matrix2.isIdentity()` or `Rotation2.isIdentity()`
- **THEN** the `@remarks` tag SHALL state which tolerance constant is used for the comparison

### Requirement: Tolerance documentation SHALL be co-located with function, not in a separate file

Tolerance information SHALL be documented via `@remarks` JSDoc tags on each function, NOT in a separate mapping document. This ensures IDE tooltip discoverability and prevents documentation drift.

#### Scenario: IDE tooltip shows tolerance info

- **WHEN** a developer hovers over `Matrix2.isIdentity()` in an IDE with TypeScript support
- **THEN** the tooltip SHALL include the `@remarks` text identifying the tolerance constant

#### Scenario: No separate tolerance mapping document

- **WHEN** the codebase is searched for a standalone tolerance-mapping document
- **THEN** no such document SHALL exist; all tolerance information SHALL be in JSDoc `@remarks` tags
