/**
 * Scalar auxiliary operations benchmark suite.
 *
 * Scalar functions do NOT use deterministic kernels (no sin/cos/etc.)
 * so the determinism dimension is not varied.
 * Functions with triality (mod, inverseLerp, etc.) are tagged by tier.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'scalar',
  // No deterministic kernels → single determinism value.
  // Tier IS declared — triality functions are filtered by cell tier.
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['scalar'],
  },

  setup(math2d) {
   const m = math2d as any;

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
   add('smootherStep', () => m.smootherStep(2.0, 8.0, 0.5));

   // Triality: mod
   add('mod', () => m.mod(7.5, 3.0), 'default');
   add('modSafe', () => m.modSafe(7.5, 3.0), 'safe');
   add('modUnchecked', () => m.modUnchecked(7.5, 3.0), 'unchecked');

   // Triality: inverseLerp
   add('inverseLerp', () => m.inverseLerp(2.0, 8.0, 5.0), 'default');
   add('inverseLerpSafe', () => m.inverseLerpSafe(2.0, 8.0, 5.0), 'safe');

   // Triality: loop
   add('loop', () => m.loop(7.5, 0, 5), 'default');
   add('loopSafe', () => m.loopSafe(7.5, 0, 5), 'safe');
   add('loopUnchecked', () => m.loopUnchecked(7.5, 0, 5), 'unchecked');

   // Triality: pingPong
   add('pingPong', () => m.pingPong(7.5, 0, 5), 'default');
   add('pingPongSafe', () => m.pingPongSafe(7.5, 0, 5), 'safe');
   add('pingPongUnchecked', () => m.pingPongUnchecked(7.5, 0, 5), 'unchecked');

   // Triality: floorDivide
   add('floorDivide', () => m.floorDivide(7, 3), 'default');
   add('floorDivideSafe', () => m.floorDivideSafe(7, 3), 'safe');
   add('floorDivideUnchecked', () => m.floorDivideUnchecked(7, 3), 'unchecked');

   // Triality: remap
   add('remap', () => m.remap(0.5, 0, 1, 10, 20), 'default');
   add('remapSafe', () => m.remapSafe(0.5, 0, 1, 10, 20), 'safe');
  },

  get benchmarks() { return entries; },
 };
}
