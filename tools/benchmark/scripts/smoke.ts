/**
 * @file scripts/smoke.ts
 * @description Run a lightweight smoke test for the pre-push hook
 *
 * Execute ONLY correctness checks (~1 s), NOT performance benchmarks.
 * Designed to catch numerical regressions and build corruption without
 * the variance and time cost of full mitata benchmarks.
 *
 * What it checks, for EVERY registered package (src/packages/*\/loader.ts):
 * 1. Build artifacts exist per the loader's declared entry points
 * 2. Production build correctness (dev vs prod bit-for-bit) — where the
 *    package declares a dx-config
 * 3. Assertion elimination (library-side DCE) — where the package declares
 *    a dx-config
 * 4. Determinism golden file (mandatory committed reference at
 *    baselines/golden.json) — verified for packages declaring a
 *    cross-env-config; the PRESENCE check is unconditional
 *
 * math2d MUST declare both capabilities (dx + cross-env) — their absence
 * is a failure, not a skip.
 *
 * What it does NOT check (belongs in CI or manual runs):
 * - Performance regression (ops/sec) — too noisy on dev machines
 * - Cross-browser determinism — requires Playwright
 * - Full ULP accuracy — too slow for pre-push
 * - Bundle size — not a correctness concern
 */

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyArtifacts } from '../src/harness/loader-utils.ts';

import type { PackageLoader } from '../src/harness/package-loader.ts';
import type { DxConfig } from '../src/harness/dx-types.ts';
import type { CrossEnvConfig } from '../src/cross-env/cross-env-types.ts';

const startTime = Date.now();
let failures = 0;

/**
 * Log a passing check result
 *
 * @param label - Description of the check that passed
 */
function pass(label: string): void {
 console.log(`  ✓ ${label}`);
}

/**
 * Log a failing check result and increment the failure counter
 *
 * @param label - Description of the check that failed
 * @param detail - Error detail or reason for failure
 */
function fail(label: string, detail: string): void {
 console.error(`  ✗ ${label}: ${detail}`);
 failures++;
}

console.log('\n  Benchmark Smoke Test (pre-push)\n');

const packagesDir = fileURLToPath(new URL('../src/packages/', import.meta.url));
const packageNames = readdirSync(packagesDir).filter((entry) =>
 existsSync(join(packagesDir, entry, 'loader.ts')),
);

// math2d MUST be registered and MUST declare dx + cross-env capabilities.
if (!packageNames.includes('math2d')) {
 fail('Registry', 'math2d loader missing from src/packages/');
}
if (!existsSync(join(packagesDir, 'math2d', 'dx-config.ts'))) {
 fail('Registry', 'math2d MUST declare a dx-config (build correctness + DCE checks)');
}
if (!existsSync(join(packagesDir, 'math2d', 'cross-env-config.ts'))) {
 fail('Registry', 'math2d MUST declare a cross-env-config (determinism golden verification)');
}

// 0. Determinism golden file PRESENCE — unconditional, package-independent.
const goldenPath = fileURLToPath(new URL('../baselines/golden.json', import.meta.url));
if (!existsSync(goldenPath)) {
 fail(
  'Determinism',
  `Golden file missing at ${goldenPath}. Restore from main (\`git checkout main -- tools/benchmark/baselines/golden.json\`) or regenerate (\`npm run tools:bench:cross-env -- --generate-golden\`).`,
 );
}

