## ADDED Requirements

### Requirement: Root CONTRIBUTING.md is a comprehensive onboarding guide

The root `CONTRIBUTING.md` SHALL contain these sections:

1. **Welcome** — Brief welcome and link to Code of Conduct (if exists) or conduct expectations
2. **Prerequisites** — Required tools: Node.js 22.14.0 (reference .nvmrc), npm, Git
3. **Getting Started** — Clone, nvm use, npm install, npm run build, npm test
4. **Development Workflow** — Branch naming, conventional commits format, PR process
5. **Commit Conventions** — Conventional commits with examples (feat, fix, docs, refactor, test, chore)
6. **Code Style** — ESLint + Prettier + Stylelint; run `npm run lint:fix` before committing; pre-commit hook handles staged files
7. **Testing** — How to run tests, add tests, test naming conventions; link to math2d testing docs
8. **Package-Specific Guides** — Link to `packages/math2d/CONTRIBUTING.md` for architecture-specific conventions
9. **Reporting Issues** — GitHub issues, bug report template guidance
10. **License** — Apache 2.0 contribution terms

The guide SHALL NOT exceed 200 lines.

#### Scenario: New contributor sets up environment

- **WHEN** a new contributor follows the Getting Started section
- **THEN** they can clone, install, build, and run tests successfully

#### Scenario: Contributor understands commit format

- **WHEN** a contributor reads the Commit Conventions section
- **THEN** they see examples of valid conventional commits for each type (feat, fix, docs, etc.)
- **AND** they understand that commitlint enforces the format

#### Scenario: Contributor finds package-specific guide

- **WHEN** a contributor wants to add a new math type
- **THEN** the root CONTRIBUTING.md links to `packages/math2d/CONTRIBUTING.md` for detailed conventions

### Requirement: math2d CONTRIBUTING.md is accurate and current

The `packages/math2d/CONTRIBUTING.md` SHALL be reviewed and updated to ensure:

- All referenced file paths exist in the current codebase
- All referenced commands work (build, test, lint)
- The architecture overview matches the current layer structure
- The error handling convention section reflects current triality patterns
- The API conventions section matches current coding patterns

#### Scenario: Referenced paths exist

- **WHEN** every file path mentioned in math2d CONTRIBUTING.md is checked
- **THEN** each path resolves to an existing file in the current repository

#### Scenario: Commands work

- **WHEN** every command in the Build & Test section is executed
- **THEN** each command completes successfully

### Requirement: Root CONTRIBUTING.md references Git hooks

The root CONTRIBUTING.md SHALL document the existing Git hooks:

- **pre-commit**: lint-staged runs ESLint, Stylelint, and Prettier on staged files
- **pre-push**: runs full Jest test suite
- **commitlint**: enforces conventional commits

Contributors SHALL be informed that these hooks run automatically and should not be bypassed.

#### Scenario: Contributor understands pre-commit hook

- **WHEN** a contributor reads about Git hooks
- **THEN** they understand that staged files are auto-linted on commit
- **AND** they know not to use `--no-verify`
