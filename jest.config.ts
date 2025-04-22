/**
 * @fileoverview Central Jest configuration for the **Lenguados** monorepo.
 *
 * ▸  One **root block** contains options that apply to every child project.  
 * ▸  Two **projects** are declared:
 *    • `node`   – pure logic / math tests (`*.node.spec.ts`) executed in Node.  
 *    • `jsdom`  – browser / DOM tests (`*.dom.spec.ts`) executed in JSDOM with
 *                 custom polyfills defined in `jest.dom.setup.ts`.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  Aliases
 *  ───────
 *  We import the `paths` field from the root tsconfig and convert it to Jest’s
 *  `moduleNameMapper` so that TypeScript path aliases (e.g. `@engine/*`) are
 *  resolved at *runtime* as well as at compile‑time.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  TypeScript
 *  ──────────
 *  • All `.ts` files (tests and sources) are transpiled on‑the‑fly via ts‑jest
 *    using `tsconfig.test.json` (extends the base tsconfig and adds `types: jest`).
 *  • `moduleFileExtensions` restricts Jest to TypeScript only — no `.js` test
 *    files are collected.
 *
 *  ────────────────────────────────────────────────────────────────────────────
 *  Coverage & output
 *  ─────────────────
 *  • Coverage is aggregated across projects into `/coverage`.  
 *  • Compiled Rollup bundles (`/lib/`) and `node_modules/` are ignored by the
 *    test runner to avoid duplicate work.
 */

import type { JestConfigWithTsJest } from 'ts-jest';
// import { pathsToModuleNameMapper }   from 'ts-jest';
// import { compilerOptions }           from './tsconfig.json';

const sharedTransform = { '^.+\\.ts$': 'ts-jest' };

/** -------------------------------------------------------------------------
 *  Root‑level options inherited by every project
 *  ---------------------------------------------------------------------- */
const baseConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Use ts‑jest with a dedicated tsconfig for tests
  transform: sharedTransform,

  // Tell ts‑jest which tsconfig to use for *test files*
  globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } },

  // Runtime resolution for TypeScript path aliases
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),

  // Ignore compiled output and external deps
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],

  // Aggregate coverage reports
  collectCoverage: true,
  coverageDirectory: 'coverage',

  /** ---------------------------------------------------------------
   *  Per‑environment projects (only differences are declared here)
   *  ------------------------------------------------------------ */
  projects: [
    /** Node‑only tests (*.node.spec.ts) */
    {
      displayName: 'node',
      testEnvironment: 'node',
      roots: ['<rootDir>/packages'],
      testMatch: ['**/src/**/__tests__/**/*.node.spec.ts'],
      transform: sharedTransform,
    },

    /** Browser / DOM tests (*.dom.spec.ts) executed in JSDOM */
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/packages'],
      testMatch: ['**/src/**/__tests__/**/*.dom.spec.ts'],
      // Polyfills and custom matchers (canvas, ResizeObserver, jest‑dom, etc.)
      setupFilesAfterEnv: ['<rootDir>/jest.dom.setup.ts'],
      transform: sharedTransform,
    },
  ],
};

export default baseConfig;
