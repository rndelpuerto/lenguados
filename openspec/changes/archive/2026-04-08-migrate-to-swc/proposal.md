## Why

The monorepo's test runner (Jest + ts-jest) and documentation site (Docusaurus) rely on slow transpilation paths — ts-jest re-compiles TypeScript on every test run, and Docusaurus uses Babel+webpack by default. Adopting SWC where it provides concrete speed gains will reduce CI feedback loops and local developer iteration time. Babel itself is **not directly configured** in this project — it exists only as transitive dependencies pulled in by Docusaurus and Jest.

> **Update (2026-04-08):** The Rollup build was subsequently migrated from `rollup-plugin-esbuild` to `rollup-plugin-swc3`, unifying all transpilation on SWC. See Decision D3 addendum in `design.md`.

## What Changes

- **Jest transpilation**: Replace `ts-jest` with `@swc/jest` + `@swc/core` for ~5x faster test file transpilation. Type checking remains enforced by `tsc` in CI and IDE.
- **Docusaurus build acceleration**: Install `@docusaurus/faster` and enable `future.experimental_faster` to replace Babel with SWC for JS transpilation, Terser with SWC for minification, and optionally webpack with Rspack — achieving 2-4x faster documentation builds.
- **Rollup build (updated)**: ~~The current `rollup-plugin-esbuild` setup was kept unchanged.~~ Subsequently migrated to `rollup-plugin-swc3` to unify all transpilation on SWC. Production minification also moved from `rollup-plugin-cleanup` to SWC's built-in `minify()` (runs in `renderChunk` phase).
- **Dependency cleanup**: Removing `ts-jest` eliminates its transitive Babel dependency chain from the root workspace. Enabling `@docusaurus/faster` doesn't remove Docusaurus's Babel deps (they remain as fallback) but bypasses them at runtime.

## Capabilities

### New Capabilities

- `swc-jest-integration`: SWC-based Jest transpilation — configuration, TypeScript compatibility, and validation that all existing tests pass identically.
- `docusaurus-faster`: Docusaurus SWC acceleration — enabling the `@docusaurus/faster` package with appropriate feature flags for the docs site.

### Modified Capabilities

_(none — no existing spec-level requirements change; this is a tooling-internal migration)_

## Impact

- **jest.config.ts**: Transform pipeline changes from `ts-jest` to `@swc/jest`; `globals['ts-jest']` block removed; SWC-specific options added.
- **Root package.json**: `ts-jest` replaced by `@swc/jest` + `@swc/core` in devDependencies.
- **docs/package.json**: `@docusaurus/faster` added as dependency.
- **docs/docusaurus.config.ts**: `future.experimental_faster` flag enabled.
- **tsconfig.test.json**: Still used by `tsc` for type checking but no longer consumed by the test transpiler.
- **Deterministic guarantees**: Unaffected — SWC is a transpiler, not a math runtime. All fdlibm-based deterministic functions remain bit-exact since they operate on the same JS engine primitives regardless of how the source was transpiled.
- **Tree-shaking / bundle size**: Unaffected — Rollup build pipeline structure is unchanged (SWC replaced esbuild as transpiler).
- **CI/CD**: Test stage runs faster; docs build stage runs faster. No pipeline structure changes needed.
