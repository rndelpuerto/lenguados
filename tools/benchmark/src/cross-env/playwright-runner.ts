/**
 * @file cross-env/playwright-runner.ts
 * @description Playwright cross-browser benchmark runner
 *
 * Injects the target package's ESM bundle + benchmark code into isolated
 * browser contexts (Chromium, Firefox, WebKit). The bundle path and the
 * kernel-exposing snippet come from the package's CrossEnvConfig — this
 * module never names a specific package. Collects results via
 * page.evaluate(). Annotates results with detected timer resolution.
 *
 * The production ESM dist is a module TREE (thin entry importing relative
 * sibling modules) — relative specifiers cannot resolve inside an inlined
 * `<script type="module">` (it has no base URL), so the entry + expose
 * snippet are PRE-FLATTENED with esbuild (an explicit lab devDependency)
 * into a temporary self-contained module under `.tmp/` before injection.
 * With `minify: false` the transform is a near-identity module concatenation:
 * kernel number literals and arithmetic pass through untouched, so golden
 * verification stays bit-exact. A flat single-file bundle degenerates to a
 * single-module concatenation.
 *
 * Requires playwright as an optional dependency.
 */

import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CrossEnvConfig } from './cross-env-types.ts';
import type { GoldenFile, VerificationResult } from './golden-file.ts';

/** Supported Playwright browser engine names */
export type BrowserName = 'chromium' | 'firefox' | 'webkit';

/** Determinism verification result for a single browser engine */
export interface CrossBrowserResult {
 browser: BrowserName;
 engine: string;
 timerResolutionUs: number;
 verificationResults: VerificationResult[];
}

/** Requested browser that could not run, with the human-readable cause */
export interface SkippedBrowser {
 browser: BrowserName;
 reason: string;
}

/**
 * Full cross-browser verification report
 *
 * @remarks
 * Skips are DATA, not policy: the runner records every requested browser
 * that could not execute (Playwright absent, engine not installed, launch
 * failure) and leaves the pass/fail decision to the caller. The CLI fails
 * on skips by default and downgrades to warnings only under an explicit
 * `--allow-missing-browsers` opt-out — a silent skip in CI would remove
 * the verification's purpose while reporting green.
 */
export interface CrossBrowserVerificationReport {
 results: CrossBrowserResult[];
 skipped: SkippedBrowser[];
}

const TEMP_DIR = fileURLToPath(new URL('../../.tmp/', import.meta.url));

/**
 * Pre-flatten the browser bundle entry + expose snippet into one module
 *
 * @remarks
 * esbuild bundles a synthetic entry that imports the package's module
 * namespace as `__benchModule` and appends the package's expose snippet.
 * Bundling the snippet TOGETHER with the entry lets it reach exports through
 * their PUBLIC export names — robust against minifier-mangled internal
 * identifiers in the shipped tree, where a bare `sin` binding no longer
 * exists at module top level.
 *
 * @param bundlePath - Absolute path of the package's browser ESM entry
 * @param exposeSnippet - Package snippet assigning `window.__benchKernels`
 * @returns Absolute path of the flattened temp file (caller must clean up)
 */
async function flattenForInjection(bundlePath: string, exposeSnippet: string): Promise<string> {
 const esbuild = await import('esbuild');
 mkdirSync(TEMP_DIR, { recursive: true });
 const outFile = join(TEMP_DIR, `browser-inject-${process.pid}-${Date.now()}.mjs`);

 await esbuild.build({
  stdin: {
   contents: `import * as __benchModule from ${JSON.stringify(bundlePath)};\n${exposeSnippet}\n`,
   resolveDir: dirname(bundlePath),
   sourcefile: 'bench-inject-entry.mjs',
   loader: 'js',
  },
  bundle: true,
  format: 'esm',
  minify: false,
  write: true,
  outfile: outFile,
  logLevel: 'silent',
 });

 return outFile;
}

/**
 * Load Playwright dynamically (optional dependency)
 *
 * @returns Playwright module, or null if not installed
 */
async function loadPlaywright(): Promise<any | null> {
 try {
  return await import('playwright');
 } catch {
  console.error(
   '\n  Playwright is not installed. Cross-browser tests require it.\n' +
    '  Install with: cd tools/benchmark && npm install playwright\n' +
    '  Then run: npx playwright install\n',
  );
  return null;
 }
}

