/**
 * @file cross-env/golden-file.ts
 * @description Determinism golden file generation and verification
 *
 * Generates JSON golden files from Node.js with hex-encoded Float64
 * inputs/outputs for all 11 scalar deterministic kernels. Covers 1000+
 * inputs per function including boundary values.
 */

import { writeFileSync, readFileSync } from 'node:fs';

import { float64ToHex, hexToFloat64, ulpDistance } from '../harness/ulp.ts';
import type { UlpResult } from '../harness/ulp.ts';
import { generateInputs, ALL_KERNEL_FUNCTIONS } from '../stress/reference-oracle.ts';
import type { KernelFunction } from '../stress/reference-oracle.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** Single entry in a golden file with hex-encoded inputs and expected output */
export interface GoldenFileEntry {
 fn: string;
 inputsHex: string[];
 expectedHex: string;
 inputsDecimal: number[];
 expectedDecimal: number;
}

/** Complete golden file with generator metadata and all test entries */
export interface GoldenFile {
 generator: string;
 timestamp: string;
 nodeVersion: string;
 entries: GoldenFileEntry[];
}

/** Per-function verification result against a golden file */
export interface VerificationResult {
 fn: string;
 totalTests: number;
 passed: number;
 failed: number;
 divergences: DivergenceDetail[];
}

/** Detailed information about a single bit-level divergence from the golden file */
export interface DivergenceDetail {
 fn: string;
 inputs: number[];
 expected: { hex: string; decimal: number };
 actual: { hex: string; decimal: number };
 ulpDistance: UlpResult;
}

/* ========================================================================== */
/* Golden File Generation                                                      */
/* ========================================================================== */

/**
 * Generate a golden file from the current engine's deterministic kernels
 *
 * Runs all 11 scalar kernel functions with 1000+ domain-sampled inputs
 * (including 0, -0, π multiples, Cody-Waite boundary, subnormals).
 * Serializes results as hex-encoded Float64 for bit-exact comparison.
 *
 * @param kernelModule - Module containing all kernel function implementations
 * @param samplesPerFunction - Number of domain-sampled inputs per function
 * @returns Golden file with all entries and generator metadata
 */
export function generateGoldenFile(
 kernelModule: Record<string, (...args: number[]) => number>,
 samplesPerFunction = 1000,
): GoldenFile {
 const entries: GoldenFileEntry[] = [];

 for (const fn of ALL_KERNEL_FUNCTIONS) {
  const impl = kernelModule[fn];
  if (typeof impl !== 'function') continue;

  const inputs = generateInputs(fn, samplesPerFunction);

  for (const args of inputs) {
   try {
    const result = impl(...args);
    entries.push({
     fn,
     inputsHex: args.map(float64ToHex),
     expectedHex: float64ToHex(result),
     inputsDecimal: args,
     expectedDecimal: result,
    });
   } catch {
    // Skip inputs that cause errors in the kernel
   }
  }
 }

 return {
  generator: `Node.js ${process.version} (V8)`,
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  entries,
 };
}

/**
 * Write a golden file to disk
 *
 * @param path - Absolute file path to write the golden file to
 * @param goldenFile - Golden file data to serialize as JSON
 */
export function writeGoldenFile(path: string, goldenFile: GoldenFile): void {
 writeFileSync(path, JSON.stringify(goldenFile, null, 2));
}

/**
 * Read a golden file from disk
 *
 * @param path - Absolute file path to read the golden file from
 * @returns Parsed golden file data
 */
export function readGoldenFile(path: string): GoldenFile {
 const content = readFileSync(path, 'utf-8');
 return JSON.parse(content) as GoldenFile;
}

/* ========================================================================== */
/* Golden File Verification                                                    */
/* ========================================================================== */

/**
 * Verify a kernel implementation against a golden file
 *
 * Compares each output bit-for-bit (via hex comparison). Reports
 * divergences with ULP distance and full diagnostic info.
 *
 * @param goldenFile - Reference golden file to compare against
 * @param kernelModule - Module containing kernel function implementations to verify
 * @param engineName - Name of the engine being verified (e.g., "V8", "SpiderMonkey")
 * @returns Array of per-function verification results
 */
export function verifyAgainstGoldenFile(
 goldenFile: GoldenFile,
 kernelModule: Record<string, (...args: number[]) => number>,
 engineName: string,
): VerificationResult[] {
 const resultsByFn = new Map<string, VerificationResult>();

 for (const entry of goldenFile.entries) {
  let fnResult = resultsByFn.get(entry.fn);
  if (!fnResult) {
   fnResult = { fn: entry.fn, totalTests: 0, passed: 0, failed: 0, divergences: [] };
   resultsByFn.set(entry.fn, fnResult);
  }
  fnResult.totalTests++;

  const impl = kernelModule[entry.fn];
  if (typeof impl !== 'function') {
   fnResult.failed++;
   continue;
  }

  // Decode inputs from hex
  const inputs = entry.inputsHex.map(hexToFloat64);

  try {
   const actual = impl(...inputs);
   const actualHex = float64ToHex(actual);

   if (actualHex === entry.expectedHex) {
    fnResult.passed++;
   } else {
    fnResult.failed++;
    fnResult.divergences.push({
     fn: entry.fn,
     inputs,
     expected: { hex: entry.expectedHex, decimal: entry.expectedDecimal },
     actual: { hex: actualHex, decimal: actual },
     ulpDistance: ulpDistance(entry.expectedDecimal, actual),
    });
   }
  } catch {
   fnResult.failed++;
  }
 }

 return [...resultsByFn.values()];
}
