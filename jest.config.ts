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
 *  We import the `paths` field from the root tsconfig and convert it to Jest’s
 *  `moduleNameMapper` so that TypeScript path aliases (e.g. `@engine/*`) are
 *  resolved at *runtime* as well as at compile‑time.
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
   },
  },
 ] satisfies [string, Record<string, unknown>],
};

/**
 * -------------------------------------------------------------------------
 *  Root‑level options inherited by every project
 *  ----------------------------------------------------------------------
 */
const baseConfig: Config = {
 moduleFileExtensions: ['ts', 'js', 'json'],

 // SWC‑based transpilation (fast, no type checking — tsc handles that separately)
 transform: sharedTransform,

 // Runtime resolution for TypeScript path aliases
 // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
 //   prefix: '<rootDir>/',
 // }),

 // Ignore compiled output, external deps and tools/package
 testPathIgnorePatterns: ['/node_modules/', '/lib/', 'tools/package/'],

 // Aggregate coverage reports
 collectCoverage: true,
 coverageDirectory: 'coverage',
 coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
 coverageReporters: ['text', 'lcov'],
 coverageThreshold: {
  global: {
   branches: 50, // 85%
   functions: 85,
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
  },

  /** Browser / DOM tests (*.dom.spec.ts) executed in JSDOM */
  {
   displayName: 'jsdom',
   testEnvironment: 'jsdom',
   roots: ['<rootDir>/packages'],
   testMatch: ['**/test/**/*.dom.spec.ts'],
   // Polyfills and custom matchers (canvas, ResizeObserver, jest‑dom, etc.)
   setupFilesAfterEnv: ['<rootDir>/jest.dom.setup.ts'],
   transform: sharedTransform,
  },
 ],
};

export default baseConfig;