/**
 * Detect the timer resolution available in the browser
 *
 * @param page - Playwright page instance to evaluate in
 * @returns Timer resolution in microseconds
 */
async function detectTimerResolution(page: any): Promise<number> {
 return page.evaluate(() => {
  const samples: number[] = [];
  let prev = performance.now();
  for (let i = 0; i < 1000; i++) {
   const now = performance.now();
   if (now !== prev) {
    samples.push(now - prev);
    prev = now;
   }
  }
  if (samples.length === 0) return 1000; // 1ms fallback
  samples.sort((a: number, b: number) => a - b);
  return samples[0]! * 1000; // Convert ms to us
 });
}

/**
 * Run determinism verification across specified browsers
 *
 * Pre-flattens the configured package bundle, loads it into each browser,
 * executes the golden file operations, and compares results bit-for-bit.
 *
 * @param goldenFile - Reference golden file generated from Node.js
 * @param config - Package cross-env configuration (bundle path + expose snippet)
 * @param browsers - Browser engines to verify against
 * @returns Report with per-browser verification results and skipped browsers
 * @throws {Error} When the built bundle cannot be flattened for injection —
 * a broken build state must never degrade to a skip
 */
export async function runCrossBrowserVerification(
 goldenFile: GoldenFile,
 config: Pick<CrossEnvConfig, 'browserBundlePath' | 'exposeSnippet'>,
 browsers: BrowserName[] = ['chromium', 'firefox', 'webkit'],
): Promise<CrossBrowserVerificationReport> {
 const pw = await loadPlaywright();
 if (!pw) {
  return {
   results: [],
   skipped: browsers.map((browser) => ({ browser, reason: 'Playwright is not installed' })),
  };
 }

 // Pre-flatten the entry (tree or flat) + expose snippet into ONE
 // self-contained module — an inlined <script type="module"> cannot resolve
 // relative imports.
 const bundlePath = config.browserBundlePath;
 let flattenedPath: string;
 let bundleCode: string;
 try {
  flattenedPath = await flattenForInjection(bundlePath, config.exposeSnippet);
  bundleCode = readFileSync(flattenedPath, 'utf-8');
 } catch (err: unknown) {
  const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
  throw new Error(
   `Cannot flatten package bundle at ${bundlePath} (${msg}). Run npm run dist first.`,
  );
 }

 try {
  return await runBrowsers(pw, goldenFile, bundleCode, browsers);
 } finally {
  rmSync(flattenedPath, { force: true });
 }
}

/**
 * Execute the golden-file verification in each requested browser engine
 *
 * @param pw - Loaded Playwright module
 * @param goldenFile - Reference golden file generated from Node.js
 * @param bundleCode - Flattened self-contained module code to inject
 * @param browsers - Browser engines to verify against
 * @returns Report with per-browser verification results and skipped browsers
 */
