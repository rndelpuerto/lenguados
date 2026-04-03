## MODIFIED Requirements

### Requirement: R-README-SCOPE

The README SHALL NOT claim limited scope. The scope description SHALL acknowledge the full architecture: 7 core types (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2), auxiliary modules (scalar, angle, numeric), deterministic math kernels, tree-shakeable validation, and utility functions (random, parse, performance). The scope description SHALL match the API Overview table.

#### Scenario: User reads library scope

- **WHEN** a user reads the math2d README description or API Overview section
- **THEN** all 7 core types are listed in the API Overview table
- **AND** auxiliary, deterministic, validation, and utility layers are represented

#### Scenario: Scope matches actual exports

- **WHEN** the scope description is compared to `packages/math2d/src/index.ts` exports
- **THEN** no exported category is omitted from the overview

### Requirement: R-README-API-NAMES

The README SHALL reference only methods and properties that exist on the actual types. All code examples, API tables, and text references SHALL use exact export names from the package. Specifically:

- Comparison method: `nearEquals` (not `epsilonEquals`)
- Vector magnitude: `magnitude` (not `length`)
- Constants: `DEG_TO_RAD`, `RAD_TO_DEG` (with underscores, not `DEG2RAD`/`RAD2DEG`)
- Freeze helpers: listed for all types that have them (not just Vector2 and Matrix2)

#### Scenario: User copies import from README

- **WHEN** a user copies any import statement or method call from the README
- **THEN** it resolves successfully against the current package exports

#### Scenario: User calls a method from README example

- **WHEN** a user calls any method shown in the README
- **THEN** the method exists on the type and compiles without error

#### Scenario: All code examples compile

- **WHEN** every code block in the README is extracted and type-checked
- **THEN** all code compiles against the current `@lenguados/math2d` package with no type errors

## ADDED Requirements

### Requirement: R-README-CODE-EXAMPLES-VERIFIED

Every code example in both the root README and math2d README SHALL be verified against the current source code before inclusion. Verification SHALL confirm:

1. All imported names exist as exports
2. All method calls reference existing methods with correct signatures
3. All property accesses reference existing properties
4. The example produces the described result

#### Scenario: Import verification

- **WHEN** a code example imports `{ Vector2, Transform2, nearEquals }` from `@lenguados/math2d`
- **THEN** all three names are verified as exports in `src/index.ts`

#### Scenario: Method signature verification

- **WHEN** a code example calls `Vector2.add(a, b, out)`
- **THEN** the static `add` method on Vector2 accepts those parameters with those types

#### Scenario: NaN/Infinity edge case in example

- **WHEN** a code example demonstrates edge case handling (e.g., normalizing a zero vector)
- **THEN** the described behavior matches the actual implementation (throws, returns fallback, or is undefined depending on variant)
