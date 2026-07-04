/**
 * @file test/harness/cross-env-verify.test.ts
 * @description Test the fail-loud reporting seam of the cross-browser verifier
 *
 * The verify CLI's exit policy (any divergence or missing requested browser
 * fails unless `--allow-missing-browsers`) rests on the runner returning
 * skips as DATA instead of swallowing them at warn level. These tests pin
 * that seam: unknown/unavailable browsers land in `skipped` with a reason,
 * and a broken build state (unflattenable bundle) throws instead of
 * degrading to a skip. Full CLI exit-code semantics are covered by the
 * live-run probes in CI (determinism-browsers workflow) and locally via
 * `npm run tools:bench:cross-env -- --verify=baselines/golden.json`.
 */

import { describe, expect, it, afterAll } from '@jest/globals';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runCrossBrowserVerification } from '../../src/cross-env/playwright-runner.ts';
import type { BrowserName } from '../../src/cross-env/playwright-runner.ts';
import type { GoldenFile } from '../../src/cross-env/golden-file.ts';

const workDir = mkdtempSync(join(tmpdir(), 'cross-env-verify-test-'));

afterAll(() => {
 rmSync(workDir, { recursive: true, force: true });
});

const emptyGolden = { entries: [] } as unknown as GoldenFile;

/** Self-contained ESM fixture standing in for a built browser bundle */
function bundleFixture(): string {
 const path = join(workDir, 'bundle-fixture.mjs');
 writeFileSync(path, 'export const answer = 42;\n');
 return path;
}

describe('runCrossBrowserVerification skip reporting', () => {
 it('records an unknown browser as skipped with a reason instead of dropping it', async () => {
  const report = await runCrossBrowserVerification(
   emptyGolden,
   { browserBundlePath: bundleFixture(), exposeSnippet: 'window.__benchKernels = {};' },
   ['nonexistent-engine' as BrowserName],
  );
  expect(report.results).toEqual([]);
  expect(report.skipped).toEqual([
   { browser: 'nonexistent-engine', reason: 'not available in this Playwright build' },
  ]);
 });

 it('throws on an unflattenable bundle — broken build state must not degrade to a skip', async () => {
  await expect(
   runCrossBrowserVerification(
    emptyGolden,
    {
     browserBundlePath: join(workDir, 'does-not-exist.mjs'),
     exposeSnippet: 'window.__benchKernels = {};',
    },
    ['nonexistent-engine' as BrowserName],
   ),
  ).rejects.toThrow(/Cannot flatten package bundle/);
 });
});
