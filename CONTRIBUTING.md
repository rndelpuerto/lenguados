# Contributing to lenguados

Thank you for your interest in contributing! By submitting code, you agree that your contribution is licensed under the **Apache License 2.0** and that you have the right to license it as such. No separate CLA is required.

## Prerequisites

- **Node.js** 22.14.0 (see `.nvmrc`)
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

## Development Workflow

1. **Fork** the repository and clone your fork
2. Create a **feature branch** from `main`:
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
6. Open a **pull request** against `main`

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by [commitlint](https://commitlint.js.org/). Every commit message must follow this format:

```text
type(scope): description
```

### Types

| Type       | Use for                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New feature or capability                  |
| `fix`      | Bug fix                                    |
| `docs`     | Documentation-only changes                 |
| `refactor` | Code restructuring without behavior change |
| `test`     | Adding or updating tests                   |
| `chore`    | Build, tooling, or dependency updates      |
| `perf`     | Performance improvement                    |

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
| **pre-push**   | Runs the full Jest test suite                                      |
| **commit-msg** | `commitlint` enforces conventional commit format                   |

## Code Style

- **ESLint** (flat config) + **Prettier** + **Stylelint** handle all formatting
- Run `npm run lint:fix` to auto-fix issues before committing
- Run `npm run format` for Prettier formatting
- The pre-commit hook handles staged files automatically

## Testing

- Tests live in `packages/*/test/` mirroring the source structure
- Naming: `*.node.spec.ts` (Node environment), `*.dom.spec.ts` (jsdom environment)
- Property-based tests use [fast-check](https://github.com/dubzzz/fast-check)
- Coverage thresholds: 90% lines/statements/functions, 50% branches

```bash
# Run all tests (includes lint via pretest hook)
npm test

# Run tests without lint
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx jest --testPathPattern="packages/math2d/test/core/vector2" --no-coverage
```

## math2d API Conventions

The `@lenguados/math2d` package follows these patterns. See [ARCHITECTURE.md](packages/math2d/ARCHITECTURE.md) for the full code map.

- **Static + Instance**: Static methods are pure, accept optional `out` parameter as last arg for allocation-free hot paths. Instance methods mutate `this`, return `this` for chaining.
- **Triality** (strict/safe/unchecked): `op()` throws on error. `opSafe()` returns fallback. `opUnchecked()` skips validation. Suffix naming: `divideSafe`, not `safeDivide`.
- **CS variants**: Methods ending in `CS` accept pre-computed cos/sin for hot loops (`rotateCS(cos, sin)` instead of `rotate(angle)`).
- **Apply vs Transform**: `apply` for operators acting on operands (Rotation2). `transform` for spatial coordinate changes (Matrix3).
- **`*Like` interfaces**: Input params use `Readonly*Like` (accept POJOs). Outputs use concrete types.
- **`out` parameter**: Always the last optional parameter. Enables zero-allocation in tight loops.

## Detailed Guides

In-depth contributor references on the docs site:

- [TSDoc Standard](docs/docs/contributing/tsdoc-standard.md) -- canonical tag order, 14 templates, controlled @category vocabulary
- [Testing Strategy](docs/docs/contributing/testing-strategy.md) -- property-based testing with fast-check, algebraic invariants
- [Design Philosophy](docs/docs/contributing/design-philosophy.md) -- POA principles, intentional SOLID deviations

## Documentation

- **Package root**: Only `README.md`, `CHANGELOG.md`, and `ARCHITECTURE.md` at `packages/math2d/`
- **Monorepo root**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LICENSE`
- **Docs site**: `docs/docs/math2d/` for package deep-dives, `docs/docs/contributing/` for contributor guides
- **Language**: All documentation in English
- **Linking**: Package README uses absolute GitHub URLs (npm compatibility). Root files use relative paths.
- **New docs site page**: Create `.md` in `docs/docs/`, add `sidebar_position`, `title`, `description` frontmatter
- **TSDoc**: Follow the [TSDoc Standard](docs/docs/contributing/tsdoc-standard.md)

## Reporting Issues

Open an issue on [GitHub Issues](https://github.com/rndelpuerto/lenguados/issues) with:

- A clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (Node version, OS)

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