async function runBrowsers(
 pw: any,
 goldenFile: GoldenFile,
 bundleCode: string,
 browsers: BrowserName[],
): Promise<CrossBrowserVerificationReport> {
 const results: CrossBrowserResult[] = [];
 const skipped: SkippedBrowser[] = [];

 for (const browserName of browsers) {
  const browserType = pw[browserName];
  if (!browserType) {
   skipped.push({ browser: browserName, reason: 'not available in this Playwright build' });
   continue;
  }

  // Launch failures (missing browser binaries — `npx playwright install <name>`
  // not run) are recorded as skips, not crashes, so the remaining engines
  // still verify; the CALLER decides whether skips fail the run.
  let browser;
  try {
   browser = await browserType.launch();
  } catch (err: unknown) {
   const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
   skipped.push({ browser: browserName, reason: `launch failed: ${msg}` });
   continue;
  }
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
   // Inject the flattened bundle as a <script> so its deterministic kernels
   // execute in-browser — testing the ACTUAL implementation across engines,
   // not native Math.*. The expose snippet (from the package's
   // CrossEnvConfig) is already compiled into the flattened module and
   // assigns the kernel record to window.__benchKernels.
   //
   // The FIRST classic script installs the esbuild `keepNames` helper shim:
   // tsx decorates named functions inside page.evaluate callbacks with
   // module-scoped `__name(fn, "fn")` calls, and Playwright serializes
   // callbacks via Function.prototype.toString() — without the shim, every
   // callback containing a named inner function crashes in-browser with
   // "ReferenceError: __name is not defined". It lives in the injected HTML
   // (not page.addInitScript) because setContent is not a navigation, so
   // init scripts do not apply to this document — verified empirically.
   await page.setContent(`
    <html><head><script>
    globalThis.__name = (target, value) => Object.defineProperty(target, 'name', { value, configurable: true });
    </script><script type="module">
    ${bundleCode}
    </script></head><body></body></html>
   `);

   // Detect timer resolution (after setContent so the shim guards every
   // evaluate on this page, current and future)
   const timerRes = await detectTimerResolution(page);

   // Wait for the module to load
   await page.waitForFunction(() => (window as any).__benchKernels !== undefined, {
    timeout: 5000,
   });

   const verificationResults = await page.evaluate(
    ({ entries }: { entries: typeof goldenFile.entries }) => {
     // This runs inside the browser context with math2d's fdlibm loaded
     const results: Array<{
      fn: string;
      totalTests: number;
      passed: number;
      failed: number;
      divergences: Array<{
       fn: string;
       inputs: number[];
       expectedHex: string;
       actualHex: string;
       expectedDecimal: number;
       actualDecimal: number;
      }>;
     }> = [];

     // Float64 hex conversion inside browser
     const buf = new ArrayBuffer(8);
     const f64 = new Float64Array(buf);
     const u8 = new Uint8Array(buf);

     function toHex(v: number): string {
      f64[0] = v;
      let hex = '';
      for (let i = 7; i >= 0; i--) hex += u8[i]!.toString(16).padStart(2, '0');
      return hex;
     }

     function fromHex(hex: string): number {
      for (let i = 0; i < 8; i++) u8[7 - i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      return f64[0]!;
     }

     // Use the package's deterministic kernels injected via the script tag;
     // dispatch is by golden-entry function name on the exposed record.
     const kernels = (window as any).__benchKernels as Record<
      string,
      (...args: number[]) => number
     >;

     const fnMap = new Map<string, (typeof results)[0]>();

     for (const entry of entries) {
      let r = fnMap.get(entry.fn);
      if (!r) {
       r = { fn: entry.fn, totalTests: 0, passed: 0, failed: 0, divergences: [] };
       fnMap.set(entry.fn, r);
      }
      r.totalTests++;

      const impl = kernels[entry.fn];
      if (!impl) {
       r.failed++;
       continue;
      }

      const inputs = entry.inputsHex.map(fromHex);
      try {
       const actual = impl(...inputs);
       const actualHex = toHex(actual);
       if (actualHex === entry.expectedHex) {
        r.passed++;
       } else {
        r.failed++;
        r.divergences.push({
         fn: entry.fn,
         inputs,
         expectedHex: entry.expectedHex,
         actualHex,
         expectedDecimal: entry.expectedDecimal,
         actualDecimal: actual,
        });
       }
      } catch {
       r.failed++;
      }
     }

     return [...fnMap.values()];
    },
    { entries: goldenFile.entries },
   );

   const engineMap: Record<BrowserName, string> = {
    chromium: 'V8',
    firefox: 'SpiderMonkey',
    webkit: 'JavaScriptCore',
   };

   results.push({
    browser: browserName,
    engine: engineMap[browserName],
    timerResolutionUs: timerRes,
    verificationResults: verificationResults.map((r: any) => ({
     fn: r.fn,
     totalTests: r.totalTests,
     passed: r.passed,
     failed: r.failed,
     divergences: r.divergences.map((d: any) => ({
      fn: d.fn,
      inputs: d.inputs,
      expected: { hex: d.expectedHex, decimal: d.expectedDecimal },
      actual: { hex: d.actualHex, decimal: d.actualDecimal },
      ulpDistance: { kind: 'ulp' as const, distance: -1 },
     })),
    })),
   });
  } finally {
   await context.close();
   await browser.close();
  }
 }

 return { results, skipped };
}
