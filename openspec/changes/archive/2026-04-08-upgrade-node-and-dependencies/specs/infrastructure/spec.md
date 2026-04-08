## ADDED Requirements

### Requirement: Node.js 24 LTS runtime compatibility

All packages in the monorepo SHALL build, lint, test, and produce distribution artifacts successfully under Node.js 24 LTS (Krypton).

#### Scenario: Full pipeline passes on Node 24

- **WHEN** the project is cloned and `npm install && npm run build && npm test && npm run dist` is executed on Node.js 24.14.1
- **THEN** all commands complete with exit code 0 and test coverage thresholds (90% lines/statements/functions, 50% branches) are met

#### Scenario: Docs site builds on Node 24

- **WHEN** `npm run docs` is executed on Node.js 24.14.1
- **THEN** the Docusaurus site builds without errors

### Requirement: Deterministic math guarantees preserved after upgrade

The fdlibm-based deterministic math layer SHALL produce bit-identical results before and after the Node.js and dependency upgrade.

#### Scenario: Property-based tests pass unchanged

- **WHEN** the full test suite including `fast-check` property-based tests is executed on Node.js 24.14.1
- **THEN** all deterministic math tests pass with zero tolerance regressions

#### Scenario: Epsilon constant unchanged

- **WHEN** the `EPSILON` constant is inspected after upgrade
- **THEN** its value remains `1e-10` and all tolerance-based comparisons produce identical results

### Requirement: All dependencies at latest stable versions

All direct dependencies (devDependencies and dependencies) across the monorepo SHALL be upgraded to their latest stable (non-prerelease) versions.

#### Scenario: No outdated packages after upgrade

- **WHEN** `npm outdated` is executed after the upgrade
- **THEN** no packages report a newer stable version available (excluding intentionally pinned packages, which SHALL be documented)

### Requirement: Version references in documentation are accurate

All markdown documentation files that reference Node.js version, npm version, or engine requirements SHALL reflect the updated versions.

#### Scenario: Documentation mentions correct Node version

- **WHEN** a contributor reads any `.md` file in the repository that mentions a Node.js version requirement
- **THEN** the stated version matches or is consistent with the `.nvmrc` value (24.14.1) and the engines field (^24.14.0)

#### Scenario: CLAUDE.md reflects current stack

- **WHEN** `CLAUDE.md` is read
- **THEN** the Node.js version referenced matches the current `.nvmrc` value
