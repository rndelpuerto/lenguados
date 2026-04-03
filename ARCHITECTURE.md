# Architecture

> Short code map for the lenguados monorepo. See individual package architecture files for internals.

## Monorepo Topology

```
lenguados/
  packages/
    math2d/     → @lenguados/math2d   Core 2D math library (main package)
    common/     → @lenguados/common   Shared utilities (parseJSONData)
    examples/   → @lenguados/examples Interactive demos and visual tests
  docs/           Docusaurus documentation site + TypeDoc API reference
  scripts/        Shared build scripts (build.mjs, clean.mjs, watch.mjs)
  openspec/       Spec-driven development workflow
```

## Package Dependency Graph

```
common ← math2d ← examples
```

`@lenguados/common` has no internal dependencies. `@lenguados/math2d` depends on `common`. `@lenguados/examples` depends on `math2d`.

## Shared Infrastructure

- **Build**: Each package runs `node ../../scripts/build.mjs` (Rollup 4) → CJS + ESM + types in `lib/`
- **Testing**: Jest 29 + ts-jest, two environments: `node` (`*.node.spec.ts`) and `jsdom` (`*.dom.spec.ts`)
- **Linting**: ESLint 9 (flat config) + Stylelint 16 + Prettier 3, enforced by lint-staged pre-commit hook
- **CI**: GitHub Actions for PR validation, release via Lerna, docs deploy to GitHub Pages
- **Docs**: Docusaurus site at `docs/` with `docusaurus-plugin-typedoc` for auto-generated API reference

## @lenguados/math2d Internals

The main package has a strict 6-layer architecture with unidirectional dependencies. See [`packages/math2d/ARCHITECTURE.md`](packages/math2d/ARCHITECTURE.md) for the full code map including:

- Layer diagram (deterministic → auxiliary → core → types → validation → utils)
- Key patterns (out parameter, triality, CS variants, apply vs transform)
- Zero-check conventions and tolerance constants

For expanded design principles and architectural axioms, see the [docs site architecture page](docs/docs/math2d/architecture.md).
