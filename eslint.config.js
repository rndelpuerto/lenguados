/**
 * ESLint flat‑config for the Lenguados monorepo
 * ───────────────────────────────────────────────────────────────
 * • Classic rule‑sets + TypeScript + Prettier, all expressed as
 *   an ES module so it can live in eslint.config.js.
 * • Jest plugin/override adds safety checks for test files.
 * • Generated bundles in "packages/**\/lib" are excluded from
 *   type‑aware linting to avoid false positives.
 * • Globals are declared instead of enabling the full browser env
 *   (we lint DOM code, but still target Node in most files).
 *
 *  REFS
 *  • Flat‑config ignores precedence – ESLint 8 docs
 *    https://eslint.org/docs/latest/use/configure/configuration-files-new#ignores
 *  • Why Jest globals must be declared – jest-plugin FAQ
 *    https://github.com/jest-community/eslint-plugin-jest#globals-in-flat-config
 */

import { defineFlatConfig } from 'eslint-define-config';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlg from 'eslint-plugin-import';
import jsdocPlg from 'eslint-plugin-jsdoc';
import unicornPlg from 'eslint-plugin-unicorn';
import prettierPlg from 'eslint-plugin-prettier';
import jestPlg from 'eslint-plugin-jest';

/** Single tsconfig that covers src + tests */
const TS_PROJECT = ['./tsconfig.eslint.json'];

export default defineFlatConfig([
 /* ───────────────── Hard‑ignore generated bundles (must be first) ─ */
 /*    Flat‑config stops evaluating as soon as a path matches an      */
 /*    earlier  ⟨ignores⟩ pattern, so /lib files never reach later     */
 /*    TypeScript overrides (ESLint docs § “ignores precedence”).      */
 {
  ignores: ['packages/**/lib/**'],
 },

 /* ───────────────── Base JS rules (ESLint core) ─────────────────── */
 js.configs.recommended,

 /* ───────────────── Repository‑wide settings / generic ignores ──── */
 {
  settings: {
   // Let eslint‑plugin‑import resolve TS path aliases.
   'import/resolver': { typescript: { project: TS_PROJECT } },
  },
  ignores: [
   'node_modules',
   'coverage',
   '*.config.js',
   '*.config.cjs',
   '*.config.mjs',
   '.eslintrc.js',
  ],
 },

 /* ───────────────── Jest setup files + unit tests ───────────────── */
 {
  files: [
   '**/__tests__/**/*.ts', // tests under __tests__
   'jest.*.{js,ts}', // jest.config.ts, jest.dom.setup.ts …
  ],
  languageOptions: {
   // Declare just the globals we actually use.
   globals: {
    jest: true,
    describe: true,
    it: true,
    expect: true,
    beforeAll: true,
    afterAll: true,
    beforeEach: true,
    afterEach: true,
    setTimeout: true,
    clearTimeout: true,
   },
  },
  plugins: { jest: jestPlg },
  // “recommended” preset merged manually because flat‑config forbids `extends`
  rules: {
   ...jestPlg.configs.recommended.rules,
   // Allow implicit return types only in tests.
   '@typescript-eslint/explicit-function-return-type': 'off',
  },
 },

 /* ───────────────── Typed linting for every .ts file ────────────── */
 {
  files: ['**/*.ts'],
  languageOptions: {
   parser: tsParser,
   parserOptions: {
    project: TS_PROJECT,
    tsconfigRootDir: import.meta.dirname,
    noWarnOnMultipleProjects: true,
   },
  },
  plugins: {
   '@typescript-eslint': tsPlugin,
   import: importPlg,
   jsdoc: jsdocPlg,
   unicorn: unicornPlg,
   prettier: prettierPlg,
  },
  rules: {
   /* @typescript‑eslint defaults */
   ...tsPlugin.configs.recommended.rules,

   /* Import / module hygiene */
   'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],

   /* Naming conventions */
   'unicorn/filename-case': ['error', { case: 'kebabCase' }],

   /* Docs & formatting */
   'jsdoc/require-returns': 'warn',
   'prettier/prettier': 'error',
  },
 },

 /* ───────────────── Allow empty .d.ts placeholder files ─────────── */
 {
  files: ['**/*.d.ts'],
  rules: { 'unicorn/no-empty-file': 'off' },
 },

 /* ── Node‑only build/config scripts (Rollup, Husky, etc.) ───────── */
 {
  files: ['*.config.*', 'rollup.config.mjs', 'packages/**/main.js'],
  languageOptions: {
   globals: { process: true, module: true, require: true, exports: true },
  },
 },
]);
