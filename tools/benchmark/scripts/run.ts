/**
 * @file scripts/run.ts
 * @description Provide shared CLI utilities for benchmark scripts
 *
 * Includes build artifact verification and common flag parsing used
 * by all benchmark entry points.
 */

import type { BuildMode } from '../src/harness/dimensions.ts';
import type { PackageLoader } from '../src/harness/package-loader.ts';
import { verifyArtifacts } from '../src/harness/loader-utils.ts';

/**
 * Verify that build artifacts exist for the given package loader
 *
 * Exit the process with an error message if artifacts are missing.
 *
 * @param modes - Build modes to verify (e.g., development, production)
 * @param loader - Package loader whose entry points are checked
 */
export async function ensureBuildArtifacts(
 modes: BuildMode[],
 loader: PackageLoader,
): Promise<void> {
 const entryPoints: Record<string, string> = {};
 for (const mode of modes) {
  entryPoints[mode] = loader.entryPoints[mode];
 }
 const error = await verifyArtifacts(entryPoints as Record<BuildMode, string>, loader.name);
 if (error) {
  console.error(`\n  ERROR: ${error}\n`);
  process.exit(1);
 }
}

/**
 * Parse common CLI flags shared across all entry points
 *
 * @param args - Raw CLI arguments (typically `process.argv.slice(2)`)
 * @returns Parsed build modes, package name, and help flag
 */
export function parseCommonFlags(args: string[]): {
 buildModes: BuildMode[];
 packageName: string;
 help: boolean;
} {
 const help = args.includes('--help') || args.includes('-h');
 const buildArg = args.find((a) => a.startsWith('--build='));
 const pkgArg = args.find((a) => a.startsWith('--package='));

 let buildModes: BuildMode[];
 if (buildArg) {
  const value = buildArg.split('=')[1]!;
  buildModes = value.split(',') as BuildMode[];
 } else {
  buildModes = ['development', 'production'];
 }

 const packageName = pkgArg?.split('=')[1] ?? 'math2d';

 return { buildModes, packageName, help };
}

/**
 * Load a package loader module by name
 *
 * Exit with a clear error if the package does not exist.
 *
 * @param packageName - Package to load (e.g., "math2d")
 * @returns The resolved PackageLoader instance
 */
export async function loadPackageLoader(packageName: string): Promise<PackageLoader> {
 try {
  const mod = await import(`../src/packages/${packageName}/loader.ts`);
  // Find the first exported PackageLoader (convention: named export with 'load' method)
  const loader = Object.values(mod).find(
   (v): v is PackageLoader =>
    typeof v === 'object' && v !== null && 'name' in v && 'load' in v && 'entryPoints' in v,
  );
  if (!loader) {
   throw new Error(`No PackageLoader exported from packages/${packageName}/loader.ts`);
  }
  return loader;
 } catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`\n  ERROR: Unknown package '${packageName}'. ${msg}\n`);
  process.exit(1);
 }
}

// When run directly, verify both builds exist
if (import.meta.url === `file://${process.argv[1]}`) {
 const { buildModes, packageName } = parseCommonFlags(process.argv.slice(2));
 const loader = await loadPackageLoader(packageName);
 await ensureBuildArtifacts(buildModes, loader);
 console.log('Build artifacts verified. Ready to run benchmarks.');
}
