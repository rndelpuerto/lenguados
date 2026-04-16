/**
 * Numeric safety functions benchmark suite.
 *
 * Per architecture-and-layers.md L1 Safety Rule: ALL domain-clamping
 * and fallback-returning functions live in auxiliary/numeric/safety.ts.
 *
 * Functions split into two groups based on deterministic kernel dependency:
 * - Kernel-dependent (acosSafe, asinSafe, expSafe, logSafe, powSafe):
 *   affected by config.useNativeMath → determinism dimension varies
 * - IEEE 754 only (divideSafe, reciprocalSafe, sqrtSafe):
 *   unaffected by determinism toggle
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

export const defineSuite = definePackageSuite({
 name: 'numeric',
 entity: 'numeric',
 extract: [],
 // Both determinism modes — acosSafe/expSafe/etc. use deterministic kernels.
 // Both builds — to measure assertion overhead.
 dimensions: {
  determinism: ['fdlibm', 'native'],
 },

 register(add, _triality, _modules, math2d) {
  const m = math2d;

  // IEEE 754 only — unaffected by determinism toggle but included for completeness
  add('divideSafe', () => m.divideSafe(10, 3));
  add('divideSafe (near-zero)', () => m.divideSafe(10, 1e-11));
  add('reciprocalSafe', () => m.reciprocalSafe(3));
  add('sqrtSafe', () => m.sqrtSafe(4));
  add('sqrtSafe (negative)', () => m.sqrtSafe(-1));

  // Kernel-dependent — affected by config.useNativeMath
  add('acosSafe', () => m.acosSafe(0.5));
  add('acosSafe (out-of-range)', () => m.acosSafe(1.5));
  add('asinSafe', () => m.asinSafe(0.5));
  add('logSafe', () => m.logSafe(10));
  add('logSafe (negative)', () => m.logSafe(-1));
  add('expSafe', () => m.expSafe(5));
  add('expSafe (overflow)', () => m.expSafe(800));
  add('powSafe', () => m.powSafe(2, 10));

  // Rounding (IEEE 754 only)
  add('roundToPlaces', () => m.roundToPlaces(3.14159, 2));
  add('roundToMultiple', () => m.roundToMultiple(7.3, 0.5));
  add('fract', () => m.fract(3.7));
  add('ceilPowerOfTwo', () => m.ceilPowerOfTwo(100));
  add('floorPowerOfTwo', () => m.floorPowerOfTwo(100));

  // Guards (IEEE 754 only)
  add('isDenormal', () => m.isDenormal(5e-324));
  add('flushDenormal', () => m.flushDenormal(5e-324));

  // Compensated arithmetic (IEEE 754 only)
  add('robustSum', () => m.robustSum([1e16, 1, -1e16, 1]));
  add('neumaierSum', () => m.neumaierSum([1e16, 1, -1e16, 1]));
 },
});
