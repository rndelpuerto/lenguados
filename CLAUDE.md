# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**lenguados** is a TypeScript monorepo for a deterministic, extensible 2D physics engine. It uses npm workspaces + Lerna for package management. Node 24.14.1 (see `.nvmrc`).

## Common Commands

```bash
# Install
npm install                          # or: npm run init (also installs Python deps)

# Build all packages (Rollup, dev mode)
npm run build

# Build production bundles
npm run dist

# Lint (ESLint + Stylelint, runs automatically as pretest)
npm run lint
npm run lint:fix

# Format
npm run format

# Test (runs lint first via pretest hook)
npm test

# Run tests without lint
npm run test:unit

# Watch mode
npm run test:watch

# Run a single test file
npx jest --testPathPattern="packages/math2d/test/core/vector2" --no-coverage

# Run a single test by name
npx jest -t "Vector2.add" --no-coverage
```

## Git Hooks

- **pre-commit**: `lint-staged` runs ESLint, Stylelint, and Prettier on staged files
- **pre-push**: runs full Jest test suite
- **commitlint**: enforces conventional commits (`@commitlint/config-conventional`)

## Monorepo Structure

```
packages/
  common/    → @lenguados/common  - Shared utilities (parseJSONData, etc.)
  math2d/    → @lenguados/math2d  - Core 2D math library (main package)
  examples/  → @lenguados/examples - Usage examples
docs/        → Docusaurus documentation site
scripts/     → Shared build scripts (build.mjs, clean.mjs, watch.mjs)
```

Each package builds via `node ../../scripts/build.mjs` (Rollup), producing CJS + ESM + types in `lib/`.

## @lenguados/math2d — Package Identity (Golden Rule)

`@lenguados/math2d` is the **core/base mathematics package** of this monorepo. It is the foundational package upon which the rest of the engine is built, but it can also be consumed independently. Its API is domain-agnostic and must be comprehensive — if an operation is mathematically well-defined on the types provided, it belongs here. Domain-specific algorithms (collision, dynamics, rendering) belong in other packages. Full rule: `.claude/rules/math2d-identity.md`.

## @lenguados/math2d Architecture

The main package follows a strict layered architecture (dependencies flow downward only):

1. **auxiliary/** - Primitive scalar/angle/numeric utilities (lerp, clamp, sinCos, divideSafe)
2. **core/** - Math objects: Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2
3. **deterministic/** - fdlibm-based cross-platform deterministic math (sin, cos, sqrt, etc.)
4. **types/** - `*Like` interfaces (ReadonlyVector2Like, Matrix3Like, etc.) for interop
5. **validation/** - Configurable assertions (tree-shakeable: dev vs production builds)
6. **utils/** - Formatting, parsing, random generation, performance measurement

### Key Design Patterns

- **Static + Instance**: Static methods accept `out?` param; instance methods mutate `this` and return `this` for chaining
- **`*CS` variants**: Pre-computed cos/sin for hot loops (`rotateCS(cos, sin)` instead of `rotate(angle)`)
- **Validation tiers**: default (strict, throws), `*Safe` (returns fallback), `*Unchecked` (no validation)
- **`*Like` interfaces**: Input params use `Readonly*Like`, outputs use concrete types
- **`out` parameter**: Always last optional param to avoid allocations in hot paths

### Math Conventions

- CCW positive rotation, Y-up coordinate system
- Angles in radians, column-major matrices
- Transform order: Scale → Rotate → Translate
- Tolerances: `EPSILON = 1e-10`

## Testing

- Jest with two project environments: `node` (`*.node.spec.ts`) and `jsdom` (`*.dom.spec.ts`)
- Tests live in `packages/*/test/` mirroring source structure
- Property-based tests use `fast-check` (see `test/properties/`)
- Coverage thresholds: 90% lines/statements/functions, 50% branches

## TypeScript

- `strict: true` with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`
- Target: ESNext, Module: ESNext, Resolution: Bundler
- Path aliases: `@lenguados/common/*` → `packages/common/src/*`

## Build System

- Rollup 4 + SWC (`rollup-plugin-swc3`) bundles each package into CJS (`lib/cjs/`) + ESM (`lib/esm/`) + types (`lib/@types/`)
- SWC is the unified transpiler: Rollup build (`rollup-plugin-swc3`), Jest tests (`@swc/jest`), and production minification (`swc-minify`)
- Conditional exports: `development` vs `default` (production) for tree-shaking validation code
- `cross-env NODE_ENV=development|production` controls build mode

## Documentation Structure

- **Package root**: `README.md`, `CHANGELOG.md`, `ARCHITECTURE.md` (code map). No `docs/` directory inside packages.
- **Monorepo root**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md` (topology), `LICENSE`.
- **Docs site** (`docs/docs/`): `math2d/` (architecture deep-dive, design decisions, edge cases), `contributing/` (TSDoc standard, testing strategy, design philosophy), `api/` (auto-generated TypeDoc).
- **Two-level ARCHITECTURE.md**: Root = monorepo topology (30-60 lines). Package = code map (under 200 lines).
- Full conventions in `.claude/rules/documentation-conventions.md`.

## Rules & Skills

Rules (`.claude/rules/`) — loaded when working on matching files:

- `math2d-identity.md` — **Golden rule**: math2d is a core/base math library, not a physics engine. Defines what belongs and what does not. Applies to all files.
- `math2d-patterns.md` — API design patterns, naming, allocation control, determinism, triality
- `tsdoc-conventions.md` — Tag order, @category vocabulary, class member ordering, triality cross-linking
- `architecture-and-layers.md` — Layer deps, deterministic function classification, validation tiers, design philosophy
- `build-and-exports.md` — Package.json exports, entry points, module-internals, build output structure
- `testing-conventions.md` — Test file types, structure, coverage, import conventions
- `testing-deep-patterns.md` — Tolerance constants, property-based testing, angular equality, dangerous-path testing
- `code-style.md` — Prettier config, import ordering, file naming, conventional commits
- `documentation-conventions.md` — File placement, linking, language, edge case docs, interop docs

Skills (`.claude/skills/`) — invoke with `/skill-name`:

- `implement-math-type` — Checklist for adding a new math type (auto-discovery)
- `release` — Lerna release workflow (manual only)

OpenSpec (`openspec/`) — spec-driven development:

- `/opsx:propose` — Create a change with proposal, design, and tasks
- `/opsx:explore` — Investigate before committing to a change
- `/opsx:apply` — Implement tasks from the active change
- `/opsx:archive` — Archive a completed change
