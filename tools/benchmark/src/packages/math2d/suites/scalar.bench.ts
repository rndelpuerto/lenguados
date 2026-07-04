/**
 * @file packages/math2d/suites/scalar.bench.ts
 * @description Scalar auxiliary operations benchmark suite
 *
 * Scalar functions do NOT use deterministic kernels (no sin/cos/etc.)
 * so the determinism dimension is not varied.
 * Functions with triality (mod, inverseLerp, etc.) are tagged by tier.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

/**
 * Define the scalar auxiliary operations benchmark suite
 *
 * @remarks
 * Benchmarks scalar interpolation (lerp, smoothStep), clamping, comparison,
 * and triality operations (mod, inverseLerp, loop, floorDivide) across all
 * three validation tiers. No deterministic kernels are involved, so only
 * one determinism mode is used.
 */
export const defineSuite = definePackageSuite({
 name: 'scalar',
 entity: 'scalar',
 extract: [],
 // No deterministic kernels → single determinism value.
 // Tier IS declared — triality functions are filtered by cell tier.
 dimensions: {
  determinism: ['fdlibm'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, _modules, math2d) {
  const m = math2d;

  // Tier-agnostic operations (no tier tag → run in every tier cell)
  add('clamp', () => m.clamp(7.5, 0, 10));
  add('lerp', () => m.lerp(2.0, 8.0, 0.5));
  add('smoothStep', () => m.smoothStep(2.0, 8.0, 0.5));
  add('saturate', () => m.saturate(0.7));
  add('step', () => m.step(5.0, 3.0));
  add('nearEquals', () => m.nearEquals(1.0, 1.0 + 1e-11));
  add('isNearZero', () => m.isNearZero(1e-11));
  add('relativeEquals', () => m.relativeEquals(100, 100.001));
  add('lerpClamped', () => m.lerpClamped(2.0, 8.0, 1.5));

  // Triality: mod
  triality({
   default: ['mod', () => m.mod(7.5, 3.0)],
   safe: ['modSafe', () => m.modSafe(7.5, 3.0)],
   unchecked: ['modUnchecked', () => m.modUnchecked(7.5, 3.0)],
  });

  // Triality: inverseLerp
  triality({
   default: ['inverseLerp', () => m.inverseLerp(2.0, 8.0, 5.0)],
   safe: ['inverseLerpSafe', () => m.inverseLerpSafe(2.0, 8.0, 5.0)],
  });

  // Triality: loop
  triality({
   default: ['loop', () => m.loop(7.5, 0, 5)],
   safe: ['loopSafe', () => m.loopSafe(7.5, 0, 5)],
   unchecked: ['loopUnchecked', () => m.loopUnchecked(7.5, 0, 5)],
  });

  // Triality: floorDivide
  triality({
   default: ['floorDivide', () => m.floorDivide(7, 3)],
   safe: ['floorDivideSafe', () => m.floorDivideSafe(7, 3)],
   unchecked: ['floorDivideUnchecked', () => m.floorDivideUnchecked(7, 3)],
  });
 },
});
