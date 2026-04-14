/**
 * Reference oracle wrapper around decimal.js.
 *
 * Provides high-precision reference values for all 11 scalar deterministic
 * kernel functions. Used by ULP accuracy stress tests to compare
 * fdlibm output against a mathematically precise reference.
 *
 * Uses decimal.js at 50-digit precision (far exceeding double's 15-16
 * significant digits), following the same oracle methodology as
 * glibc's libm test suite (which uses MPFR).
 */

import { computeReference, clearOracleCache } from '../harness/ulp.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export type KernelFunction =
 | 'sin' | 'cos' | 'tan'
 | 'asin' | 'acos' | 'atan' | 'atan2'
 | 'log' | 'exp' | 'pow'
 | 'hypot';

export const ALL_KERNEL_FUNCTIONS: KernelFunction[] = [
 'sin', 'cos', 'tan',
 'asin', 'acos', 'atan', 'atan2',
 'log', 'exp', 'pow',
 'hypot',
];

export interface OracleResult {
 fn: string;
 args: number[];
 reference: number;
}

/* ========================================================================== */
/* Domain-Aware Input Generation                                               */
/* ========================================================================== */

/**
 * Generate domain-appropriate input samples for a kernel function.
 *
 * Each function has a natural domain. Inputs are sampled across the
 * full valid domain including boundary regions, uniformly distributed
 * with extra density near critical points (0, pi/2, pi, etc.).
 */
export function generateInputs(fn: KernelFunction, count: number): number[][] {
 const inputs: number[][] = [];

 switch (fn) {
  case 'sin':
  case 'cos':
  case 'tan': {
   // Domain: all reals. Dense sampling near multiples of pi/2.
   for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    // Map to [-4pi, 4pi] with extra density near boundaries
    const x = (t * 8 - 4) * Math.PI;
    inputs.push([x]);
   }
   // Add exact boundary values
   inputs.push([0], [-0], [Math.PI / 6], [Math.PI / 4], [Math.PI / 3]);
   inputs.push([Math.PI / 2], [Math.PI], [2 * Math.PI]);
   // Multiples of pi/2 up to 1000*pi/2
   for (let k = 1; k <= 20; k++) {
    inputs.push([k * Math.PI / 2]);
   }
   break;
  }

  case 'asin':
  case 'acos': {
   // Domain: [-1, 1]
   for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    inputs.push([t * 2 - 1]);
   }
   inputs.push([0], [1], [-1], [0.5], [-0.5]);
   break;
  }

  case 'atan': {
   // Domain: all reals
   for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    inputs.push([Math.tan((t - 0.5) * Math.PI * 0.99)]);
   }
   inputs.push([0], [1], [-1], [1e10], [-1e10], [1e-10]);
   break;
  }

  case 'atan2': {
   // Domain: (y, x) any reals
   const sqrtCount = Math.ceil(Math.sqrt(count));
   for (let i = 0; i < sqrtCount; i++) {
    for (let j = 0; j < sqrtCount; j++) {
     const y = (i / (sqrtCount - 1)) * 20 - 10;
     const x = (j / (sqrtCount - 1)) * 20 - 10;
     inputs.push([y, x]);
    }
   }
   inputs.push([0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1]);
   break;
  }

  case 'log': {
   // Domain: (0, +inf)
   for (let i = 0; i < count; i++) {
    const t = (i + 1) / count;
    inputs.push([t * 1000]);
   }
   inputs.push([1], [Math.E], [10], [0.5], [1e-10], [1e10]);
   break;
  }

  case 'exp': {
   // Domain: all reals. Overflow near 709.78.
   for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    inputs.push([t * 1400 - 700]);
   }
   inputs.push([0], [1], [-1], [709], [710], [-745]);
   break;
  }

  case 'pow': {
   // Domain: base > 0 (for real results), any exponent
   const sqrtCount = Math.ceil(Math.sqrt(count));
   for (let i = 0; i < sqrtCount; i++) {
    for (let j = 0; j < sqrtCount; j++) {
     const base = (i + 1) / sqrtCount * 10;
     const exp = (j / (sqrtCount - 1)) * 10 - 5;
     inputs.push([base, exp]);
    }
   }
   inputs.push([2, 10], [10, 2], [Math.E, 1], [1, 100]);
   break;
  }

  case 'hypot': {
   // Domain: any reals
   const sqrtCount = Math.ceil(Math.sqrt(count));
   for (let i = 0; i < sqrtCount; i++) {
    for (let j = 0; j < sqrtCount; j++) {
     const x = (i / (sqrtCount - 1)) * 200 - 100;
     const y = (j / (sqrtCount - 1)) * 200 - 100;
     inputs.push([x, y]);
    }
   }
   inputs.push([3, 4], [0, 0], [1e154, 1e154], [1e-200, 1e-200]);
   break;
  }
 }

 return inputs;
}

/**
 * Compute reference values for a kernel function across all generated inputs.
 */
export function computeReferenceSet(
 fn: KernelFunction,
 sampleCount: number,
): OracleResult[] {
 const inputs = generateInputs(fn, sampleCount);
 const results: OracleResult[] = [];

 for (const args of inputs) {
  try {
   const reference = computeReference(fn, ...args);
   results.push({ fn, args, reference });
  } catch {
   // Skip inputs that cause oracle errors (e.g., domain violations)
  }
 }

 return results;
}

/**
 * Clear the oracle cache to free memory after stress runs.
 */
export { clearOracleCache };
