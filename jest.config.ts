/**
 * @file Central Jest configuration for the **Lenguados** monorepo.
 *
 * ▸  One **root block** contains options that apply to every child project.
 * ▸  Two **projects** are declared:
 *    • `node`   – pure logic / math tests (`*.node.spec.ts`) executed in Node.
 *    • `jsdom`  – browser / DOM tests (`*.dom.spec.ts`) executed in JSDOM with
 *                 custom polyfills defined in `jest.dom.setup.ts`.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  Aliases
 *  ───────
 *  Cross-package specifiers (`@lenguados/math2d`) resolve to SOURCE via
 *  `sharedModuleNameMapper`, keeping the suite hermetic — no build-order
 *  dependency between workspace packages. Jest projects do not inherit
 *  root-level resolution options, so the mapper is applied per project.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  TypeScript
 *  ──────────
 *  • All `.ts` files (tests and sources) are transpiled on‑the‑fly via @swc/jest
 *    (fast, transpile‑only — type checking is handled by `tsc --noEmit` in CI).
 *  • `moduleFileExtensions` restricts Jest to TypeScript only — no `.js` test
 *    files are collected.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  Coverage & output
 *  ─────────────────
 *  • Coverage is aggregated across projects into `/coverage`.
 *  • Compiled Rollup bundles (`/lib/`) and `node_modules/` are ignored by the
 *    test runner to avoid duplicate work.
 */

import type { Config } from 'jest';

const sharedTransform = {
 '^.+\\.ts$': [
  '@swc/jest',
  {
   sourceMaps: true,
   jsc: {
    parser: { syntax: 'typescript', decorators: false },
    target: 'es2022',
    // Match the SWC global replacement used by `rollup.config.mjs` so that
    // `__LENGUADOS_DEV__` resolves to a literal `true` during tests. Tests
    // exercise the development behaviour of every assertion call site.
    transform: {
     optimizer: {
      globals: {
       vars: {
        __LENGUADOS_DEV__: 'true',
       },
      },
     },
    },
   },
  },
 ] satisfies [string, Record<string, unknown>],
};

/**
 * -------------------------------------------------------------------------
 *  Root‑level options inherited by every project
 *  ----------------------------------------------------------------------
 */
/**
 * Cross-package specifiers resolve to SOURCE (not built lib) so the suite is
 * hermetic — no build-order dependency between workspace packages. Jest
 * projects do NOT inherit root-level resolution options, so this mapper is
 * applied to every project explicitly.
 */
const sharedModuleNameMapper = {
 // Generic: any workspace package root specifier resolves to its source
 // barrel — a new package needs zero edits here.
 '^@lenguados/([^/]+)$': '<rootDir>/packages/$1/src/index',
};

const baseConfig: Config = {
 moduleFileExtensions: ['ts', 'js', 'json'],

 // SWC‑based transpilation (fast, no type checking — tsc handles that separately)
 transform: sharedTransform,

 // Runtime resolution for TypeScript path aliases
 // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
 //   prefix: '<rootDir>/',
 // }),

 moduleNameMapper: sharedModuleNameMapper,

 // Ignore compiled output, external deps and tools/package
 testPathIgnorePatterns: ['/node_modules/', '/lib/', 'tools/package/'],

 // Aggregate coverage reports
 collectCoverage: true,
 coverageDirectory: 'coverage',
 coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/lib/'],
 coverageReporters: ['text', 'lcov'],
 // Documented contract: 90% lines/statements/functions, 80% branches
 // (infrastructure canonical + CLAUDE.md + quality-pipeline + TESTING_STRATEGY).
 coverageThreshold: {
  global: {
   branches: 80,
   functions: 90,
   lines: 90,
   statements: 90,
  },
 },

 /**
  * ---------------------------------------------------------------
  *  Per‑environment projects (only differences are declared here)
  *  --------------------------------------------------------------
  */
 projects: [
  /** Node‑only tests (*.node.spec.ts) */
  {
   displayName: 'node',
   testEnvironment: 'node',
   roots: ['<rootDir>/packages'],
   testMatch: ['**/test/**/*.node.spec.ts'],
   transform: sharedTransform,
   moduleNameMapper: sharedModuleNameMapper,
  },

  /** Browser / DOM tests (*.dom.spec.ts) executed in JSDOM */
  {
   displayName: 'jsdom',
   testEnvironment: 'jsdom',
   roots: ['<rootDir>/packages'],
   testMatch: ['**/test/**/*.dom.spec.ts'],
   moduleNameMapper: sharedModuleNameMapper,
   // Polyfills and custom matchers (canvas, ResizeObserver, jest‑dom, etc.)
   setupFilesAfterEnv: ['<rootDir>/jest.dom.setup.ts'],
   transform: sharedTransform,
  },
 ],
};

export default baseConfig;
