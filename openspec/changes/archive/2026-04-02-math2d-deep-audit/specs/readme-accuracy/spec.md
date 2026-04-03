## ADDED Requirements

### Requirement: R-README-COLUMN-MAJOR

The README MUST state that matrices use **column-major** storage order, matching the actual implementation in `matrix2.ts` and `matrix3.ts`.

#### Scenario: User reads matrix convention documentation

- **WHEN** a user reads the matrix conventions section of the README
- **THEN** the documentation states "column-major" (not "row-major")
- **AND** both occurrences at the conventions summary and the detailed section are corrected

### Requirement: R-README-EXPORT-NAMES

The README MUST use the actual exported constant names: `DEG_TO_RAD` and `RAD_TO_DEG` (with underscores), not `DEG2RAD` or `RAD2DEG`.

#### Scenario: User copies import from README

- **WHEN** a user copies a constant import from the README examples
- **THEN** the import resolves successfully against the actual package exports

### Requirement: R-README-API-NAMES

The README MUST reference only methods that exist on the actual types. Specifically:

- `epsilonEquals` → `nearEquals` (the actual comparison method name)
- `normalize` (scalar standalone) → the actual function name in the codebase
- `p.length()` → `p.magnitude()` (Vector2 has `magnitude`, not `length`)

#### Scenario: User calls a method from README example

- **WHEN** a user calls a method shown in the README
- **THEN** the method exists on the type and compiles without error

### Requirement: R-README-SCOPE

The README MUST NOT claim that only Vector2 and Matrix2 are available. The scope description MUST acknowledge all implemented core types: Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2.

#### Scenario: User reads library scope

- **WHEN** a user reads the "what's included" section of the README
- **THEN** all 7 implemented core types are mentioned or the claim of limited types is removed

### Requirement: R-README-FREEZE-HELPERS

If the README lists freeze helper functions, it MUST list them for all core types that have them, not only Vector2 and Matrix2.

#### Scenario: User looks for freeze helpers

- **WHEN** a user searches the README for freeze functions
- **THEN** all available freeze helpers are documented or a general pattern is described
