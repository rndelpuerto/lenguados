/**
 * @file harness/stress-discovery.ts
 * @description Provide glob-based discovery for stress test definitions
 *
 * Discovers StressTestDefinition objects from
 * src/packages/{packageName}/stress/*.stress-def.ts files.
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { StressTestDefinition } from './stress-types.ts';

const PACKAGES_DIR = new URL('../packages/', import.meta.url).pathname;

/**
 * Discover stress test definitions for a package
 *
 * @remarks
 * Scans the package's `stress/` directory for `*.stress-def.ts` files,
 * dynamically imports each, and collects the exported `stressTest` definitions.
 * Returns an empty array if the directory does not exist.
 *
 * @param packageName - The package directory name to scan (defaults to 'math2d')
 * @returns All discovered StressTestDefinition objects
 */
export async function discoverStressTests(
 packageName: string = 'math2d',
): Promise<StressTestDefinition[]> {
 const stressDir = join(PACKAGES_DIR, packageName, 'stress');

 let files: string[];
 try {
  files = await readdir(stressDir);
 } catch {
  return [];
 }

 const defFiles = files.filter((f) => f.endsWith('.stress-def.ts')).sort();

 const definitions: StressTestDefinition[] = [];

 for (const file of defFiles) {
  const modulePath = join(stressDir, file);
  const mod = (await import(modulePath)) as { stressTest?: StressTestDefinition };

  if (mod.stressTest) {
   definitions.push(mod.stressTest);
  } else {
   console.warn(`  WARNING: ${file} does not export stressTest, skipping.`);
  }
 }

 return definitions;
}