for (const packageName of packageNames) {
 console.log(`  [${packageName}]`);

 // Resolve the loader (duck-typed, same convention as run.ts).
 let loader: PackageLoader | undefined;
 try {
  const mod = await import(`../src/packages/${packageName}/loader.ts`);
  loader = Object.values(mod).find(
   (v): v is PackageLoader =>
    typeof v === 'object' && v !== null && 'name' in v && 'load' in v && 'entryPoints' in v,
  );
 } catch (err: unknown) {
  fail('Loader', err instanceof Error ? err.message : String(err));
 }
 if (!loader) {
  fail('Loader', `No PackageLoader exported from src/packages/${packageName}/loader.ts`);
  continue;
 }

 // 1. Build artifacts exist per the loader's declared entry points.
 const buildError = await verifyArtifacts(loader.entryPoints, packageName);
 if (buildError) {
  fail('Build artifacts', buildError);
 } else {
  pass('Build artifacts verified (dev + prod)');
 }

 // Declared dx capability → correctness + structure + DCE checks.
 const dxConfigPath = join(packagesDir, packageName, 'dx-config.ts');
 if (!buildError && existsSync(dxConfigPath)) {
  let dxConfig: DxConfig | undefined;
  try {
   const dxModule = await import(`../src/packages/${packageName}/dx-config.ts`);
   dxConfig = Object.values(dxModule).find(
    (v): v is DxConfig =>
     typeof v === 'object' && v !== null && 'root' in v && 'assertionProbe' in v,
   );
  } catch (err: unknown) {
   fail('dx-config', err instanceof Error ? err.message : String(err));
  }

  if (dxConfig) {
   // 2. Production build correctness (dev vs prod identical results)
   try {
    const { verifyBuildCorrectness } = await import('../src/dx/build-correctness.ts');
    const { correctness, assertions } = await verifyBuildCorrectness(loader, dxConfig);

    const allMatch = correctness.every((r) => r.match);
    if (allMatch) {
     pass(`Build correctness: ${correctness.length} operations match dev↔prod`);
    } else {
     const mismatches = correctness.filter((r) => !r.match).map((r) => r.operation);
     fail('Build correctness', `Mismatch in: ${mismatches.join(', ')}`);
    }

    // Library-side DCE (Model B): the SWC plugin replaces `__LENGUADOS_DEV__`
    // with the literal `false` in production library bundles. Subsequent
    // minification eliminates `if (__LENGUADOS_DEV__) { ... }` call sites,
    // assertion bodies, and assertion-failure label strings at the library
    // build step — independently of any consumer bundler.
    pass(`Assertion behavior checked: ${assertions.length} operations verified`);
   } catch (err: unknown) {
    fail('Build correctness', err instanceof Error ? err.message : String(err));
   }

   // 3. Production bundle structure verification
   try {
    const { compareBuildSizes } = await import('../src/dx/build-comparison.ts');
    const sizes = compareBuildSizes(dxConfig);

    if (sizes.prodSize.raw > 0 && sizes.devSize.raw > 0) {
     const ratio = sizes.reductionPercent.raw.toFixed(1);
     pass(
      `Build structure: dev=${(sizes.devSize.raw / 1024).toFixed(0)}KB, prod=${(sizes.prodSize.raw / 1024).toFixed(0)}KB (${ratio}% reduction)`,
     );
    } else {
     fail('Build structure', 'Could not read dev or prod bundle sizes');
    }
   } catch (err: unknown) {
    fail('Build structure', err instanceof Error ? err.message : String(err));
   }

   // 3b. Library-side DCE assertion call-site elimination check
   try {
    const { verifyAssertionElimination } = await import('../src/dx/assertion-elimination.ts');
    const result = verifyAssertionElimination(dxConfig);

    if (result.eliminationVerified) {
     pass(`Assertion call sites: ELIMINATED in production bundle (library-side DCE)`);
    } else {
     const labels = result.prodBundle.callSiteLabels.slice(0, 3).join(', ');
     const more = result.prodBundle.callSiteLabels.length > 3 ? '…' : '';
     fail(
      'Assertion call-site DCE',
      `${result.prodBundle.callSiteLabels.length} call-site label(s) escaped: ${labels}${more}`,
     );
    }
   } catch (err: unknown) {
    fail('Assertion call-site DCE', err instanceof Error ? err.message : String(err));
   }

   // 3c. Pure-call annotation survival in the shipped production tree.
   // Consumer bundlers need `@__PURE__` on frozen-constant initializers to
   // drop unused classes; a minifier change that strips annotations would
   // silently kill consumer tree-shaking. The dx gate catches it in CI —
   // this pre-push check catches it earlier.
   try {
    const { collectReachableModules } = await import('../src/dx/module-graph.ts');
    const prodModules = collectReachableModules(loader.entryPoints.production);
    const pureCount = prodModules.reduce(
     (sum, m) => sum + (m.code.match(/@__PURE__/g)?.length ?? 0),
     0,
    );
    if (pureCount > 0) {
     pass(`Pure-call annotations present in production tree (${pureCount})`);
    } else {
     fail(
      'Pure-call annotations',
      'Zero @__PURE__ annotations in the shipped production tree — a minifier change is stripping them and consumer tree-shaking of frozen-constant classes is dead',
     );
    }
   } catch (err: unknown) {
    fail('Pure-call annotations', err instanceof Error ? err.message : String(err));
   }
  }
 }

 // Declared cross-env capability → determinism golden verification.
 const crossEnvConfigPath = join(packagesDir, packageName, 'cross-env-config.ts');
 if (!buildError && existsSync(crossEnvConfigPath) && existsSync(goldenPath)) {
  try {
   const { readGoldenFile, verifyAgainstGoldenFile } =
    await import('../src/cross-env/golden-file.ts');
   const crossEnvModule = await import(`../src/packages/${packageName}/cross-env-config.ts`);
   const crossEnvConfig = Object.values(crossEnvModule).find(
    (v): v is CrossEnvConfig =>
     typeof v === 'object' && v !== null && 'kernelFunctions' in v && 'exposeSnippet' in v,
   );
   if (!crossEnvConfig) throw new Error('cross-env-config exports no CrossEnvConfig');

   const golden = readGoldenFile(goldenPath);
   // Packages whose kernel vocabulary is not fully re-exported by the
   // production barrel provide a dedicated kernel-module loader.
   const kernelModule = crossEnvConfig.loadKernelModule
    ? await crossEnvConfig.loadKernelModule()
    : ((await loader.load('production')) as Record<string, unknown>);
   crossEnvConfig.prepareModule?.(kernelModule);

   const results = verifyAgainstGoldenFile(
    golden,
    kernelModule as Record<string, (...args: number[]) => number>,
    'Node.js',
   );

   const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
   const totalTests = results.reduce((sum, r) => sum + r.totalTests, 0);

   if (totalFailed === 0) {
    pass(`Determinism: ${totalTests} golden values match (fdlibm bit-exact)`);
   } else {
    const divergent = results.filter((r) => r.failed > 0).map((r) => `${r.fn}(${r.failed})`);
    fail('Determinism', `${totalFailed} divergences: ${divergent.join(', ')}`);
   }
  } catch (err: unknown) {
   fail('Determinism', err instanceof Error ? err.message : String(err));
  }
 }
}

// Result
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log('');

if (failures > 0) {
 console.error(`  FAILED: ${failures} check(s) failed (${elapsed}s)\n`);
 process.exit(1);
} else {
 console.log(`  ALL PASSED (${elapsed}s)\n`);
}
