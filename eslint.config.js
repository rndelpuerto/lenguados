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
import immutablePlg from 'eslint-plugin-immutable';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const enforceCategoryVocabulary = require('./eslint-rules/enforce-category-vocabulary.cjs');
const enforceRequiredTags = require('./eslint-rules/enforce-required-tags.cjs');
const enforceSeeFormat = require('./eslint-rules/enforce-see-format.cjs');
const enforceTagFragments = require('./eslint-rules/enforce-tag-fragments.cjs');

/** Local plugin wrapping custom rules */
const localPlugin = {
 rules: {
  'enforce-category-vocabulary': enforceCategoryVocabulary,
  'enforce-required-tags': enforceRequiredTags,
  'enforce-see-format': enforceSeeFormat,
  'enforce-tag-fragments': enforceTagFragments,
 },
};

/** Single tsconfig that covers src + tests */
const TS_PROJECT = ['./tsconfig.eslint.json'];

export default defineFlatConfig([
 /* ───────────────── Hard‑ignore generated bundles (must be first) ─ */
 /*    Flat‑config stops evaluating as soon as a path matches an      */
 /*    earlier  ⟨ignores⟩ pattern, so /lib files never reach later     */
 /*    TypeScript overrides (ESLint docs § “ignores precedence”).      */
 {
  ignores: [
   'packages/**/lib/**',
   'packages/**/main.*',
   'packages/**/dev-main.*',
   'docs/.docusaurus/**',
   'docs/build/**',
   'docs/docs/api/**',
   'docs/docusaurus.config.ts',
   'docs/sidebars.ts',
   'tools/package/**',
   'openspec/**',
  ],
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
   '**/test/**/*.ts', // tests under test/
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
   // Recognize assertion functions: fast-check, custom test helpers
   'jest/expect-expect': [
    'warn',
    {
     assertFunctionNames: ['expect', 'fc.assert', 'expectVecClose', 'expectMatTranslation'],
    },
   ],
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
   globals: {
    document: 'readonly',
    window: 'readonly',
    HTMLElement: 'readonly',
    CanvasRenderingContext2D: 'readonly',
   },
  },
  plugins: {
   '@typescript-eslint': tsPlugin,
   import: importPlg,
   jsdoc: jsdocPlg,
   unicorn: unicornPlg,
   prettier: prettierPlg,
   immutable: immutablePlg,
   local: localPlugin,
  },
  rules: {
   /* @typescript‑eslint defaults */
   ...tsPlugin.configs.recommended.rules,

   /* Import / module hygiene */
   'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],

   /* Naming conventions */
   'unicorn/filename-case': ['error', { case: 'kebabCase' }],

   /* Docs & formatting */
   'jsdoc/require-returns': 'error',
   'jsdoc/require-returns-description': 'warn',
   'jsdoc/require-param': 'warn',
   'jsdoc/require-param-description': 'warn',
   'jsdoc/check-param-names': 'error',
   'jsdoc/check-tag-names': [
    'error',
    {
     definedTags: [
      'remarks',
      'defaultValue',
      'example',
      'see',
      'internal',
      'constant',
      'category',
      'since',
      'public',
      'file',
      'module',
      'description',
      'packageDocumentation',
      'typeParam',
      'migration',
     ],
    },
   ],
   'jsdoc/sort-tags': [
    'warn',
    {
     tagSequence: [
      { tags: ['packageDocumentation'] },
      { tags: ['file'] },
      { tags: ['module'] },
      { tags: ['description'] },
      { tags: ['remarks'] },
      { tags: ['template'] },
      { tags: ['param'] },
      { tags: ['returns'] },
      { tags: ['throws'] },
      { tags: ['defaultValue'] },
      { tags: ['example'] },
      { tags: ['see'] },
      { tags: ['internal'] },
      { tags: ['constant'] },
      { tags: ['category'] },
      { tags: ['since'] },
      { tags: ['public'] },
     ],
     linesBetween: 0,
     reportTagGroupSpacing: false,
     reportIntraTagGroupSpacing: false,
    },
   ],

   /* Member ordering — custom config matching the codebase's two class
      patterns (statics-first in Vector2/Matrix2/Matrix3, fields-first in
      Complex/Rotation2/Interval/Transform2). Enforces: all declarations
      (fields, constructor, statics) before instance methods/getters. */
   '@typescript-eslint/member-ordering': [
    'warn',
    {
     default: { memberTypes: 'never' },
     classes: {
      memberTypes: [
       [
        'public-instance-field',
        'public-instance-readonly-field',
        'private-instance-field',
        'private-instance-readonly-field',
        'private-static-method',
        'public-static-readonly-field',
        'constructor',
        'public-static-method',
       ],
       ['public-instance-method', 'public-instance-get', 'public-instance-set'],
      ],
      order: 'as-written',
     },
    },
   ],

   /* @category vocabulary enforcement */
   'local/enforce-category-vocabulary': 'warn',

   /* Per-symbol-type required tag enforcement */
   'local/enforce-required-tags': 'warn',

   /* @see tag format enforcement */
   'local/enforce-see-format': 'warn',

   /* @param/@returns fragment conventions */
   'local/enforce-tag-fragments': 'warn',

   'prettier/prettier': 'error',

   /* Avoid opaque abbreviations in identifiers */
   'unicorn/prevent-abbreviations': [
    'warn',
    {
     allowList: {
      // Mathematical terms
      mod: true,
      modSafe: true,
      safeMod: true,
      modUnchecked: true,
      flooredMod: true,
      flooredModSafe: true,
      flooredModUnchecked: true,
      truncatedMod: true,
      // Common transformation parameters (standard in gl-matrix, three.js)
      dst: true,
      src: true,
      dir: true,
      rel: true,
     },
     replacements: {
      ctx: { context: true },
      len: { length: true },
      mul: { multiply: true },
      div: { divide: true },
     },
     extendDefaultReplacements: true,
    },
   ],

   /* ─────── Immutability ─────── */
   // Disallow any mutation of objects previously passed to Object.freeze
   // 'immutable/no-mutation': ['error', { freeze: true }],
  },
 },

 /* ───── Test files: disable public-API doc requirements ────────── */
 {
  files: ['**/test/**/*.ts'],
  rules: {
   // Test helpers don't need public API documentation tags (@category, @since).
   'local/enforce-required-tags': 'off',
  },
 },

 /* ───────────────── Allow empty .d.ts placeholder files ─────────── */
 {
  files: ['**/*.d.ts'],
  rules: { 'unicorn/no-empty-file': 'off' },
 },

 /* ── Node‑only build/config scripts (Rollup, Husky, etc.) ───────── */
 {
  files: ['*.config.*', 'rollup.config.mjs', 'scripts/**/*.mjs'],
  languageOptions: {
   globals: {
    process: 'readonly',
    __dirname: 'readonly',
    require: 'readonly',
    module: 'readonly',
    exports: 'readonly',
    console: 'readonly',
   },
  },
  rules: {
   'no-console': 'off',
  },
 },
]);
