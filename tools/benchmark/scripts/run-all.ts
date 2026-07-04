/**
 * @file scripts/run-all.ts
 * @description Orchestrate a full benchmark laboratory run
 *
 * Execute benchmarks → stress tests → DX analysis → cross-library comparison
 * in sequence, producing a combined summary.
 */

import { execSync } from 'node:child_process';
import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';

// Propagate --package flag if provided
const pkgArg = process.argv.find((a) => a.startsWith('--package='));
const pkgFlag = pkgArg ? ` ${pkgArg}` : '';
const packageName = pkgArg?.split('=')[1] ?? 'math2d';

// --package=all: fan out over every registered package loader (generic — a
// newly registered package is picked up with zero script edits), preserving
// continue-then-fail semantics across packages.
if (packageName === 'all') {
 const { readdirSync } = await import('node:fs');
 const { join, resolve } = await import('node:path');
 const { execSync: exec } = await import('node:child_process');
 const packagesDir = resolve(import.meta.dirname, '..', 'src', 'packages');
 const registered = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
 const failed: string[] = [];
 for (const pkg of registered) {
  console.log(`\n  ########## Package: ${pkg} ##########\n`);
  try {
   exec(`./node_modules/.bin/tsx scripts/run-all.ts --package=${pkg}`, {
    stdio: 'inherit',
    cwd: join(import.meta.dirname, '..'),
   });
  } catch {
   failed.push(pkg);
  }
 }
 if (failed.length > 0) {
  console.error(`\n  Full run FAILED for package(s): ${failed.join(', ')}`);
  process.exit(1);
 }
 process.exit(0);
}

const loader = await loadPackageLoader(packageName);
await ensureBuildArtifacts(['development', 'production'], loader);

const tsx = './node_modules/.bin/tsx';
const nodeGc = `node --expose-gc ${tsx}`;

console.log('\n  ================================================================');
console.log('  Benchmark Laboratory — Full Run');
console.log('  ================================================================\n');

const startTime = Date.now();
const failedPhases: string[] = [];

/**
 * Execute a labeled subprocess and log its output
 *
 * @remarks
 * Continue-then-fail: a failing phase is recorded and the remaining phases
 * still run (diagnostic value), but the orchestrator exits non-zero at the
 * end so CI goes red instead of uploading partial artifacts under green.
 *
 * @param label - Display label for the test category
 * @param command - Shell command to execute
 */
function run(label: string, command: string): void {
 console.log(`\n  --- ${label} ---\n`);
 try {
  execSync(command, { stdio: 'inherit', cwd: process.cwd() });
 } catch (err: unknown) {
  failedPhases.push(label);
  console.error(`  FAILED: ${label}`);
  console.error(err instanceof Error ? err.message : String(err));
 }
}

/**
 * Whether the package registers an optional capability (config file present)
 *
 * @remarks
 * Capability model: a phase beyond the core bench/stress pair only applies to
 * packages that register its config (e.g. `dx-config.ts`,
 * `comparison-config.ts`). Unregistered phases are SKIPPED with a message —
 * not failed — so `--package=all` stays green across heterogeneous packages.
 *
 * @param configFile - Config filename that declares the capability
 */
async function hasCapability(configFile: string): Promise<boolean> {
 const { existsSync } = await import('node:fs');
 const { resolve } = await import('node:path');
 return existsSync(resolve(import.meta.dirname, '..', 'src', 'packages', packageName, configFile));
}

// 1. Performance Benchmarks (quick: production + fdlibm only)
run(
 'Performance Benchmarks',
 `${tsx} scripts/bench.ts --build=production --determinism=fdlibm${pkgFlag}`,
);

// 2. Stress Tests
run('Stress Tests', `${nodeGc} scripts/stress.ts --samples=500${pkgFlag}`);

// 3. DX Analysis (capability-gated)
if (await hasCapability('dx-config.ts')) {
 run('DX Analysis', `${tsx} scripts/dx.ts${pkgFlag}`);
} else {
 console.log(`\n  --- DX Analysis --- SKIPPED ('${packageName}' registers no dx-config.ts)\n`);
}

// 4. Cross-Library Comparison (capability-gated)
if (await hasCapability('comparison-config.ts')) {
 run('Cross-Library Comparison', `${tsx} scripts/compare.ts${pkgFlag}`);
} else {
 console.log(
  `\n  --- Cross-Library Comparison --- SKIPPED ('${packageName}' registers no comparison-config.ts)\n`,
 );
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  ================================================================`);
if (failedPhases.length > 0) {
 console.error(`  Full run FAILED in ${elapsed}s — failed phase(s): ${failedPhases.join(', ')}`);
 console.log(`  ================================================================\n`);
 process.exit(1);
}
console.log(`  Full run completed in ${elapsed}s`);
console.log(`  ================================================================\n`);
