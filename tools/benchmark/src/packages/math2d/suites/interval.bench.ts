/**
 * Interval benchmark suite.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

export const defineSuite = definePackageSuite({
 name: 'Interval',
 entity: 'Interval',
 extract: ['Interval'],
 // Interval uses only IEEE 754 operations (Math.sqrt, Math.floor, etc.)
 // — no deterministic kernels. config.useNativeMath has no effect.
 // Only fdlibm dimension is declared (single value = no variation).
 dimensions: {
  determinism: ['fdlibm'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, { Interval: I }) {
  const a = I.fromValues(2, 8);
  const b = I.fromValues(5, 12);
  const out = I.fromValues(0, 0);

  // Factories
  add('Interval.fromValues (out)', () => I.fromValues(2, 8, out));
  add('Interval.fromCenterRadius (out)', () => I.fromCenterRadius(5, 3, out));

  // Arithmetic
  add('Interval.add (out)', () => I.add(a, b, out));
  add('Interval.subtract (out)', () => I.subtract(a, b, out));
  add('Interval.multiply (out)', () => I.multiply(a, b, out));
  add('Interval.multiplyScalar (out)', () => I.multiplyScalar(a, 2.5, out));
  add('Interval.negate (out)', () => I.negate(a, out));
  add('Interval.square (out)', () => I.square(a, out));

  // Divide triality
  triality({
   default: ['Interval.divideScalar', () => I.divideScalar(a, 2.5, out)],
   safe: ['Interval.divideScalarSafe', () => I.divideScalarSafe(a, 2.5, out)],
   unchecked: ['Interval.divideScalarUnchecked', () => I.divideScalarUnchecked(a, 2.5, out)],
  });

  // Sqrt triality
  triality({
   default: ['Interval.sqrt', () => I.sqrt(a, out)],
   safe: ['Interval.sqrtSafe', () => I.sqrtSafe(a, out)],
   unchecked: ['Interval.sqrtUnchecked', () => I.sqrtUnchecked(a, out)],
  });

  // Set operations
  add('Interval.hull (out)', () => I.hull(a, b, out));
  add('Interval.union (out)', () => I.union(a, b, out));
  add('Interval.intersect (out)', () => I.intersect(a, b, out));
  add('Interval.expand (out)', () => I.expand(a, 1.0, out));
  add('Interval.shrink (out)', () => I.shrink(a, 1.0, out));

  // Scalar reductions
  add('Interval.width', () => I.width(a));
  add('Interval.center', () => I.center(a));
  add('Interval.radius', () => I.radius(a));
  add('Interval.clampValue', () => I.clampValue(a, 3.0));
  add('Interval.sample', () => I.sample(a, 0.5));
  add('Interval.distance', () => I.distance(a, b));

  // Predicates
  add('Interval.contains', () => I.contains(a, 5.0));
  add('Interval.overlaps', () => I.overlaps(a, b));
  add('Interval.nearEquals', () => I.nearEquals(a, b));

  // Interpolation
  add('Interval.lerp (out)', () => I.lerp(a, b, 0.5, out));
 },
});
