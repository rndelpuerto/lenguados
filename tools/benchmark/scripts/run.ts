/**
 * Main entry point for the benchmark laboratory.
 *
 * Verifies math2d build artifacts exist before proceeding
 * to any benchmark, stress test, or analysis operation.
 */

import { verifyBuildArtifacts } from '../src/harness/math2d-loader.ts';
import type { BuildMode } from '../src/harness/math2d-loader.ts';

export async function ensureBuildArtifacts(modes: BuildMode[]): Promise<void> {
 const error = await verifyBuildArtifacts(modes);
 if (error) {
  console.error(`\n  ERROR: ${error}\n`);
  process.exit(1);
 }
}

/**
 * Parse common CLI flags shared across all entry points.
 */
export function parseCommonFlags(args: string[]): {
 buildModes: BuildMode[];
 help: boolean;
} {
 const help = args.includes('--help') || args.includes('-h');
 const buildArg = args.find((a) => a.startsWith('--build='));
 let buildModes: BuildMode[];

 if (buildArg) {
  const value = buildArg.split('=')[1]!;
  buildModes = value.split(',') as BuildMode[];
 } else {
  buildModes = ['development', 'production'];
 }

 return { buildModes, help };
}

// When run directly, verify both builds exist
if (import.meta.url === `file://${process.argv[1]}`) {
 const { buildModes } = parseCommonFlags(process.argv.slice(2));
 await ensureBuildArtifacts(buildModes);
 console.log('Build artifacts verified. Ready to run benchmarks.');
}
