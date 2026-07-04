/**
 * @file @types/generic.d.ts
 * @description Global TypeScript declarations available to all packages in the monorepo.
 *
 * These declarations are picked up by `tsconfig.json` `typeRoots` and made available
 * across the workspace without explicit imports.
 */

/**
 * Library-side build-time development-mode flag.
 *
 * @remarks
 * Replaced by SWC at library build time via the `jsc.transform.optimizer.globals.vars`
 * configuration in `rollup.config.mjs` (`__LENGUADOS_DEV__: IS_PRODUCTION ? 'false' : 'true'`).
 *
 * - In production library bundles: `__LENGUADOS_DEV__` is the literal `false`.
 *   `if (__LENGUADOS_DEV__) { ... }` blocks are eliminated by the minifier.
 * - In development library bundles: `__LENGUADOS_DEV__` is the literal `true`.
 *   Guarded blocks remain reachable.
 *
 * Usage pattern at call sites in `packages/math2d/src/`:
 * ```typescript
 * if (__LENGUADOS_DEV__) {
 *  assertFinite(value, 'name');
 * }
 * ```
 *
 * Tests run with `__LENGUADOS_DEV__ = true` (configured via the test transformer),
 * so all assertion paths remain testable.
 */
declare const __LENGUADOS_DEV__: boolean;
