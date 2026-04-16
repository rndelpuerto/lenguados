/**
 * Glob-based discovery for stress test definitions.
 *
 * Discovers StressTestDefinition objects from
 * src/packages/{packageName}/stress/*.stress-def.ts files.
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { StressTestDefinition } from './stress-types.ts';

const PACKAGES_DIR = new URL('../packages/', import.meta.url).pathname;

/**
 * Discover stress test definitions for a package.
 *
 * Returns all StressTestDefinition objects found in the package's
 * stress/ directory. Returns empty array if directory does not exist.
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
