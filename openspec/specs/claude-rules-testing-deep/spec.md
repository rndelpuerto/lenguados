## ADDED Requirements

### Requirement: Property-based testing requirements

Rule file `.claude/rules/testing-deep-patterns.md` MUST specify when and how to use fast-check for property-based tests.

#### Scenario: Claude creates tests for a new core type method

- **WHEN** Claude writes tests for a mathematical operation (add, multiply, normalize, etc.)
- **THEN** it includes property-based tests verifying algebraic invariants
- **THEN** invariants tested include (as applicable): commutativity, associativity, identity element, inverse, idempotence, length preservation, round-trip (serialize/deserialize)

### Requirement: Custom arbitrary patterns

The rule MUST document the `test/arbitraries.ts` file and the convention for creating custom fast-check arbitraries.

#### Scenario: Claude adds a new math type

- **WHEN** Claude creates a new core type (e.g., AABB, Circle)
- **THEN** it adds corresponding arbitraries to `test/arbitraries.ts`
- **THEN** arbitraries filter out degenerate inputs (zero-length vectors, singular matrices) for general tests
- **THEN** separate arbitraries exist for edge-case inputs (near-zero, near-overflow)

### Requirement: Tolerance constants and usage

The rule MUST specify the exact tolerance values used in tests and their relationship to library constants.

#### Scenario: Claude writes a floating-point comparison in a test

- **WHEN** Claude compares floating-point results
- **THEN** it uses `toBeCloseTo(expected, 10)` where 10 corresponds to EPSILON = 1e-10
- **THEN** for property-based tests, it uses `TEST_TOLERANCE = 1e-6` (relaxed for random inputs)
- **THEN** it NEVER uses raw `===` for floating-point comparison (except for exact values like 0, 1, NaN checks)

### Requirement: Angular equality rules

The rule MUST specify that angle comparisons require `angleDifference()`, not `scalarNearEquals()`.

#### Scenario: Claude compares two rotation angles

- **WHEN** Claude needs to check if two angles represent the same rotation
- **THEN** it uses `angleDifference(a, b)` or `Rotation2.nearEquals()` — never `Math.abs(a - b) < epsilon`
- **THEN** the rationale is documented: π and -π represent the same rotation but differ by 2π

### Requirement: Dangerous-path testing (Unchecked variants)

The rule MUST specify that `*Unchecked` methods produce NaN/Infinity on invalid input, never throw.

#### Scenario: Claude writes tests for `normalizeUnchecked()`

- **WHEN** Claude tests an `*Unchecked` variant with invalid input (zero-length vector)
- **THEN** it asserts the result contains NaN or Infinity, NOT that it throws an error
- **THEN** a comment explains: "Unchecked methods follow IEEE 754 GIGO contract"

### Requirement: Test helper conventions

The rule MUST document `expectVecClose()` and similar helpers defined at the top of test files.

#### Scenario: Claude adds vector comparison assertions

- **WHEN** Claude needs to assert a Vector2 result
- **THEN** it uses the file-local `expectVecClose(v, x, y, digits)` helper
- **THEN** `digits` defaults to `DIGITS = 10` (matching EPSILON)

### Requirement: Path scoping

The rule MUST use `paths: ['packages/math2d/test/**']`.

#### Scenario: Claude edits source code

- **WHEN** Claude edits `packages/math2d/src/core/Vector2.ts`
- **THEN** the testing-deep-patterns rule is NOT loaded
