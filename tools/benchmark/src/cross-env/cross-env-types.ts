/**
 * @file cross-env/cross-env-types.ts
 * @description Define the configuration interface for cross-environment verification
 *
 * Each package that supports determinism verification provides a
 * CrossEnvConfig (by convention at `src/packages/{name}/cross-env-config.ts`)
 * declaring its kernel vocabulary, input generation, browser bundle, and the
 * snippet exposing the kernels inside a browser context. Shared cross-env
 * code never names a specific package.
 */

/** Declare a package's cross-environment determinism verification setup */
export interface CrossEnvConfig {
 /** Kernel function names verified against the golden file */
 kernelFunctions: readonly string[];

 /** Generate input tuples (one array per call) for a kernel function */
 generateInputs: (fn: string, count: number) => number[][];

 /** Absolute path of the production ESM bundle injected into browsers */
 browserBundlePath: string;

 /**
  * Module-script snippet exposing the kernels on `window.__benchKernels`
  *
  * @remarks
  * Bundled TOGETHER with the browser entry by the runner's esbuild
  * pre-flatten step and injected as one self-contained
  * `<script type="module">`. The package's module namespace is in scope as
  * `__benchModule` — reach exports through it (their PUBLIC names survive
  * minification; internal top-level identifiers do not). The snippet MUST
  * assign a `Record<string, (...args: number[]) => number>` keyed by kernel
  * name to `window.__benchKernels`, and perform any mode setup (for example
  * forcing the deterministic kernels over native Math).
  */
 exposeSnippet: string;

 /** Prepare the Node-loaded module for verification (for example mode toggles) */
 prepareModule?: (mod: Record<string, unknown>) => void;

 /**
  * Load the module record exposing the kernel vocabulary in Node
  *
  * @remarks
  * Optional override for packages whose kernel surface is not fully
  * re-exported by the production barrel (for example kernels shipped only
  * through a subpath artifact). When absent, callers load the package
  * loader's production entry. Implementations return a record with as many
  * of the functions named in `kernelFunctions` as the shipped artifacts
  * expose — generate/verify skip and loudly flag the missing ones — and are
  * responsible for any mode setup on the modules they load; `prepareModule`
  * still runs on the returned record afterwards.
  */
 loadKernelModule?: () => Promise<Record<string, unknown>>;
}
