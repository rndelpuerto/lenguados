## Context

The lenguados monorepo currently uses three distinct transpilation paths:

1. **Build (Rollup)**: ~~`rollup-plugin-esbuild` transpiled TypeScript to CJS + ESM bundles.~~ Now uses `rollup-plugin-swc3` (SWC) for transpilation and `minify()` for production minification, unifying all transpilation on a single tool.
2. **Tests (Jest)**: `ts-jest` re-invokes the full TypeScript compiler for every test file. This is the slowest path — tsc is not designed for speed-first transpilation. Benchmarks show ~10ms per file.
3. **Docs (Docusaurus)**: Default Babel+webpack pipeline. Docusaurus 3.9+ offers `@docusaurus/faster` as a stable SWC+Rspack alternative with 2-4x speedup.

Babel is **not directly configured** anywhere — no `.babelrc`, no `babel.config.js`. All 140+ `@babel/*` packages are transitive dependencies of Docusaurus and Jest. The migration therefore targets the tools that sit above Babel, not Babel config itself.

**Constraints:**

- Node 22.14.0 (LTS) — SWC supports this fully
- TypeScript strict mode with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` — these are type-level checks; SWC transpiles without type checking, which is correct for test speed
- Two Jest environments (node + jsdom) must both work under SWC
- Deterministic math guarantees are unaffected — transpilation doesn't change runtime numeric behavior

## Goals / Non-Goals

**Goals:**

- Replace `ts-jest` with `@swc/jest` for faster test execution (~5x improvement per file)
- Enable `@docusaurus/faster` for the docs site to reduce build times by 2-4x
- Remove `ts-jest` from direct dependencies, reducing the transitive Babel footprint in the root workspace
- Maintain 100% test pass rate — zero behavioral changes

**Non-Goals:**

- ~~Replacing `rollup-plugin-esbuild` with an SWC-based Rollup plugin~~ (**Done**: migrated to `rollup-plugin-swc3` in a follow-up change)
- Eliminating all transitive Babel packages (Docusaurus retains them as internal fallback)
- Adding SWC as a general-purpose transpiler beyond Jest and Docusaurus
- Changing the build output format, bundle structure, or conditional exports

## Decisions

### D1: Use `@swc/jest` over keeping `ts-jest`

**Choice**: Replace `ts-jest` with `@swc/jest` (v0.2.39+, 4.6M weekly downloads, actively maintained as of Jul 2025).

**Why not keep ts-jest**: ts-jest invokes the full TypeScript compiler (type checking + transpilation) per file. Since type checking is already handled by `tsc` in CI and IDEs, paying for it again during test runs is wasted work. SWC transpiles only, which is exactly what a test runner needs.

**Why not `esbuild-jest`**: The `esbuild-jest` package is unmaintained (last published 2021). `@swc/jest` is the de facto standard for fast Jest transpilation in 2025-2026.

**Configuration approach**:

```typescript
const swcTransform = {
 '^.+\\.ts$': [
  '@swc/jest',
  {
   sourceMaps: true,
   jsc: {
    parser: { syntax: 'typescript', decorators: false },
    target: 'es2022', // Node 22 supports ES2022+ natively
   },
  },
 ],
};
```

**Trade-off**: Losing ts-jest's `diagnostics` option (type checking during tests). This is acceptable because:

- Type errors surface immediately in the IDE
- `tsc --noEmit` will be added as a CI step (currently missing — this migration adds it)
- Faster feedback loop outweighs redundant type checking

### D2: Enable `@docusaurus/faster` with full feature set

**Choice**: Install `@docusaurus/faster` (version matching installed `@docusaurus/core@3.9.2`) in docs workspace and enable `future.experimental_faster: true`.

**Why `true` (all features) over selective flags**: The individual flags (`swcJsLoader`, `swcJsMinimizer`, `swcHtmlMinimizer`, `rspackBundler`, `lightningCssMinimizer`, `mdxCrossCompilerCache`) are all stable in Docusaurus 3.9+/3.10. The composite `true` flag enables all of them, which is the recommended path and simplifies configuration.

**Why not wait for Docusaurus v4**: v4 will make this the default, but the stable implementation is available now and there's no reason to delay the performance gain.

### D3: ~~Keep `rollup-plugin-esbuild` unchanged~~ → Migrated to `rollup-plugin-swc3`

**Original choice**: Do not migrate Rollup's transpiler to SWC.

**Superseded (2026-04-08)**: Migrated to `rollup-plugin-swc3@^0.12.1` to unify all transpilation on SWC. `rollup-plugin-cleanup` was also replaced by SWC's built-in `minify()` plugin. The `__LENGUADOS_DEV__` dead-code elimination now uses `jsc.transform.optimizer.globals.vars` instead of esbuild's `define` option.

**Original rationale (preserved for context)**:

- `rollup-plugin-esbuild` had 714K weekly downloads vs. `@rollup/plugin-swc` at 350K and `rollup-plugin-swc3` at 65K
- esbuild plugin was updated Feb 2025; both SWC plugins were last published in 2024
- The `define` option for `__LENGUADOS_DEV__` dead-code elimination worked identically in both, so there was no feature gap
- Switching would introduce migration risk with zero measurable benefit for a library bundling use case

### D4: SWC target `es2022` for Jest

**Choice**: Use `es2022` as the SWC jsc.target for test transpilation.

**Why**: Node 22 natively supports all ES2022 features (top-level await, class fields, private methods, `Array.at()`, `Object.hasOwn()`). Using `es2022` means SWC does minimal transformation, maximizing speed. Note: SWC requires lowercase target strings — `"es2022"` not `"ES2022"` (known issue swc-project/swc#8516).

## Risks / Trade-offs

**[Risk] SWC transpilation behavior differs subtly from tsc** → Mitigation: Run the full test suite after migration. SWC's TypeScript parser handles all syntax this project uses (no decorators, no experimental features). Property-based tests with fast-check provide strong coverage against behavioral divergence.

**[Risk] `@swc/jest` doesn't support `pathsToModuleNameMapper`** → Mitigation: This project has `pathsToModuleNameMapper` commented out in jest.config.ts already. If path aliases are needed later, Jest's `moduleNameMapper` can be configured manually or via `@swc/jest`'s built-in `paths` support.

**[Risk] Docusaurus `experimental_faster` flag name changes in v4** → Mitigation: Low risk — Docusaurus team has committed to backwards compatibility. The flag becomes the default in v4, so it simply becomes a no-op.

**[Risk] jsdom test environment incompatibility with SWC** → Mitigation: `@swc/jest` is transpiler-only and environment-agnostic. The jsdom environment is configured at the Jest level, not the transpiler level. `jest.dom.setup.ts` polyfills are unaffected.

**[Trade-off] No type checking during test runs** → Accepted: Type checking moves to IDE + CI `tsc` step. This is the standard pattern in projects using SWC for test transpilation.

## Migration Plan

### Phase 1: Jest migration (root workspace)

1. Install `@swc/core` and `@swc/jest` as devDependencies
2. Update `jest.config.ts`: replace `ts-jest` transform with `@swc/jest` config
3. Remove `globals['ts-jest']` block
4. Update `JestConfigWithTsJest` type import to standard Jest `Config` type
5. Run full test suite — verify 100% pass rate, identical coverage numbers
6. Uninstall `ts-jest`

### Phase 2: Docusaurus migration (docs workspace)

1. Install `@docusaurus/faster` in docs workspace
2. Add `future: { experimental_faster: true }` to `docusaurus.config.ts`
3. Run `npm run build` in docs — verify site builds correctly
4. Verify local `npm run start` works in docs

### Rollback

- **Jest**: Revert `jest.config.ts` to ts-jest transform, reinstall ts-jest, remove @swc/\* packages
- **Docusaurus**: Remove `future` config key, uninstall `@docusaurus/faster`
- Both changes are isolated — one can be rolled back without affecting the other

## Open Questions

_(none — both migrations are well-documented with established community patterns)_
