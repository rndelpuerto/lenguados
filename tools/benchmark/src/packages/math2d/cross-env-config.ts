/**
 * @file packages/math2d/cross-env-config.ts
 * @description Cross-environment determinism configuration for @lenguados/math2d
 *
 * Declares the kernel vocabulary, golden-file input generation, browser
 * bundle, and the browser expose snippet. The cross-env script resolves this
 * file by convention (`src/packages/{name}/cross-env-config.ts`); a package
 * without one does not support determinism verification.
 */

import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { generateInputs, ALL_KERNEL_FUNCTIONS } from './stress/reference-oracle.ts';

import type { KernelFunction } from './stress/reference-oracle.ts';
import type { CrossEnvConfig } from '../../cross-env/cross-env-types.ts';

import { math2dLoader } from './loader.ts';

/**
 * Production artifact of the deterministic kernel module (subpath export)
 *
 * @remarks
 * The package barrel deliberately does not re-export the hyperbolic kernels
 * (`sinh`, `cosh`, `tanh`) — they are L0-internal for the barrel's public
 * surface. `sinh` and `cosh` ship through this subpath artifact (Complex
 * consumes them); `tanh` has no library-internal consumer, so Rollup
 * tree-shakes it out of every shipped artifact — the generator flags it as
 * NOT COVERED until an artifact exposes it.
 */
const deterministicKernelsPath = join(
 math2dLoader.root,
 'lib',
 'esm',
 'deterministic',
 'deterministic-kernels.production.js',
);

/**
 * Cross-environment determinism configuration for @lenguados/math2d
 *
 * @remarks
 * Declares the fourteen scalar fdlibm kernels plus inputs covering boundary
 * values, π multiples, the Cody-Waite boundary, and subnormals. The golden
 * file covers the thirteen kernels with shipped implementations — the scalar
 * `tanh` kernel has no library-internal consumer, is tree-shaken out of every
 * shipped artifact, and therefore produces no golden entries. The expose
 * snippet forces fdlibm mode (`config.useNativeMath = false`) so browsers
 * exercise the deterministic implementation, not native Math.
 */
export const math2dCrossEnvConfig: CrossEnvConfig = {
 kernelFunctions: ALL_KERNEL_FUNCTIONS,
 generateInputs: (fn, count) => generateInputs(fn as KernelFunction, count),
 browserBundlePath: deterministicKernelsPath,
 exposeSnippet: [
  '// Expose deterministic kernels on window for the evaluate() call.',
  '// `__benchModule` is the package module namespace bound by the runner’s',
  '// esbuild pre-flatten entry — export NAMES survive minification, internal',
  '// top-level identifiers do not.',
  'const {',
  ' sin, cos, tan, asin, acos, atan, atan2, log, exp, pow, hypot,',
  ' sinh, cosh, tanh, config,',
  '} = __benchModule;',
  'window.__benchKernels = {',
  ' sin, cos, tan, asin, acos, atan, atan2, log, exp, pow, hypot,',
  ' sinh, cosh, tanh, config,',
  '};',
  '// Ensure fdlibm mode (not native)',
  'window.__benchKernels.config.useNativeMath = false;',
 ].join('\n'),
 prepareModule: (mod) => {
  const config = math2dLoader.getConfig?.(mod);
  if (config && 'useNativeMath' in config) {
   config['useNativeMath'] = false;
  }
 },
 loadKernelModule: async () => {
  const barrel = (await math2dLoader.load('production')) as Record<string, unknown>;
  const kernels = (await import(pathToFileURL(deterministicKernelsPath).href)) as Record<
   string,
   unknown
  >;
  // Force fdlibm mode on BOTH module-scope configs — each artifact bundles
  // its own copy of the runtime configuration object.
  for (const mod of [barrel, kernels]) {
   const config = math2dLoader.getConfig?.(mod);
   if (config && 'useNativeMath' in config) {
    config['useNativeMath'] = false;
   }
  }
  // Barrel exports win for the shared scalar kernels (the artifact CI has
  // always verified); the deterministic subpath artifact contributes the
  // hyperbolic kernels the barrel deliberately does not re-export.
  return { ...kernels, ...barrel };
 },
};
