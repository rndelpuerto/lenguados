/**
 * Angle auxiliary operations benchmark suite.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'angle',
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   entity: ['angle'],
  },

  setup(math2d) {
   const m = math2d as any;

   // Conversion
   add('degreesToRadians', () => m.degreesToRadians(45));
   add('radiansToDegrees', () => m.radiansToDegrees(0.785));
   add('turnsToRadians', () => m.turnsToRadians(0.25));
   add('radiansToTurns', () => m.radiansToTurns(1.571));

   // Normalization
   add('normalizeRadians', () => m.normalizeRadians(7.5));
   add('normalizeRadiansPositive', () => m.normalizeRadiansPositive(-1.5));

   // Operations (uses deterministic sin/cos)
   add('sinCos', () => m.sinCos(0.7));
   add('angleDifference', () => m.angleDifference(0.5, 3.0));
   add('angleDistance', () => m.angleDistance(0.5, 3.0));
   add('anglesNearEqual', () => m.anglesNearEqual(0.5, 0.5 + 1e-11));
   add('clampAngle', () => m.clampAngle(0.5, 0, Math.PI));
   add('isAngleBetween', () => m.isAngleBetween(0.5, 0, Math.PI));

   // Interpolation
   add('lerpAngle', () => m.lerpAngle(0.5, 2.5, 0.5));
   add('lerpAngleClamped', () => m.lerpAngleClamped(0.5, 2.5, 0.5));
   add('smoothStepAngle', () => m.smoothStepAngle(0.5, 2.5, 0.5));

   // Unwrapping
   add('unwrapAngles', () => m.unwrapAngles([0, 3.1, 6.2, -0.1, -3.2]));
  },

  get benchmarks() { return entries; },
 };
}
