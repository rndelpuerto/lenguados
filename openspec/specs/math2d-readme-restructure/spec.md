## ADDED Requirements

### Requirement: math2d README follows npm package conventions

The `packages/math2d/README.md` SHALL follow this section order:

1. Title + one-line description
2. Badge row (npm version, bundle size, TypeScript)
3. Feature highlights (3-5 bullets specific to math2d)
4. Installation
5. Quick Start (under 15 lines showing core API patterns)
6. API Overview table (grouped by layer: Core Types, Auxiliary, Deterministic, Validation, Utilities)
7. Key Concepts section (brief explanations of: triality, out parameter, CS variants, apply vs transform)
8. Performance Tips (condensed, max 30 lines)
9. Math Conventions (angles, matrices, transforms, tolerance)
10. Documentation links (pointing to Docusaurus site)
11. License

The Documentation section SHALL link to the Docusaurus site pages and root-level files using **absolute GitHub URLs** (required because npm always publishes README.md and relative links break on npmjs.org). Specifically:

- Architecture → `ARCHITECTURE.md` (local — same directory, resolves on both GitHub and npm)
- Contributing → `https://github.com/rndelpuerto/lenguados/blob/main/CONTRIBUTING.md`
- TSDoc Standard → `https://github.com/rndelpuerto/lenguados/blob/main/docs/docs/contributing/tsdoc-standard.md`
- Changelog → `CHANGELOG.md` (relative is OK — same directory, resolves on both GitHub and npm)
- Deployed docs site → `https://rndelpuerto.github.io/lenguados/docs/`

The README SHALL NOT link to any file in `packages/math2d/docs/` (which no longer exists).
The README SHALL NOT link to `ARCHITECTURE.md`, `CONTRIBUTING.md`, or `DOCUMENTATION_STANDARD.md` at the package root (which no longer exist).
The README SHALL NOT exceed 250 lines.

#### Scenario: Documentation links resolve

- **WHEN** every link in the README Documentation section is followed
- **THEN** each link resolves to an existing file in the repository

#### Scenario: No broken local references

- **WHEN** the README is searched for links to `ARCHITECTURE.md`, `CONTRIBUTING.md`, or `DOCUMENTATION_STANDARD.md`
- **THEN** no links point to files at `packages/math2d/` root (these files have been removed)
- **AND** no links point to files in `packages/math2d/docs/` (directory has been removed)

#### Scenario: Developer understands API surface quickly

- **WHEN** a developer reads the API Overview table
- **THEN** they can see all 7 core types with one-line descriptions
- **AND** the table groups exports by architectural layer

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

### Requirement: Root README documentation section updated

The monorepo root `README.md` Documentation section SHALL be updated to reflect the new file locations. Specifically:

- Architecture link SHALL point to the Docusaurus docs path (`docs/docs/math2d/architecture.md`), NOT to `packages/math2d/ARCHITECTURE.md` (which no longer exists)
- All other links SHALL resolve to existing files

#### Scenario: Root README links resolve

- **WHEN** every link in the root `README.md` is followed
- **THEN** each link resolves to an existing file
- **AND** no link points to `packages/math2d/ARCHITECTURE.md`

### Requirement: Docusaurus intro page rewritten

The `docs/docs/intro.md` SHALL be rewritten from its current state (default Docusaurus template, mostly commented out) to serve as a proper Getting Started page for the lenguados project.

The page SHALL contain:

1. Brief project description (what lenguados is)
2. Installation command
3. Minimal code example (import and use Vector2)
4. Links to the math2d section, contributing section, and API reference
5. Sidebar position 1 (already correct)

The page SHALL NOT contain Docusaurus boilerplate text about "creating a new site" or "running the development server".

#### Scenario: Intro page is project-specific

- **WHEN** a user navigates to the docs site landing page
- **THEN** they see lenguados-specific content, not Docusaurus template text

#### Scenario: Intro page has working code example

- **WHEN** the intro page code example is inspected
- **THEN** it uses actual `@lenguados/math2d` imports and compiles against current exports
