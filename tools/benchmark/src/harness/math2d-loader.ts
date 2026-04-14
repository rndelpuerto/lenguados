/**
 * Centralized import adapter for @lenguados/math2d.
 *
 * Dynamically resolves the correct build entry point based on the
 * active buildMode dimension cell. This is the ONLY module that
 * references math2d's file paths — all suites import through here.
 */

export type BuildMode = 'development' | 'production';

/**
 * Absolute path to the math2d package root.
 * Exported so other modules (dx, cross-env) can resolve math2d paths
 * without duplicating the URL computation.
 */
export const MATH2D_ROOT = new URL('../../../../packages/math2d/', import.meta.url).pathname;

// Point directly to the ESM bundle files (not the re-export wrappers).
// tsx/esbuild doesn't correctly propagate named exports through .mjs → .js
// re-export chains when the target package lacks "type": "module".
const ENTRY_POINTS: Record<BuildMode, string> = {
 development: `${MATH2D_ROOT}lib/esm/index.development.js`,
 production: `${MATH2D_ROOT}lib/esm/module.js`,
};

/**
 * Cache for loaded modules keyed by build mode.
 * Avoids repeated dynamic imports for the same mode.
 */
const moduleCache = new Map<BuildMode, unknown>();

/**
 * Load the math2d module for a given build mode.
 *
 * Returns the full module namespace. The caller accesses
 * Vector2, Matrix3, config, etc. from the returned object.
 */
export async function loadMath2d(mode: BuildMode): Promise<Record<string, unknown>> {
 const cached = moduleCache.get(mode);
 if (cached) {
  return cached as Record<string, unknown>;
 }

 const entryPoint = ENTRY_POINTS[mode];
 const mod = await import(entryPoint);
 moduleCache.set(mode, mod);
 return mod as Record<string, unknown>;
}

/**
 * Get the determinism config object from a loaded math2d module.
 *
 * The config object has a `useNativeMath` boolean that toggles
 * between fdlibm (deterministic) and native Math.* functions.
 */
export function getConfig(mod: Record<string, unknown>): { useNativeMath: boolean } {
 return mod['config'] as { useNativeMath: boolean };
}

/**
 * Verify that math2d build artifacts exist for the requested modes.
 *
 * Returns an error message if artifacts are missing, or null if all OK.
 */
export async function verifyBuildArtifacts(modes: BuildMode[]): Promise<string | null> {
 const { access } = await import('node:fs/promises');

 for (const mode of modes) {
  const entryPoint = ENTRY_POINTS[mode];
  try {
   await access(entryPoint);
  } catch {
   const command = mode === 'production' ? 'npm run dist' : 'npm run build';
   return (
    `math2d ${mode} build artifacts not found at ${entryPoint}.\n` +
    `Run \`${command}\` from the repository root first.`
   );
  }
 }

 const typesPath = `${MATH2D_ROOT}lib/@types/index.d.ts`;
 try {
  await access(typesPath);
 } catch {
  return (
   `math2d type declarations not found at ${typesPath}.\n` +
   'Run `npm run build` from the repository root first.'
  );
 }

 return null;
}
