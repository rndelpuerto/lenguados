/**
 * @file batch/simd/detector.ts
 * @module @lenguados/math2d/batch/simd
 * @description Platform capability detection for SIMD-accelerated paths.
 */

/**
 * WebAssembly bytecode for a minimal module that requires SIMD support.
 * The module exports a single function returning a `v128` constant; attempting
 * to compile it on runtimes without SIMD will throw.
 *
 * Source: Adapted from the official WebAssembly SIMD detection snippet.
 */
const SIMD_DETECTION_BYTES = new Uint8Array([
 0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 0, 3, 2, 1, 0, 5, 3, 1, 0, 1, 10, 11, 1, 9, 0,
 65, 0, 253, 15, 26, 11,
]);

/**
 * Internal state machine for SIMD detection.
 */
export enum SimdSupportState {
 UNKNOWN = 'unknown',
 AVAILABLE = 'available',
 UNAVAILABLE = 'unavailable',
}

/**
 * Capability detector for SIMD execution.
 *
 * @remarks
 * Detection is cached after the first invocation. Tests may override the
 * detection result via {@link SimdDetector.setForcedResult}.
 */
export class SimdDetector {
 private static state: SimdSupportState = SimdSupportState.UNKNOWN;
 private static supported = false;
 private static forced: boolean | undefined;

 /**
  * Performs detection (if necessary) and returns whether SIMD is supported.
  * @returns True when SIMD is available on the current runtime.
  */
 static detect(): boolean {
  if (this.forced !== undefined) {
   return this.forced;
  }

  if (this.state !== SimdSupportState.UNKNOWN) {
   return this.supported;
  }

  if (typeof WebAssembly === 'undefined' || typeof WebAssembly.Module !== 'function') {
   this.supported = false;
   this.state = SimdSupportState.UNAVAILABLE;
   return this.supported;
  }

  try {
   const module = new WebAssembly.Module(SIMD_DETECTION_BYTES);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Instance construction validates support.
   const _instance = new WebAssembly.Instance(module);
   this.supported = true;
   this.state = SimdSupportState.AVAILABLE;
  } catch {
   this.supported = false;
   this.state = SimdSupportState.UNAVAILABLE;
  }

  return this.supported;
 }

 /**
  * Returns the cached detection state. This triggers detection if it has not
  * yet been performed.
  * @returns Current detection state
  */
 static getState(): SimdSupportState {
  this.detect();
  return this.state;
 }

 /**
  * Forces a detection result (used for tests).
  * Passing `undefined` clears the forced result and resets cached state.
  * @param result - Desired detection outcome.
  */
 static setForcedResult(result: boolean | undefined): void {
  this.forced = result;
  if (result === undefined) {
   this.state = SimdSupportState.UNKNOWN;
   this.supported = false;
   return;
  }

  this.supported = result;
  this.state = result ? SimdSupportState.AVAILABLE : SimdSupportState.UNAVAILABLE;
 }

 /**
  * Resets cached state and forced overrides.
  * Primarily intended for tests.
  */
 static reset(): void {
  this.state = SimdSupportState.UNKNOWN;
  this.supported = false;
  this.forced = undefined;
 }
}
