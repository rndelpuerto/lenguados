## ADDED Requirements

### Requirement: Root README structure follows DX funnel pattern

The root `README.md` SHALL follow this section order:

1. Title + one-line tagline
2. Badge row (npm version, CI, coverage, bundle size, license, TypeScript)
3. Feature highlights (4-6 bullet points)
4. Installation (npm/yarn/pnpm)
5. Quick Start (under 10 lines of runnable code)
6. Packages table (monorepo packages with descriptions and links)
7. Documentation link (prominent link to docs site)
8. Contributing link
9. License section

The README SHALL NOT exceed 150 lines.

#### Scenario: Developer evaluates library in under 30 seconds

- **WHEN** a developer opens the root README on GitHub
- **THEN** they can see the project name, tagline, badges, and feature highlights without scrolling
- **AND** the badges convey project health (CI passing, coverage, version, size)

#### Scenario: Developer installs the package

- **WHEN** a developer reads the Installation section
- **THEN** they find copy-pasteable commands for npm, yarn, and pnpm
- **AND** the package name `@lenguados/math2d` is clearly stated

#### Scenario: Developer runs quick-start code

- **WHEN** a developer copies the Quick Start code block
- **THEN** the code compiles and runs without modification against the current package version
- **AND** the example demonstrates at least Vector2 and Transform2 usage

### Requirement: Root README badges are accurate and functional

The badge row SHALL include these badges in order:

1. **npm version** — links to npmjs.com package page
2. **CI status** — links to GitHub Actions workflow
3. **Coverage** — shows percentage, links to coverage report
4. **Bundle size** — shows minified+gzip size via bundlephobia
5. **License** — shows "Apache-2.0", links to LICENSE file
6. **TypeScript** — indicates TypeScript support

All badges SHALL use shields.io or bundlephobia badge URLs. All badge links SHALL resolve to valid URLs.

#### Scenario: Badge URLs resolve

- **WHEN** a user clicks any badge in the README
- **THEN** the link target loads successfully (not 404)

#### Scenario: npm badge shows current version

- **WHEN** the package is published to npm
- **THEN** the npm badge reflects the published version

### Requirement: Root README is English-first with bilingual description

The root README SHALL be written in English. A bilingual (EN/ES) description section MAY be included as a single section after the feature highlights. All other sections (installation, quick start, contributing, license) SHALL be in English only.

#### Scenario: Non-English speaker reads description

- **WHEN** a Spanish-speaking developer reads the README
- **THEN** they find a Spanish description of the project in the bilingual section

#### Scenario: Technical sections are in English

- **WHEN** a developer reads the Installation, Quick Start, or Contributing sections
- **THEN** all text, comments, and instructions are in English

### Requirement: Root README monorepo packages table

The README SHALL include a table listing all packages in the monorepo with columns: Package, Description, Version badge. The table SHALL include at minimum: `@lenguados/common`, `@lenguados/math2d`, `@lenguados/examples`.

#### Scenario: Developer identifies available packages

- **WHEN** a developer reads the Packages section
- **THEN** they see all monorepo packages with brief descriptions
- **AND** each package links to its own README or directory

### Requirement: Root README feature highlights are accurate

The feature highlights SHALL mention these differentiating capabilities:

- Deterministic math (cross-platform bit-exact results)
- Zero-allocation patterns (out parameter, static methods)
- Tree-shakeable validation (stripped in production)
- Strict/Safe/Unchecked error handling triality
- TypeScript-first with strict mode

Each highlight SHALL be one line (under 80 characters). No highlight SHALL claim features that do not exist in the current codebase.

#### Scenario: Developer reads feature highlight about determinism

- **WHEN** a developer reads the determinism highlight
- **THEN** the claim is verifiable by examining `src/deterministic/` source code

#### Scenario: No false claims

- **WHEN** each feature highlight is checked against the source code
- **THEN** every claimed capability exists and functions as described
