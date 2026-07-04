# Contributing to lenguados

Thank you for your interest in contributing! By submitting code, you agree that your contribution is licensed under the **Apache License 2.0** and that you have the right to license it as such. No separate CLA is required.

## Prerequisites

- **Node.js** 24.14.1 (see `.nvmrc`)
- **npm** (comes with Node.js)
- **Git** with SSH or HTTPS access to GitHub

## Getting Started

```bash
git clone https://github.com/rndelpuerto/lenguados.git
cd lenguados
nvm install
nvm use
npm install
npm run build
npm test
```

### Optional: scaffolding a new package

Most contributors never need this. To scaffold a **new monorepo package** -- a sibling of `common`, `math2d`, and `examples` -- the repo uses [cookiecutter](https://github.com/cookiecutter/cookiecutter), a Python-based project scaffolder. It is **not** part of `npm run init` (the bootstrap is Python-free); install it once via an isolated runner, and do **not** run `pip install -r requirements.txt` (modern Python rejects system-wide installs under PEP 668):

```bash
pipx install cookiecutter   # recommended (or use uv / uvx)
npm run tools:create-package
```

`npm run tools:create-package` reads the pinned cookiecutter version from `requirements.txt`, runs it in an isolated environment, and writes the new package into `packages/`. If no runner is found it prints setup instructions instead of failing cryptically.

## Development Workflow

1. **Fork** the repository and clone your fork
2. Create a **feature branch** from `main`, following the branch naming convention (enforced by CI — see below):
   ```bash
   git checkout -b feat/my-feature
   ```
3. Make your changes, following the conventions below
4. Ensure tests and lint pass:
   ```bash
   npm run lint
   npm run test:unit
   ```
5. Commit using **conventional commits** (see below)
6. Open a **pull request** against `main` — the [validation pipeline](#pull-request-validation) runs every gate listed below

### Branch naming convention

The PR validation workflow rejects head branches that do not match this regex:

```text
^(release|hotfix)/v[0-9]+\.[0-9]+\.[0-9]+$|^(feature|feat|fix|enhancement|docs|chore|refactor|test|perf|ci|build|dependabot)/
```

In practice: `release/vX.Y.Z`, `hotfix/vX.Y.Z`, or `<type>/<topic>` where `<type>` is one of `feature`, `feat`, `fix`, `enhancement`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`, `build` — for example `feat/vector2-slerp` or `docs/edge-cases-interval`.

### Milestone gate

Every pull request must carry a `vX.Y.Z` milestone before it can merge. **A maintainer assigns the milestone during triage** — you do not need to (and as an external contributor, cannot) set it yourself. If CI cannot query the milestone (limited token on fork PRs), the gate emits a warning and skips instead of failing; when it can query and the milestone is missing or does not match the `vX.Y.Z` pattern, the gate fails.

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by [commitlint](https://commitlint.js.org/). Every commit message must follow this format:

```text
type(scope): description
```

### Types

| Type       | Use for                                         |
| ---------- | ----------------------------------------------- |
| `feat`     | New feature or capability                       |
| `fix`      | Bug fix                                         |
| `docs`     | Documentation-only changes                      |
| `refactor` | Code restructuring without behavior change      |
| `test`     | Adding or updating tests                        |
| `chore`    | Tooling or dependency updates                   |
| `perf`     | Performance improvement                         |
| `build`    | Build system or package configuration changes   |
| `ci`       | CI workflow and pipeline changes                |
| `style`    | Formatting-only changes with no semantic effect |
| `revert`   | Reverting a previous commit                     |

These are the types accepted by `@commitlint/config-conventional`; any other type is rejected by the commit-msg hook.

### Examples

```bash
git commit -m "feat(math2d): add Vector2.slerp static method"
git commit -m "fix(math2d): correct Transform2.inverse position for non-uniform scale"
git commit -m "docs(math2d): update README API overview table"
git commit -m "refactor(math2d): extract angle utilities into dedicated module"
git commit -m "test(math2d): add property-based tests for Matrix2 inversion"
git commit -m "chore: update ESLint to v9 flat config"
```

Breaking changes add `!` after the type: `feat(math2d)!: rename magnitudeSquared to magnitudeSq`

## Git Hooks

The following hooks run automatically -- do not bypass them with `--no-verify`:

| Hook           | What it does                                                       |
| -------------- | ------------------------------------------------------------------ |
| **pre-commit** | `lint-staged` runs ESLint, Stylelint, and Prettier on staged files |
| **pre-push**   | Runs the full Jest test suite + benchmark smoke test               |
| **commit-msg** | `commitlint` enforces conventional commit format                   |

## Pull Request Validation

Every pull request against `main` runs the `pr-validation.yml` workflow. All gates are blocking — the PR merges only when the full sequence is green. In order:

| #   | Gate                     | What runs                                                                                                                                                                                     |
| --- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Branch naming            | Head branch must match the [branch naming convention](#branch-naming-convention)                                                                                                              |
| 2   | Milestone                | PR must have a `vX.Y.Z` milestone (see [milestone gate](#milestone-gate) — assigned by a maintainer during triage)                                                                            |
| 3   | JS/TS lint               | `npm run lint:js` (ESLint, zero warnings allowed)                                                                                                                                             |
| 4   | CSS/SCSS lint            | `npm run lint:css` (Stylelint)                                                                                                                                                                |
| 5   | Formatting               | `npm run format:check` (Prettier)                                                                                                                                                             |
| 6   | Type-check               | `npm run typecheck` (`tsc --noEmit`)                                                                                                                                                          |
| 7   | Unit tests + coverage    | `npm run test:unit` (Jest with coverage; the report is uploaded as a workflow artifact)                                                                                                       |
| 8   | Production distribution  | `npm run dist` (development + production bundles for every package)                                                                                                                           |
| 9   | Package tarball contents | `node scripts/verify-tarball.mjs` — asserts every publishable package would pack a complete npm tarball (entry files, every `lib/` path referenced by `exports`, `README`/`LICENSE`/`NOTICE`) |
| 10  | Determinism drift        | `npm run tools:bench:setup` + `npm run tools:bench:smoke` — verifies the committed golden file against the current build's deterministic-kernel output                                        |
| 11  | Bundle-size budgets      | `npm run tools:bench:size` — fails when any budgeted import entry exceeds its declared gzip budget                                                                                            |
| 12  | Documentation build      | `npm run docs` (Docusaurus build; broken links fail the gate)                                                                                                                                 |
| 13  | Dependency audit         | `npx audit-ci --config audit-ci.jsonc` (blocking at high severity, with a managed allowlist)                                                                                                  |
| 14  | License guarantee        | Verifies every published package declares **zero runtime dependencies**                                                                                                                       |
| 15  | Static security analysis | CodeQL init → autobuild → analyze (JavaScript)                                                                                                                                                |

A second workflow, `rule-invariants.yml`, also runs on every PR and enforces math2d structural invariants (cross-class conversion placement, deterministic-kernel imports, production-bundle assertion stripping).

To reproduce the local-reproducible gates before pushing:

```bash
npm run lint && npm run format:check && npm run typecheck
npm run test:unit
npm run dist && node scripts/verify-tarball.mjs
npm run tools:bench:setup   # first time only
npm run tools:bench:smoke && npm run tools:bench:size
npm run docs
```

## Code Style

- **ESLint** (flat config) + **Prettier** + **Stylelint** handle all formatting
- Run `npm run lint:fix` to auto-fix issues before committing
- Run `npm run format` for Prettier formatting
- The pre-commit hook handles staged files automatically

## Testing

- Tests live in `packages/*/test/` mirroring the source structure
- Naming: `*.node.spec.ts` (Node environment), `*.dom.spec.ts` (jsdom environment)
- Property-based tests use [fast-check](https://github.com/dubzzz/fast-check)
- Coverage thresholds: 90% lines/statements/functions, 80% branches

```bash
# Run all tests (includes lint via pretest hook)
npm test

# Run tests without lint
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx jest --testPathPatterns="packages/math2d/test/core/vector2" --no-coverage
```

## Engine-Wide Standards

These standards apply to all packages. Each package may extend them with domain-specific conventions.

- [Design Philosophy](DESIGN_PHILOSOPHY.md) -- POA principles, intentional SOLID deviations, mechanical sympathy
- [TSDoc Standard](TSDOC_STANDARD.md) -- canonical tag order, templates, controlled `@category` vocabulary
- [Testing Strategy](TESTING_STRATEGY.md) -- property-based testing with fast-check, algebraic invariants
- [Iconography Standard](ICONOGRAPHY_STANDARD.md) -- icon library, placement rules, sizing, color, and accessibility for the documentation site
- [Module Exports & Internals](MODULE_EXPORTS.md) -- classification framework, subpath exports, `module-internals.json` convention, build mechanics

For package-specific conventions (API patterns, extended categories, specific invariants), see each package's documentation.

## Documentation

- **Package root**: `README.md`, `CHANGELOG.md`, plus optional `ARCHITECTURE.md`, `DESIGN_PHILOSOPHY.md`, `TSDOC_STANDARD.md`, `TESTING_STRATEGY.md`, `MODULE_EXPORTS.md`, `CONTRIBUTING.md` (package extensions of engine standards), and any package-exclusive `UPPER_SNAKE_CASE.md` file declared in `doc-standards.json`.
- **Monorepo root**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LICENSE`, plus engine-wide standards `DESIGN_PHILOSOPHY.md`, `TSDOC_STANDARD.md`, `TESTING_STRATEGY.md`, `ICONOGRAPHY_STANDARD.md`, `MODULE_EXPORTS.md`.
- **Docs site**: regenerated deterministically from root and package markdown by `scripts/generate-package-docs.mjs`. Hand-written pages only for content that is not reflected (for example benchmark report pages under `docs/docs/packages/math2d/performance/`).
- **Language**: All documentation in English. Spanish quotes may be preserved as blockquotes with English translation following.
- **Linking**: Package README uses absolute GitHub URLs (npm compatibility). Root and package source files use relative paths; the generator rewrites them into docs-site paths during reflection.

## Reporting Issues

Open an issue on [GitHub Issues](https://github.com/rndelpuerto/lenguados/issues) using the bug report or feature request form, with:

- A clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (Node version, OS)

**Security vulnerabilities are the exception**: never open a public issue for them. Follow the private reporting process in [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
