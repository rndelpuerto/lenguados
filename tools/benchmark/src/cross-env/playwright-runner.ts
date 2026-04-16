/**
 * Playwright cross-browser benchmark runner.
 *
 * Injects math2d ESM bundle + benchmark code into isolated browser
 * contexts (Chromium, Firefox, WebKit). Collects results via
 * page.evaluate(). Annotates results with detected timer resolution.
 *
 * Requires playwright as an optional dependency.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { resolvePackageRoot } from '../harness/loader-utils.ts';

const MATH2D_ROOT = resolvePackageRoot('math2d');
import type { GoldenFile, VerificationResult } from './golden-file.ts';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface CrossBrowserResult {
 browser: BrowserName;
 engine: string;
 timerResolutionUs: number;
 verificationResults: VerificationResult[];
}

/**
 * Load Playwright dynamically (optional dependency).
 * Returns null with a helpful message if not installed.
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
 * Detect the timer resolution available in the browser.
 * Returns resolution in microseconds.
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
 * Run determinism verification across specified browsers.
 *
 * Loads the math2d production bundle into each browser, executes
 * the golden file operations, and compares results bit-for-bit.
 */
export async function runCrossBrowserVerification(
 goldenFile: GoldenFile,
 browsers: BrowserName[] = ['chromium', 'firefox', 'webkit'],
): Promise<CrossBrowserResult[]> {
 const pw = await loadPlaywright();
 if (!pw) return [];

 const bundlePath = join(MATH2D_ROOT, 'lib', 'esm', 'module.js');
 let bundleCode: string;
 try {
  bundleCode = readFileSync(bundlePath, 'utf-8');
 } catch {
  console.error(`  Cannot read math2d bundle at ${bundlePath}. Run npm run dist first.`);
  return [];
 }

 const results: CrossBrowserResult[] = [];

 for (const browserName of browsers) {
  const browserType = pw[browserName];
  if (!browserType) {
   console.warn(`  Browser ${browserName} not available in Playwright, skipping.`);
   continue;
  }

  const browser = await browserType.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
   // Detect timer resolution
   const timerRes = await detectTimerResolution(page);

   // Inject math2d bundle as a <script> so its fdlibm kernels execute in-browser.
   // This tests the ACTUAL fdlibm implementation across engines, not native Math.*.
   await page.setContent(`
    <html><head><script type="module">
    ${bundleCode}
    // Expose deterministic kernels on window for the evaluate() call
    window.__math2d = { sin, cos, tan, asin, acos, atan, atan2, log, exp, pow, hypot, config };
    // Ensure fdlibm mode (not native)
    window.__math2d.config.useNativeMath = false;
    </script></head><body></body></html>
   `);

   // Wait for the module to load
   await page.waitForFunction(() => (window as any).__math2d !== undefined, { timeout: 5000 });

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

     // Use math2d's fdlibm kernels injected via the script tag
     const m2d = (window as any).__math2d;
     const kernels: Record<string, (...args: number[]) => number> = {
      sin: m2d.sin,
      cos: m2d.cos,
      tan: m2d.tan,
      asin: m2d.asin,
      acos: m2d.acos,
      atan: m2d.atan,
      atan2: m2d.atan2,
      log: m2d.log,
      exp: m2d.exp,
      pow: m2d.pow,
      hypot: m2d.hypot,
     };

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

 return results;
}
