/**
 * @file scripts/dx.ts
 * @description Run DX (Developer Experience) analysis from the CLI
 *
 * Measure bundle size, tree-shaking, build correctness,
 * assertion elimination, and dev vs prod size comparison.
 * Resolves the target package via --package=name (default math2d);
 * a package without a dx-config fails loudly naming the capability.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureBuildArtifacts, loadPackageLoader, parseCommonFlags } from './run.ts';
import { collectMetadata, createLatestPointer } from '../src/harness/reporter.ts';
import { runBundleSizeAnalysis } from '../src/dx/bundle-size.ts';
import { verifyTreeShaking, MIN_REDUCTION_PERCENT } from '../src/dx/tree-shaking.ts';
import { verifyBuildCorrectness } from '../src/dx/build-correctness.ts';
import { verifyAssertionElimination } from '../src/dx/assertion-elimination.ts';
import { compareBuildSizes, formatBuildComparison } from '../src/dx/build-comparison.ts';

import type { DxConfig } from '../src/harness/dx-types.ts';
import type { DxReport } from '../src/harness/result-types.ts';

const { packageName } = parseCommonFlags(process.argv.slice(2));
const loader = await loadPackageLoader(packageName);

// Resolve the package's dx-config by convention. The existsSync precheck makes
// "package lacks the dx capability" unambiguous; an import error from an
// EXISTING config (broken transitive import) is re-thrown verbatim so real
// bugs are never masked as a missing capability.
const dxConfigPath = fileURLToPath(
 new URL(`../src/packages/${packageName}/dx-config.ts`, import.meta.url),
);
if (!existsSync(dxConfigPath)) {
 console.error(
  `\n  ERROR: package '${packageName}' lacks the dx capability (no src/packages/${packageName}/dx-config.ts).\n`,
 );
 process.exit(1);
}
const dxConfigModule = await import(`../src/packages/${packageName}/dx-config.ts`);
const dxConfig = Object.values(dxConfigModule).find(
 (v): v is DxConfig =>
  typeof v === 'object' && v !== null && 'root' in v && 'imports' in v && 'assertionProbe' in v,
);
if (!dxConfig) {
 console.error(
  `\n  ERROR: src/packages/${packageName}/dx-config.ts exports no DxConfig-shaped object.\n`,
 );
 process.exit(1);
}

await ensureBuildArtifacts(['development', 'production'], loader);

console.log('\n  DX Analysis\n  ===========\n');

// 1. Bundle Size
console.log('  1. Bundle Size per Import Path');
const sizeResults = runBundleSizeAnalysis(dxConfig);
for (const r of sizeResults) {
 // Budget status is informational here — the enforcing gate is scripts/size.ts.
 const budgetInfo =
  r.budgetGzipBytes !== undefined
   ? ` (budget ${(r.budgetGzipBytes / 1024).toFixed(1)} KB — ${r.gzipBytes <= r.budgetGzipBytes ? 'within' : 'OVER'})`
   : '';
 console.log(
  `    ${r.importPath}: ${(r.rawBytes / 1024).toFixed(1)} KB raw, ${(r.gzipBytes / 1024).toFixed(1)} KB gzip${budgetInfo}`,
 );
}

// 2. Tree-Shaking — ENFORCED: a below-threshold reduction OR a dishonored
// sideEffects flag is a distribution regression (re-coupled module graph,
// stripped pure-call annotations, or a shadowed sideEffects marker) and MUST
// fail the run, not just print a boolean.
console.log('\n  2. Tree-Shaking Effectiveness');
const treeShaking = verifyTreeShaking(dxConfig);
console.log(`    Full library: ${(treeShaking.fullSize / 1024).toFixed(1)} KB`);
console.log(`    Minimal import: ${(treeShaking.minimalSize / 1024).toFixed(1)} KB`);
console.log(
 `    Reduction: ${treeShaking.reductionPercent.toFixed(1)}% (threshold: ${MIN_REDUCTION_PERCENT}%)`,
);
console.log(`    Effective: ${treeShaking.effectiveTreeShaking ? 'YES' : 'NO'}`);
console.log(`    sideEffects:false honored: ${treeShaking.sideEffectsEmpty ? 'YES' : 'NO'}`);
if (!treeShaking.effectiveTreeShaking) {
 console.error(
  `\n  ERROR: tree-shaking regression — minimal-import reduction ${treeShaking.reductionPercent.toFixed(1)}% is below the required ${MIN_REDUCTION_PERCENT}%.` +
   '\n  Likely causes: the production ESM dist collapsed back to a single flat bundle, pure-call annotations were stripped by a minifier change, or the lib/esm/package.json sideEffects flag was lost.\n',
 );
 process.exit(1);
}
if (!treeShaking.sideEffectsEmpty) {
 console.error(
  '\n  ERROR: sideEffects regression — an empty import retains code, so whole-module elimination is dead for consumers.' +
   '\n  Likely cause: the sideEffects flag was lost from package.json or from the emitted lib/esm/package.json (the nearest-package.json shadows the root flag).\n',
 );
 process.exit(1);
}

// 3. Build Correctness
console.log('\n  3. Production Build Correctness');
const { correctness, assertions } = await verifyBuildCorrectness(loader, dxConfig);
const allMatch = correctness.every((r) => r.match);
console.log(`    Results match dev/prod: ${allMatch ? 'ALL MATCH' : 'MISMATCH DETECTED'}`);
for (const r of correctness) {
 if (!r.match) console.log(`      MISMATCH: ${r.operation}`);
}
for (const a of assertions) {
 console.log(
  `    ${a.operation}: dev throws=${a.devThrows}, prod throws=${a.prodThrows} — ${a.correctBehavior ? 'OK' : 'ISSUE'}`,
 );
}

// 4. Assertion Elimination
console.log('\n  4. Assertion Elimination');
const elimination = verifyAssertionElimination(dxConfig);
console.log(`    Production bundle: ${(elimination.prodBundle.size / 1024).toFixed(1)} KB`);
// Assertion identifiers in prod is INFORMATIONAL — assertion function exports may remain as
// no-op stubs in the prod bundle (they are part of the package public surface). The actual
// DCE health is `eliminationVerified` which requires zero assertion-call-site labels in prod.
console.log(
 `    Assertion identifiers in prod: ${elimination.prodBundle.containsAssertions ? 'present (informational, no-op stubs)' : 'absent'}`,
);
console.log(
 `    Call-site labels in prod: ${elimination.prodBundle.callSiteLabels.length === 0 ? 'NONE (OK)' : `FOUND (BAD): ${elimination.prodBundle.callSiteLabels.join(', ')}`}`,
);
console.log(
 `    DEV_MODE in prod: ${elimination.prodBundle.containsDevMode ? 'FOUND (BAD)' : 'NONE (OK)'}`,
);
console.log(
 `    Assertions in dev: ${elimination.devBundle.containsAssertions ? 'PRESENT (OK)' : 'MISSING (BAD)'}`,
);
console.log(`    Elimination verified: ${elimination.eliminationVerified ? 'YES' : 'NO'}`);
if (elimination.prodBundle.foundPatterns.length > 0) {
 console.log(`    Identifiers present in prod: ${elimination.prodBundle.foundPatterns.join(', ')}`);
}

// 5. Build Size Comparison
console.log('\n  5. Build Size Comparison');
const comparison = compareBuildSizes(dxConfig);
console.log('  ' + formatBuildComparison(comparison).replace(/\n/g, '\n  '));

console.log('');

// Persist JSON report (package-namespaced)
const RESULTS_DIR = fileURLToPath(new URL(`../results/${packageName}/`, import.meta.url));
mkdirSync(RESULTS_DIR, { recursive: true });

const report: DxReport = {
 metadata: collectMetadata(packageName),
 bundleSize: sizeResults,
 treeShaking,
 buildCorrectness: { correctness, assertions },
 assertionElimination: elimination,
 buildComparison: comparison,
};

const filename = `dx-${report.metadata.timestamp.replace(/[:.]/g, '-')}.json`;
const filepath = join(RESULTS_DIR, filename);
const latestPath = join(RESULTS_DIR, 'dx-latest.json');
writeFileSync(filepath, JSON.stringify(report, null, 2));
createLatestPointer(filepath, latestPath, filename);
console.log(`  Results saved to: ${filepath}\n`);
