## ADDED Requirements

### Requirement: math2d README follows npm package conventions

The `packages/math2d/README.md` SHALL follow this section order:

1. Title + one-line description
2. Badge row (npm version, bundle size, TypeScript)
3. Feature highlights (3-5 bullets specific to math2d)
4. Installation
5. Quick Start (under 15 lines showing core API patterns)
6. API Overview table (grouped by layer: auxiliary, core, deterministic, utils, validation)
7. Key Concepts section (brief explanations of: triality, out parameter, CS variants, apply vs transform)
8. Performance Tips (condensed from current README)
9. Documentation link
10. License

The README SHALL NOT exceed 250 lines.

#### Scenario: Developer understands API surface quickly

- **WHEN** a developer reads the API Overview table
- **THEN** they can see all 7 core types with one-line descriptions
- **AND** the table groups exports by architectural layer

#### Scenario: Developer understands key patterns

- **WHEN** a developer reads the Key Concepts section
- **THEN** they understand the strict/safe/unchecked pattern, out parameter convention, and CS variants
- **AND** each concept is explained in 2-3 sentences maximum

### Requirement: math2d README quick-start demonstrates core patterns

The Quick Start code example SHALL demonstrate:

1. Importing from `@lenguados/math2d`
2. Creating a Vector2
3. Using a static method with `out` parameter
4. Using instance method chaining
5. At least one Transform2 or Matrix3 operation

The code SHALL compile against the current package exports without modification.

#### Scenario: Quick-start code compiles

- **WHEN** the Quick Start code is placed in a TypeScript file with `@lenguados/math2d` imported
- **THEN** `tsc --noEmit` succeeds with no errors

#### Scenario: Quick-start shows allocation-free pattern

- **WHEN** a developer reads the Quick Start
- **THEN** at least one example shows the `out` parameter pattern for allocation control

### Requirement: math2d README API table references only existing exports

The API Overview table SHALL list only symbols that are actually exported from `packages/math2d/src/index.ts`. Every type name, function name, and constant name in the table SHALL match an export exactly (case-sensitive).

#### Scenario: Every table entry resolves to an export

- **WHEN** each entry in the API Overview table is checked against the package's `index.ts` exports
- **THEN** every listed name exists as a named export

#### Scenario: No phantom API entries

- **WHEN** the table lists a method like `Vector2.length()`
- **THEN** that method SHALL exist on the Vector2 class (not `magnitude` when table says `length`, etc.)

### Requirement: math2d README does not duplicate full API reference

The README SHALL NOT include inline method signatures, parameter lists, or return types for individual methods. The API Overview section SHALL be a summary table linking to the docs site for full reference.

#### Scenario: No inline method documentation

- **WHEN** a developer searches the README for `@param` or method signature blocks
- **THEN** no method-level parameter documentation is found (only the Quick Start code examples)

### Requirement: math2d README performance section is concise

The Performance Tips section SHALL be a maximum of 30 lines covering:

- `out` parameter for allocation control (2-3 lines + 1 code example)
- `*CS` variants for pre-computed cos/sin (2-3 lines + 1 code example)
- `*Unchecked` variants for validated hot paths (2-3 lines)
- Link to full performance guide in docs

#### Scenario: Performance section fits in one screen

- **WHEN** a developer reads the Performance Tips section
- **THEN** the entire section is visible without scrolling on a standard terminal (< 30 lines)
