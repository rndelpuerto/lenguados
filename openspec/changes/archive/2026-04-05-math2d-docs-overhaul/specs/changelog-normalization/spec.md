## ADDED Requirements

### Requirement: CHANGELOG follows Keep a Changelog format

The root `CHANGELOG.md` SHALL follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with:

- A title line: `# Changelog`
- A description line referencing Keep a Changelog and Semantic Versioning
- Sections per version in reverse chronological order: `## [version] - YYYY-MM-DD`
- An `## [Unreleased]` section at the top for pending changes
- Change categories in this order (when present): `### Added`, `### Changed`, `### Deprecated`, `### Removed`, `### Fixed`, `### Security`
- Each entry as a bullet point starting with the affected module/area in bold

#### Scenario: Version section format

- **WHEN** a released version section is inspected
- **THEN** it follows the format `## [0.6.0] - 2025-09-27`
- **AND** subsections use `### Added`, `### Changed`, `### Fixed`, etc.

#### Scenario: Unreleased section exists

- **WHEN** the CHANGELOG is inspected
- **THEN** an `## [Unreleased]` section exists at the top containing changes not yet released

#### Scenario: Category ordering

- **WHEN** a version has both Added and Fixed entries
- **THEN** `### Added` appears before `### Fixed`

### Requirement: CHANGELOG captures all significant changes

The CHANGELOG SHALL document all significant changes from the 31 archived OpenSpec changes, covering at minimum:

- Expert review fixes (Transform2.inverse, Complex.divide Smith's algorithm, SeededRandomSource xoshiro128++)
- TSDoc documentation standard formalization
- ESLint doc enforcement (Phase 1 and Phase 2)
- Category grouping consistency
- Code review findings and fixes
- Audit closures (15 critical L0 gaps)

#### Scenario: Expert review fixes documented

- **WHEN** a developer reads the Unreleased or latest version section
- **THEN** entries exist for Transform2.inverse fix, Complex.divide Smith's algorithm, and SeededRandomSource improvements

#### Scenario: Documentation work documented

- **WHEN** a developer reads the changelog
- **THEN** the TSDoc standard formalization and ESLint enforcement phases are documented under appropriate categories

### Requirement: CHANGELOG entries reference affected area

Each changelog entry SHALL start with the affected module or area in bold, followed by a colon and the change description. Format: `- **area**: description`.

#### Scenario: Entry format

- **WHEN** a changelog entry about Vector2 is inspected
- **THEN** it reads like: `- **Vector2**: Added fromPolar factory method` (bold area prefix)

#### Scenario: Cross-cutting entry

- **WHEN** a change affects multiple modules
- **THEN** it uses a general area like `- **math2d**: Formalized TSDoc documentation standard`
