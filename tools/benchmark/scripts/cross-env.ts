/**
 * @file scripts/cross-env.ts
 * @description Run cross-environment determinism verification from the CLI
 *
 * Usage: npm run cross-env -- [--browsers=chromium,firefox,webkit]
 *        [--generate-golden] [--verify=path/to/golden.json]
 */

import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';
import {
 generateGoldenFile,
 writeGoldenFile,
 readGoldenFile,
 verifyAgainstGoldenFile,
} from '../src/cross-env/golden-file.ts';
import { runCrossBrowserVerification } from '../src/cross-env/playwright-runner.ts';
import type { BrowserName } from '../src/cross-env/playwright-runner.ts';
import { hashFloat64Array } from '../src/cross-env/state-hash.ts';

const args = process.argv.slice(2);
const generateGolden = args.includes('--generate-golden');
const verifyPath = args.find((a) => a.startsWith('--verify='))?.split('=')[1];
const browsersArg = args.find((a) => a.startsWith('--browsers='))?.split('=')[1];
const browsers = (browsersArg?.split(',') ?? ['chromium', 'firefox', 'webkit']) as BrowserName[];

const loader = await loadPackageLoader('math2d');
await ensureBuildArtifacts(['production'], loader);

const math2d = await loader.load('production');
const config = loader.getConfig?.(math2d);
if (config && 'useNativeMath' in config) {
 config['useNativeMath'] = false;
}

if (generateGolden) {
 console.log('\n  Generating golden file from Node.js (V8/fdlibm)...');
 const golden = generateGoldenFile(math2d as Record<string, (...args: number[]) => number>);
 const path = 'results/golden.json';
 writeGoldenFile(path, golden);
 console.log(`  Golden file: ${golden.entries.length} entries written to ${path}`);

 // Hash the golden state for quick verification
 const values = golden.entries.map((e) => e.expectedDecimal);
 console.log(`  State hash: ${hashFloat64Array(values)}`);
 console.log('');
} else if (verifyPath) {
 console.log(`\n  Verifying against golden file: ${verifyPath}`);
 const golden = readGoldenFile(verifyPath);

 // Node.js verification (same engine as generator)
 console.log('  Node.js (V8):');
 const nodeResults = verifyAgainstGoldenFile(
  golden,
  math2d as Record<string, (...args: number[]) => number>,
  'Node.js',
 );
 for (const r of nodeResults) {
  console.log(`    ${r.fn}: ${r.passed}/${r.totalTests} passed, ${r.failed} failed`);
 }

 // Cross-browser verification
 console.log(`\n  Running cross-browser verification: ${browsers.join(', ')}`);
 const browserResults = await runCrossBrowserVerification(golden, browsers);
 for (const br of browserResults) {
  console.log(`\n  ${br.browser} (${br.engine}, timer: ${br.timerResolutionUs.toFixed(0)}us):`);
  for (const r of br.verificationResults) {
   const status = r.failed === 0 ? 'ALL MATCH' : `${r.failed} DIVERGENCES`;
   console.log(`    ${r.fn}: ${r.passed}/${r.totalTests} — ${status}`);
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
 console.log('');
} else {
 console.log(`
  Usage: npm run cross-env -- [options]

  Options:
    --generate-golden      Generate golden file from Node.js (V8)
    --verify=<path>        Verify golden file against current engine + browsers
    --browsers=<list>      Browsers: chromium,firefox,webkit (default: all)
 `);
}
