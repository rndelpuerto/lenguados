## ADDED Requirements

### Requirement: Root CONTRIBUTING.md is a comprehensive onboarding guide

The root `CONTRIBUTING.md` SHALL contain these sections:

1. **Welcome** — Brief welcome and contribution terms (Apache 2.0)
2. **Prerequisites** — Required tools: Node.js 24.14.1 (reference .nvmrc), npm, Git
3. **Getting Started** — Clone, nvm install, nvm use, npm install, npm run build, npm test
4. **Development Workflow** — Branch naming, conventional commits format, PR process
5. **Commit Conventions** — Conventional commits with type table and examples (feat, fix, docs, refactor, test, chore, perf)
6. **Git Hooks** — pre-commit (lint-staged), pre-push (tests), commit-msg (commitlint); explicit note to never use `--no-verify`
7. **Code Style** — ESLint + Prettier + Stylelint; `npm run lint:fix` and `npm run format`
8. **Testing** — How to run tests (`npm run test:unit`, `npx jest --testPathPattern=...`, `npm run test:watch`), test naming conventions (`*.node.spec.ts`, `*.dom.spec.ts`)
9. **math2d API Conventions** — Absorb key patterns from the former package-level CONTRIBUTING.md:
   - **Static + Instance**: Static methods accept `out?` param; instance methods mutate `this` and return `this` for chaining
   - **Triality**: `op()` (strict, throws), `opSafe()` (returns fallback), `opUnchecked()` (no validation) — note suffix naming: `divideSafe` not `safeDivide`
   - **CS variants**: Pre-computed cos/sin for hot loops (`rotateCS(cos, sin)`)
   - **Apply vs Transform**: `apply` for operators (Rotation2), `transform` for spatial (Matrix3)
   - **`*Like` interfaces**: Input params use `Readonly*Like`; outputs use concrete types
   - **`out` parameter**: Always last optional param, enables allocation-free hot paths
10. **Detailed Guides** — Links to Docusaurus contributing pages:
    - [TSDoc Standard](docs/docs/contributing/tsdoc-standard.md) — canonical tag order, templates, vocabulary
    - [Testing Strategy](docs/docs/contributing/testing-strategy.md) — property-based testing with fast-check
    - [Design Philosophy](docs/docs/contributing/design-philosophy.md) — POA, SOLID deviations
11. **Reporting Issues** — GitHub issues guidance with link
12. **License** — Apache 2.0 contribution terms

The guide SHALL NOT exceed 250 lines.

The guide SHALL link to Docusaurus contributing pages for depth using relative paths from the root (`docs/docs/contributing/tsdoc-standard.md`).

#### Scenario: New contributor sets up environment

- **WHEN** a new contributor follows the Getting Started section
- **THEN** they can clone, install, build, and run tests successfully

#### Scenario: math2d API patterns documented in root guide

- **WHEN** a contributor reads the math2d API Conventions section
- **THEN** they understand the out parameter pattern, triality (including suffix naming), and CS variants
- **AND** they find links to Docusaurus for detailed explanations

#### Scenario: No separate package-level CONTRIBUTING.md needed

- **WHEN** a contributor looks for contribution guidelines
- **THEN** the root `CONTRIBUTING.md` is the single entry point
- **AND** `packages/math2d/CONTRIBUTING.md` does not exist

#### Scenario: Links to Docusaurus guides resolve

- **WHEN** the "Detailed Guides" section links are followed
- **THEN** each link resolves to an existing file in the `docs/docs/contributing/` directory

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

### Requirement: CLAUDE.md references updated

The monorepo root `CLAUDE.md` SHALL be updated to reflect moved files:

1. Any reference to `packages/math2d/ARCHITECTURE.md` SHALL be updated to point to `docs/docs/math2d/architecture.md`
2. Any reference to `packages/math2d/CONTRIBUTING.md` SHALL be removed (content absorbed into root CONTRIBUTING.md)
3. The `@lenguados/math2d Architecture` section SHALL remain as a brief summary (it serves AI context, not human docs) but SHALL NOT contradict the authoritative architecture page
4. `.claude/rules/math2d-patterns.md` SHALL be verified to not reference any deleted files

#### Scenario: CLAUDE.md references all resolve

- **WHEN** every file path mentioned in `CLAUDE.md` is checked
- **THEN** each path resolves to an existing file

#### Scenario: CLAUDE.md function names are accurate

- **WHEN** `CLAUDE.md` lists function names as examples
- **THEN** they match actual export names (e.g., `divideSafe` not `safeDivide`)

#### Scenario: Rules files reference no deleted paths

- **WHEN** `.claude/rules/math2d-patterns.md` and `.claude/rules/testing-conventions.md` are inspected
- **THEN** they do not reference `packages/math2d/ARCHITECTURE.md`, `packages/math2d/CONTRIBUTING.md`, `packages/math2d/DOCUMENTATION_STANDARD.md`, or any file in `packages/math2d/docs/`
