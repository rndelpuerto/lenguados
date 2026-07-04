/**
 * @file scripts/cross-env.ts
 * @description Run cross-environment determinism verification from the CLI
 *
 * Resolves the target package's cross-env configuration by convention
 * (`src/packages/{name}/cross-env-config.ts`); a package without one fails
 * loudly naming the missing capability.
 *
 * Usage: npm run cross-env -- [--browsers=chromium,firefox,webkit]
 *        [--generate-golden] [--verify=path/to/golden.json] [--package=math2d]
 *        [--allow-missing-browsers]
 *
 * Verify mode is fail-loud: any divergence in any environment, or any
 * requested browser that could not run, exits non-zero. The
 * `--allow-missing-browsers` flag downgrades missing browsers (NOT
 * divergences) to warnings for local machines without every engine
 * installed; CI never passes it.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { ensureBuildArtifacts, loadPackageLoader, parseCommonFlags } from './run.ts';
import {
 generateGoldenFile,
 writeGoldenFile,
 readGoldenFile,
 verifyAgainstGoldenFile,
} from '../src/cross-env/golden-file.ts';
import { runCrossBrowserVerification } from '../src/cross-env/playwright-runner.ts';
import type { BrowserName } from '../src/cross-env/playwright-runner.ts';
import type { CrossEnvConfig } from '../src/cross-env/cross-env-types.ts';
import { hashFloat64Array } from '../src/cross-env/state-hash.ts';

const args = process.argv.slice(2);
const { packageName } = parseCommonFlags(args);
const generateGolden = args.includes('--generate-golden');
const allowMissingBrowsers = args.includes('--allow-missing-browsers');
const verifyPath = args.find((a) => a.startsWith('--verify='))?.split('=')[1];
const browsersArg = args.find((a) => a.startsWith('--browsers='))?.split('=')[1];
const browsers = (browsersArg?.split(',') ?? ['chromium', 'firefox', 'webkit']) as BrowserName[];

const loader = await loadPackageLoader(packageName);

// Resolve the package's cross-env config by convention. The existsSync
// precheck makes "package lacks the cross-env capability" unambiguous; an
// import error from an EXISTING config is re-thrown verbatim.
const crossEnvConfigPath = fileURLToPath(
 new URL(`../src/packages/${packageName}/cross-env-config.ts`, import.meta.url),
);
if (!existsSync(crossEnvConfigPath)) {
 console.error(
  `\n  ERROR: package '${packageName}' lacks the cross-environment determinism capability (no src/packages/${packageName}/cross-env-config.ts).\n`,
 );
 process.exit(1);
}
const crossEnvModule = await import(`../src/packages/${packageName}/cross-env-config.ts`);
const crossEnvConfig = Object.values(crossEnvModule).find(
 (v): v is CrossEnvConfig =>
  typeof v === 'object' && v !== null && 'kernelFunctions' in v && 'exposeSnippet' in v,
);
if (!crossEnvConfig) {
 console.error(
  `\n  ERROR: src/packages/${packageName}/cross-env-config.ts exports no CrossEnvConfig-shaped object.\n`,
 );
 process.exit(1);
}

await ensureBuildArtifacts(['production'], loader);

// Packages whose kernel vocabulary is not fully re-exported by the production
// barrel provide a dedicated kernel-module loader.
const kernelModule = crossEnvConfig.loadKernelModule
 ? await crossEnvConfig.loadKernelModule()
 : ((await loader.load('production')) as Record<string, unknown>);
crossEnvConfig.prepareModule?.(kernelModule);

if (generateGolden) {
 console.log('\n  Generating golden file from Node.js (V8/fdlibm)...');
 const golden = generateGoldenFile(
  kernelModule as Record<string, (...args: number[]) => number>,
  crossEnvConfig,
 );
 const path = fileURLToPath(new URL('../baselines/golden.json', import.meta.url));
 writeGoldenFile(path, golden);
 console.log(`  Golden file: ${golden.entries.length} entries written to ${path}`);

 // Per-kernel breakdown — a declared kernel with zero entries has no shipped
 // implementation (or threw on every input) and is NOT covered by the file.
 const entriesPerFn = new Map<string, number>();
 for (const entry of golden.entries) {
  entriesPerFn.set(entry.fn, (entriesPerFn.get(entry.fn) ?? 0) + 1);
 }
 for (const fn of crossEnvConfig.kernelFunctions) {
  const count = entriesPerFn.get(fn) ?? 0;
  console.log(
   `    ${fn}: ${count} entries${count === 0 ? '  ⚠ NOT COVERED (no shipped implementation)' : ''}`,
  );
 }

 // Hash the golden state for quick verification
 const values = golden.entries.map((e) => e.expectedDecimal);
 console.log(`  State hash: ${hashFloat64Array(values)}`);
 console.log('');
} else if (verifyPath) {
 console.log(`\n  Verifying against golden file: ${verifyPath}`);
 const golden = readGoldenFile(verifyPath);

 // Divergences accumulate across ALL environments (Node + every browser);
 // a single mismatched bit anywhere fails the run.
 let totalDivergences = 0;

 // Node.js verification (same engine as generator)
 console.log('  Node.js (V8):');
 const nodeResults = verifyAgainstGoldenFile(
  golden,
  kernelModule as Record<string, (...args: number[]) => number>,
  'Node.js',
 );
 for (const r of nodeResults) {
  console.log(`    ${r.fn}: ${r.passed}/${r.totalTests} passed, ${r.failed} failed`);
  totalDivergences += r.failed;
 }

 // Cross-browser verification
 console.log(`\n  Running cross-browser verification: ${browsers.join(', ')}`);
 const { results: browserResults, skipped } = await runCrossBrowserVerification(
  golden,
  crossEnvConfig,
  browsers,
 );
 for (const br of browserResults) {
  console.log(`\n  ${br.browser} (${br.engine}, timer: ${br.timerResolutionUs.toFixed(0)}us):`);
  for (const r of br.verificationResults) {
   const status = r.failed === 0 ? 'ALL MATCH' : `${r.failed} DIVERGENCES`;
   console.log(`    ${r.fn}: ${r.passed}/${r.totalTests} — ${status}`);
   totalDivergences += r.failed;
   for (const d of r.divergences.slice(0, 3)) {
    console.log(
     `      inputs=${JSON.stringify(d.inputs)} expected=${d.expected.hex} actual=${d.actual.hex}`,
    );
   }
   if (r.divergences.length > 3) {
    console.log(`      ... and ${r.divergences.length - 3} more`);
   }
  }
 }

 // Skip policy: a requested browser that did not run is a FAILURE by default —
 // a silent skip would report green while removing the run's purpose. The
 // --allow-missing-browsers opt-out exists for local machines only.
 const skipLines = skipped.map((s) => `${s.browser} (${s.reason})`);
 if (skipped.length > 0 && !allowMissingBrowsers) {
  console.error(`\n  Requested browsers did not run: ${skipLines.join(', ')}`);
 } else if (skipped.length > 0) {
  console.warn(`\n  WARNING: skipped browsers (--allow-missing-browsers): ${skipLines.join(', ')}`);
 }

 const environmentsVerified = 1 + browserResults.length; // Node + browsers
 if (totalDivergences > 0 || (skipped.length > 0 && !allowMissingBrowsers)) {
  const causes: string[] = [];
  if (totalDivergences > 0) causes.push(`${totalDivergences} divergences`);
  if (skipped.length > 0 && !allowMissingBrowsers) {
   causes.push(`${skipped.length} requested browsers missing`);
  }
  console.error(
   `\n  Cross-environment verification FAILED: ${causes.join(', ')} (${environmentsVerified} environments verified).\n`,
  );
  process.exitCode = 1;
 } else {
  console.log(
   `\n  Cross-environment verification PASSED: ${golden.entries.length} entries bit-exact across ${environmentsVerified} environments.\n`,
  );
 }
} else {
 console.log(`
  Usage: npm run cross-env -- [options]

  Options:
    --generate-golden          Generate golden file from Node.js (V8)
    --verify=<path>            Verify golden file against current engine + browsers
                               (exits non-zero on any divergence or missing browser)
    --browsers=<list>          Browsers: chromium,firefox,webkit (default: all)
    --allow-missing-browsers   Downgrade missing browsers to warnings (local use;
                               divergences still fail)
    --package=<name>           Package to verify (default: math2d)
 `);
}
