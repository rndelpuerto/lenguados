## Why

The project currently pins Node.js 22.14.0 (Jod LTS) and npm 10.9.2, with dependencies last audited months ago. Node 24 (Krypton) is now the active LTS line (since October 2025), bringing V8 engine improvements, native `URLPattern`, enhanced `node:test` hooks, and long-term security support through April 2028. Node 22 enters maintenance mode and will reach end-of-life in April 2027. Upgrading now ensures the project stays on a supported, actively-maintained runtime while all dependencies receive security patches, bug fixes, and performance improvements accumulated over several minor releases.

## What Changes

- **Node.js runtime**: Upgrade from 22.14.0 → 24.14.1 (latest LTS Krypton)
- **npm**: Upgrade from 10.9.2 → 11.x (bundled with Node 24)
- **.nvmrc**: Update pinned version to 24.14.1
- **engines field**: Update root `package.json` from `^22.14.0` → `^24.14.0`; update workspace packages from `>=22` → `>=24`; evaluate docs `>=18.0` for Docusaurus compatibility
- **All devDependencies**: Upgrade 40+ root devDependencies to latest stable (ESLint 9.x, Jest 29.x, Rollup 4.x, TypeScript-ESLint 8.x, SWC, Lerna 9.x, Husky, Prettier, Stylelint, etc.)
- **Docs dependencies**: Upgrade Docusaurus 3.x suite, React 19.x, TypeDoc, and related packages
- **Configuration adjustments**: Adapt ESLint flat config, Jest config, Rollup plugins, TypeScript config, and CI workflows if any breaking changes arise from dependency upgrades
- **GitHub Actions workflows**: All three workflows (pr-validation, release, deploy-docs) already reference `.nvmrc`; verify compatibility with Node 24
- **Documentation**: Update all references to Node version across README files, CLAUDE.md, CONTRIBUTING.md, ARCHITECTURE.md, docs site content, and `.claude/rules/` files

## Capabilities

### New Capabilities

_(none — this change is infrastructure-level and does not introduce new functional capabilities)_

### Modified Capabilities

_(none — no spec-level behavioral requirements change; all existing mathematical guarantees, API contracts, and determinism properties remain identical)_

## Impact

- **Runtime**: All packages now require Node ≥24; consumers on Node 22 will need to upgrade
- **CI/CD**: GitHub Actions workflows consume `.nvmrc` — single-point update propagates automatically
- **Build pipeline**: Rollup 4 + SWC must remain compatible with Node 24; verify plugin ecosystem support
- **Deterministic math**: fdlibm-based polynomial implementations are pure JS — no V8 dependency; **no rollback plan needed** as deterministic guarantees are engine-independent by design
- **Tree-shaking / bundle size**: Dependency upgrades may affect bundle output; verify production dist builds
- **Test suite**: Jest + SWC transpilation must work under Node 24; verify all 90%+ coverage thresholds still pass
- **Documentation**: ~15 markdown files reference Node version or runtime requirements; docs site (Docusaurus) must build cleanly
- **Lock file**: `package-lock.json` will be fully regenerated under npm 11.x
- **Downstream consumers**: **BREAKING** for anyone running Node <24; semver-minor for dependency updates
